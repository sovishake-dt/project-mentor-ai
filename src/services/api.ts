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

async function post<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  generateIdeas(profile: StudentProfile): Promise<{ ideas: ProjectIdea[] }> {
    return post('/api/ideas/generate', { profile });
  },

  compareIdeas(profile: StudentProfile, ideas: ProjectIdea[]): Promise<{ comparison: IdeaComparison }> {
    return post('/api/ideas/compare', { profile, ideas });
  },

  analyzeProject(
    profile: StudentProfile,
    project: ProjectIdea,
    adjustmentMode?: string
  ): Promise<{ analysis: ProjectAnalysis }> {
    return post('/api/project/analyze', { profile, project, adjustmentMode });
  },

  calculateSkillGap(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ skillGapResult: SkillGapAnalysis }> {
    return post('/api/project/skill-gap', { profile, project });
  },

  generateBlueprint(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ blueprint: ProjectBlueprint }> {
    return post('/api/project/blueprint', { profile, project });
  },

  generateInnovations(project: ProjectIdea): Promise<{ innovations: InnovationSuggestion[] }> {
    return post('/api/project/innovation', { project });
  },

  generateScope(profile: StudentProfile, project: ProjectIdea): Promise<{ scopeModes: ScopeModeConfig[] }> {
    return post('/api/project/scope', { profile, project });
  },

  generateRisks(profile: StudentProfile, project: ProjectIdea): Promise<{ risks: RiskItem[] }> {
    return post('/api/project/risks', { profile, project });
  },

  evaluateJudge(
    profile: StudentProfile,
    project: ProjectIdea
  ): Promise<{ evaluation: JudgeEvaluation }> {
    return post('/api/project/evaluate', { profile, project });
  },

  improveProject(
    rawProjectIdea: string,
    profile: StudentProfile
  ): Promise<{ result: ProjectImprovementResult }> {
    return post('/api/project/improve', { rawProjectIdea, profile });
  },

  sendMentorMessage(
    profile: StudentProfile,
    project: ProjectIdea | null,
    history: { sender: string; text: string }[],
    userMessage: string
  ): Promise<{ reply: string }> {
    return post('/api/mentor/chat', { profile, project, history, userMessage });
  },

  generateViva(project: ProjectIdea): Promise<{ questions: VivaQuestion[] }> {
    return post('/api/viva/generate', { project });
  },

  evaluateVivaAnswer(
    question: string,
    category: string,
    userAnswer: string,
    modelAnswer: string
  ): Promise<{ evaluation: any }> {
    return post('/api/viva/evaluate', { question, category, userAnswer, modelAnswer });
  },
};
