import {
  StudentProfile,
  ProjectIdea,
  IdeaComparison,
  ProjectAnalysis,
  SkillGapAnalysis,
  ProjectBlueprint,
  InnovationSuggestion,
  ScopeModeConfig,
  RiskItem,
  JudgeEvaluation,
  VivaQuestion,
  ProjectImprovementResult,
} from '../types/project';

// In production, VITE_API_URL points to the Render backend.
// In local development, if VITE_API_URL is not set, requests use the same origin.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function post<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;

    try {
      const errJson = await response.json();

      if (errJson.error) {
        errorMsg = errJson.error;
      } else if (errJson.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // Response was not JSON.
    }

    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Generate personalized project ideas
  generateIdeas(
    profile: StudentProfile
  ): Promise<{ ideas: ProjectIdea[] }> {
    return post('/api/ideas/generate', { profile });
  },

  // Compare generated project ideas
  compareIdeas(
    profile: StudentProfile,
    ideas: ProjectIdea[]
  ): Promise<{ comparison: IdeaComparison }> {
    return post('/api/ideas/compare', {
      profile,
      ideas,
    });
  },

  // Analyze project feasibility and make adjustments
  analyzeProject(
    profile: StudentProfile,
    project: ProjectIdea,
    adjustmentMode?: string
  ): Promise<{ analysis: ProjectAnalysis }> {
    return post('/api/project/analyze', {
      profile,
      project,
      adjustmentMode,
    });
  },

  // Calculate the student's skill gap
  calculateSkillGap(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ skillGapResult: SkillGapAnalysis }> {
    return post('/api/project/skill-gap', {
      profile,
      project,
    });
  },

  // Generate project blueprint
  generateBlueprint(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ blueprint: ProjectBlueprint }> {
    return post('/api/project/blueprint', {
      profile,
      project,
    });
  },

  // Generate innovation suggestions
  generateInnovations(
    project: ProjectIdea
  ): Promise<{ innovations: InnovationSuggestion[] }> {
    return post('/api/project/innovation', {
      project,
    });
  },

  // Generate project scope options
  generateScope(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ scopeModes: ScopeModeConfig[] }> {
    return post('/api/project/scope', {
      profile,
      project,
    });
  },

  // Generate project risk analysis
  generateRisks(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ risks: RiskItem[] }> {
    return post('/api/project/risks', {
      profile,
      project,
    });
  },

  // Evaluate project in judge mode
  evaluateJudge(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ evaluation: JudgeEvaluation }> {
    return post('/api/project/evaluate', {
      profile,
      project,
    });
  },

  // Improve a raw project idea
  improveProject(
    rawProjectIdea: string,
    profile: StudentProfile
  ): Promise<{ result: ProjectImprovementResult }> {
    return post('/api/project/improve', {
      rawProjectIdea,
      profile,
    });
  },

  // AI mentor chat
  sendMentorMessage(
    profile: StudentProfile,
    project: ProjectIdea | null,
    history: { sender: string; text: string }[],
    userMessage: string
  ): Promise<{ reply: string }> {
    return post('/api/mentor/chat', {
      profile,
      project,
      history,
      userMessage,
    });
  },

  // Generate viva questions
  generateViva(
    project: ProjectIdea
  ): Promise<{ questions: VivaQuestion[] }> {
    return post('/api/viva/generate', {
      project,
    });
  },

  // Evaluate viva answer
  evaluateVivaAnswer(
    question: string,
    category: string,
    userAnswer: string,
    modelAnswer: string
  ): Promise<{ evaluation: any }> {
    return post('/api/viva/evaluate', {
      question,
      category,
      userAnswer,
      modelAnswer,
    });
  },
};