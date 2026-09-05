export interface StudentProfile {
  academic: {
    branch: string;
    year: string;
    specialization: string;
  };
  skills: {
    languages: string[];
    frameworks: string[];
    aiMl: string[];
    databases: string[];
    cloudDeployment: string[];
    other: string[];
  };
  interests: {
    domains: string[];
    problemAreas: string[];
    hobbies: string[];
    careerGoals: string[];
  };
  experience: {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    previousProjects: string;
    preferredProjectType: string;
  };
  constraints: {
    teamSize: number;
    availableWeeks: number;
    hoursPerWeek: number;
    budgetUsd: number;
    hardware: string;
    hasGPU: boolean;
    hasGoodInternet: boolean;
    preferredDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Competition-Level';
  };
  learningGoals: {
    technologiesToLearn: string[];
    skillsToImprove: string[];
  };
}

export interface ProjectIdea {
  id: string;
  title: string;
  shortDescription: string;
  problemStatement: string;
  targetUsers: string[];
  realWorldProblem: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  technologyStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    aiMl: string[];
    tools: string[];
  };
  aiMlUsage: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Competition-Level';
  estimatedDurationWeeks: number;
  estimatedCostUsd: number;
  scores: {
    innovation: number; // 0-100
    feasibility: number; // 0-100
    impact: number; // 0-100
    scalability: number; // 0-100
    technicalDepth: number; // 0-100
    skillMatch: number; // 0-100 (deterministic or estimated)
  };
  whyItMatches: string;
}

export interface IdeaComparison {
  projectIds: string[];
  overallComparison: string;
  strengths: Record<string, string[]>;
  weaknesses: Record<string, string[]>;
  bestProjectId: string;
  recommendationReason: string;
}

export interface ProjectAnalysis {
  realityScore: number; // 0-100
  feasibility: string;
  timeFit: string;
  technicalComplexity: string;
  costFeasibility: string;
  resourceRequirements: string[];
  datasetDependency: string;
  apiDependency: string;
  hardwareDependency: string;
  teamDependency: string;
  majorRisks: string[];
  majorBlockers: string[];
  versions: {
    mvp: { title: string; features: string[]; estimatedWeeks: number };
    standard: { title: string; features: string[]; estimatedWeeks: number };
    advanced: { title: string; features: string[]; estimatedWeeks: number };
  };
  actionableRecommendations: string[];
}

export interface SkillGapItem {
  skill: string;
  category: string;
  status: 'Strong' | 'Partial' | 'Missing';
  weight: number;
  estimatedLearningHours: number;
  recommendedResources: string;
  reason: string;
}

export interface SkillGapAnalysis {
  matchPercentage: number;
  strongSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  prioritySequence: SkillGapItem[];
  totalLearningHours: number;
  overallAdvice: string;
}

export interface ProjectBlueprint {
  problem: {
    statement: string;
    motivation: string;
    existingLimitations: string[];
  };
  objectives: {
    mainObjectives: string[];
    measurableGoals: string[];
  };
  users: {
    targetUsers: string[];
    userRoles: string[];
    userJourneys: string[];
  };
  features: {
    core: string[];
    advanced: string[];
    optional: string[];
  };
  architecture: {
    frontend: string;
    backend: string;
    apis: string[];
    databaseRecommendation: string;
    aiServices: string[];
    externalServices: string[];
    deploymentArchitecture: string;
  };
  aiComponents: {
    whereUsed: string;
    whyNeeded: string;
    input: string;
    processing: string;
    output: string;
    modelResponsibility: string;
  }[];
  security: {
    authentication: string;
    authorization: string;
    inputValidation: string;
    apiSecurity: string;
    dataPrivacy: string;
    secretManagement: string;
  };
  testing: {
    unitTesting: string;
    integrationTesting: string;
    uiTesting: string;
    aiValidation: string;
    edgeCases: string[];
  };
  deployment: {
    recommendations: string[];
    pipeline: string;
  };
  futureScope: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedDays: number;
  dependencies: string[];
  expectedOutcome: string;
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseName: string;
  description: string;
  estimatedWeeks: number;
  tasks: RoadmapTask[];
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActionsUsed?: string;
}

export interface InnovationSuggestion {
  category: 'AI Innovation' | 'Technical Innovation' | 'UX Innovation' | 'Automation' | 'Social/Real-World Impact' | 'Scalability' | 'Data/Analytics';
  title: string;
  idea: string;
  whyItImproves: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedImpact: 'High' | 'Very High' | 'Game Changer';
  implementationTip: string;
}

export interface ScopeModeConfig {
  mode: 'MVP' | 'Standard' | 'Advanced' | 'Competition';
  description: string;
  buildNow: string[];
  buildLater: string[];
  remove: string[];
  optional: string[];
  reasoning: string;
}

export interface RiskItem {
  id: string;
  category: 'Technical' | 'Time' | 'Cost' | 'Dataset' | 'API' | 'Hardware' | 'Security' | 'Scalability' | 'Team';
  risk: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: 'Low' | 'Medium' | 'High';
  explanation: string;
  mitigation: string;
  backupPlan: string;
}

export interface JudgeEvaluation {
  overallScore: number; // 0-100
  criteriaScores: {
    problemRelevance: number;
    innovation: number;
    technicalDepth: number;
    feasibility: number;
    aiUsage: number;
    impact: number;
    scalability: number;
    security: number;
    ux: number;
    presentationPotential: number;
  };
  strongestAspects: string[];
  weakestAspects: string[];
  majorConcerns: string[];
  top3Improvements: string[];
  judgeFeedback: string;
}

export interface VivaQuestion {
  id: string;
  category: 'Basic' | 'Problem Statement' | 'Architecture' | 'Technology' | 'AI/ML' | 'Database' | 'Security' | 'Testing' | 'Deployment' | 'Tricky';
  question: string;
  suggestedAnswer: string;
  whyExaminerAsks: string;
  keyPoints: string[];
}

export interface VivaChallengeTurn {
  questionNumber: number;
  category: string;
  question: string;
  userAnswer?: string;
  evaluation?: {
    accuracyScore: number; // 0-100
    technicalUnderstandingScore: number; // 0-100
    completenessScore: number; // 0-100
    clarityScore: number; // 0-100
    missingConcepts: string[];
    feedback: string;
    modelAnswer: string;
  };
}

export interface ProjectImprovementResult {
  originalIdea: string;
  weaknesses: string[];
  missingFeatures: string[];
  technicalProblems: string[];
  innovationOpportunities: string[];
  aiOpportunities: string[];
  securityProblems: string[];
  scalabilityImprovements: string[];
  improvedProject: ProjectIdea;
}
