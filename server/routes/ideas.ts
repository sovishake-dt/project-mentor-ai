import { Router, Request, Response } from 'express';
import { generateWithGemini } from '../services/gemini';
import { PromptBuilder } from '../services/promptBuilder';
import { safeJsonParse } from '../utils/jsonFixer';
import {
  StudentProfile,
  ProjectIdea,
  IdeaComparison,
} from '../../src/types/project';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const profile: StudentProfile = req.body.profile;

    if (!profile) {
      return res.status(400).json({
        error: 'Student profile is required.',
      });
    }

    const prompt = PromptBuilder.generateIdeas(profile);

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const ideas = safeJsonParse<ProjectIdea[]>(responseText, []);

    const sanitizedIdeas = ideas.map((idea, index) => ({
      ...idea,
      id: idea.id || `idea-${Date.now()}-${index}`,
    }));

    res.json({ ideas: sanitizedIdeas });
  } catch (error: any) {
    console.error('Error generating ideas:', error);

    res.status(500).json({
      error: 'Failed to generate project ideas from Gemini.',
      details: error?.message || 'Server error',
    });
  }
});

router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { profile, ideas } = req.body as {
      profile: StudentProfile;
      ideas: ProjectIdea[];
    };

    if (!profile || !ideas || ideas.length === 0) {
      return res.status(400).json({
        error: 'Profile and ideas are required.',
      });
    }

    const prompt = PromptBuilder.compareIdeas(profile, ideas);

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const comparison = safeJsonParse<IdeaComparison>(responseText, {
      projectIds: ideas.map((i) => i.id),
      overallComparison: 'Side-by-side analysis complete.',
      strengths: {},
      weaknesses: {},
      bestProjectId: ideas[0]?.id || '',
      recommendationReason: 'Recommended based on overall score match.',
    });

    res.json({ comparison });
  } catch (error: any) {
    console.error('Error comparing ideas:', error);

    res.status(500).json({
      error: 'Failed to compare project ideas.',
      details: error?.message || 'Server error',
    });
  }
});

export default router;