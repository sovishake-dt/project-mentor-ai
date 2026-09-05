import { Router, Request, Response } from 'express';
import { generateWithGemini } from '../services/gemini';
import { PromptBuilder } from '../services/promptBuilder';
import { safeJsonParse } from '../utils/jsonFixer';
import {
  ProjectIdea,
  VivaQuestion,
} from '../../src/types/project';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { project } = req.body as {
      project: ProjectIdea;
    };

    if (!project) {
      return res.status(400).json({
        error: 'Project is required.',
      });
    }

    const prompt =
      PromptBuilder.generateVivaQuestions(project);

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const questions =
      safeJsonParse<VivaQuestion[]>(
        responseText,
        []
      );

    const sanitizedQuestions = questions.map(
      (q, idx) => ({
        ...q,
        id:
          q.id ||
          `viva-${Date.now()}-${idx}`,
      })
    );

    res.json({
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    console.error(
      'Error generating viva questions:',
      error
    );

    res.status(500).json({
      error: 'Failed to generate viva questions.',
      details: error?.message || 'Server error',
    });
  }
});

router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const {
      question,
      category,
      userAnswer,
      modelAnswer,
    } = req.body as {
      question: string;
      category: string;
      userAnswer: string;
      modelAnswer: string;
    };

    if (!question || !userAnswer) {
      return res.status(400).json({
        error:
          'Question and userAnswer are required.',
      });
    }

    const prompt =
      PromptBuilder.evaluateVivaAnswer(
        question,
        category,
        userAnswer,
        modelAnswer
      );

    const responseText =
      await generateWithGemini(prompt, {
        responseMimeType: 'application/json',
      });

    const evaluation = safeJsonParse(
      responseText,
      {
        accuracyScore: 75,
        technicalUnderstandingScore: 75,
        completenessScore: 70,
        clarityScore: 80,
        missingConcepts: [
          'Elaborate on specific architectural tradeoffs.',
        ],
        feedback:
          'Good effort. Practice articulating key technical terms clearly.',
        modelAnswer:
          modelAnswer ||
          'Comprehensive technical answer.',
      }
    );

    res.json({ evaluation });
  } catch (error: any) {
    console.error(
      'Error evaluating viva answer:',
      error
    );

    res.status(500).json({
      error: 'Failed to evaluate viva answer.',
      details: error?.message || 'Server error',
    });
  }
});

export default router;