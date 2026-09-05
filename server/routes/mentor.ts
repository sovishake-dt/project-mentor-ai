import { Router, Request, Response } from 'express';
import { generateWithGemini } from '../services/gemini';
import { PromptBuilder } from '../services/promptBuilder';
import {
  StudentProfile,
  ProjectIdea,
} from '../../src/types/project';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const {
      profile,
      project,
      history,
      userMessage,
    } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea | null;
      history: { sender: string; text: string }[];
      userMessage: string;
    };

    if (!profile || !userMessage) {
      return res.status(400).json({
        error: 'Profile and userMessage are required.',
      });
    }

    const prompt = PromptBuilder.mentorChat(
      profile,
      project,
      history || [],
      userMessage
    );

    const responseText = await generateWithGemini(prompt);

    res.json({
      reply: responseText || 'No response generated.',
    });
  } catch (error: any) {
    console.error('Error in mentor chat:', error);

    res.status(500).json({
      error: 'Failed to communicate with AI Mentor.',
      details: error?.message || 'Server error',
    });
  }
});

export default router;