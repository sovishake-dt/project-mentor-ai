import { Router, Request, Response } from 'express';
import { getGeminiClient, MODEL_FLASH } from '../services/gemini';
import { PromptBuilder } from '../services/promptBuilder';
import { StudentProfile, ProjectIdea } from '../../src/types/project';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { profile, project, history, userMessage } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea | null;
      history: { sender: string; text: string }[];
      userMessage: string;
    };

    if (!profile || !userMessage) {
      return res.status(400).json({ error: 'Profile and userMessage are required.' });
    }

    const ai = getGeminiClient();
    const prompt = PromptBuilder.mentorChat(profile, project, history || [], userMessage);

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });

    res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error in mentor chat:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Mentor.' });
  }
});

export default router;
