import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  ProjectIdea,
  IdeaComparison,
  ProjectAnalysis,
  SkillGapAnalysis,
  ProjectBlueprint,
  RoadmapPhase,
  MentorMessage,
  InnovationSuggestion,
  ScopeModeConfig,
  RiskItem,
  JudgeEvaluation,
  VivaQuestion,
  VivaChallengeTurn,
  ProjectImprovementResult,
} from '../types/project';
import { storage } from '../utils/storage';

export type StageId =
  | 'landing'
  | 'profile'
  | 'ideas'
  | 'clash'
  | 'reality-check'
  | 'dna'
  | 'skill-gap'
  | 'blueprint'
  | 'roadmap'
  | 'mentor'
  | 'innovation'
  | 'scope'
  | 'risks'
  | 'judge'
  | 'viva'
  | 'improvement';

interface ProjectContextType {
  activeStage: StageId;
  setActiveStage: (stage: StageId) => void;

  profile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;

  generatedIdeas: ProjectIdea[];
  setGeneratedIdeas: (ideas: ProjectIdea[]) => void;

  selectedIdeasForClash: ProjectIdea[];
  setSelectedIdeasForClash: React.Dispatch<React.SetStateAction<ProjectIdea[]>>;

  comparisonResult: IdeaComparison | null;
  setComparisonResult: (comp: IdeaComparison | null) => void;

  selectedProject: ProjectIdea | null;
  selectProject: (project: ProjectIdea | null) => void;

  realityAnalysis: ProjectAnalysis | null;
  setRealityAnalysis: (analysis: ProjectAnalysis | null) => void;

  skillGapResult: SkillGapAnalysis | null;
  setSkillGapResult: (result: SkillGapAnalysis | null) => void;

  blueprint: ProjectBlueprint | null;
  setBlueprint: (blueprint: ProjectBlueprint | null) => void;

  roadmap: RoadmapPhase[];
  setRoadmap: (roadmap: RoadmapPhase[]) => void;
  toggleTaskCompletion: (phaseId: string, taskId: string) => void;

  mentorMessages: MentorMessage[];
  setMentorMessages: React.Dispatch<React.SetStateAction<MentorMessage[]>>;

  innovations: InnovationSuggestion[];
  setInnovations: (innovations: InnovationSuggestion[]) => void;

  scopeModes: ScopeModeConfig[];
  setScopeModes: (modes: ScopeModeConfig[]) => void;

  risks: RiskItem[];
  setRisks: (risks: RiskItem[]) => void;

  judgeEvaluation: JudgeEvaluation | null;
  setJudgeEvaluation: (evalData: JudgeEvaluation | null) => void;

  vivaQuestions: VivaQuestion[];
  setVivaQuestions: (q: VivaQuestion[]) => void;

  vivaTurns: VivaChallengeTurn[];
  setVivaTurns: React.Dispatch<React.SetStateAction<VivaChallengeTurn[]>>;

  improvementResult: ProjectImprovementResult | null;
  setImprovementResult: (res: ProjectImprovementResult | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStage, setActiveStageState] = useState<StageId>(
    (storage.getActiveStage() as StageId) || 'landing'
  );

  const [profile, setProfileState] = useState<StudentProfile>(storage.getProfile());
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [selectedIdeasForClash, setSelectedIdeasForClash] = useState<ProjectIdea[]>([]);
  const [comparisonResult, setComparisonResult] = useState<IdeaComparison | null>(null);

  const [selectedProject, setSelectedProjectState] = useState<ProjectIdea | null>(
    storage.getSelectedProject()
  );

  const [realityAnalysis, setRealityAnalysis] = useState<ProjectAnalysis | null>(null);
  const [skillGapResult, setSkillGapResult] = useState<SkillGapAnalysis | null>(null);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [roadmap, setRoadmapState] = useState<RoadmapPhase[]>(storage.getRoadmap() || []);

  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello! I am your Senior AI Project Mentor. Select a project idea to receive tailored architecture advice, roadmap reviews, risk mitigations, and viva defense coaching.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [innovations, setInnovations] = useState<InnovationSuggestion[]>([]);
  const [scopeModes, setScopeModes] = useState<ScopeModeConfig[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [judgeEvaluation, setJudgeEvaluation] = useState<JudgeEvaluation | null>(null);
  const [vivaQuestions, setVivaQuestions] = useState<VivaQuestion[]>([]);
  const [vivaTurns, setVivaTurns] = useState<VivaChallengeTurn[]>([]);
  const [improvementResult, setImprovementResult] = useState<ProjectImprovementResult | null>(null);

  const setActiveStage = (stage: StageId) => {
    setActiveStageState(stage);
    storage.saveActiveStage(stage);
  };

  const setProfile = (newProfile: StudentProfile) => {
    setProfileState(newProfile);
    storage.saveProfile(newProfile);
  };

  const selectProject = (project: ProjectIdea | null) => {
    setSelectedProjectState(project);
    storage.saveSelectedProject(project);

    // Reset downstream caches when project changes
    setRealityAnalysis(null);
    setSkillGapResult(null);
    setBlueprint(null);
    setInnovations([]);
    setScopeModes([]);
    setRisks([]);
    setJudgeEvaluation(null);
    setVivaQuestions([]);
    setVivaTurns([]);

    if (project) {
      // Build initial default roadmap phases
      const defaultPhases: RoadmapPhase[] = [
        {
          id: 'phase-1',
          phaseName: 'Phase 1: Foundation & Specs',
          description: 'Setup environment, architecture design, API schemas & database models.',
          estimatedWeeks: 2,
          tasks: [
            {
              id: 't1',
              title: 'Initialize repository & Express + Vite setup',
              description: 'Configure TypeScript, Tailwind CSS, environment variables.',
              estimatedDays: 2,
              dependencies: [],
              expectedOutcome: 'Repository running cleanly on port 3000',
              completed: true,
            },
            {
              id: 't2',
              title: 'Draft API Schema & System Architecture',
              description: 'Map out endpoints, Gemini API prompt wrappers, and state schema.',
              estimatedDays: 3,
              dependencies: ['t1'],
              expectedOutcome: 'Fully documented blueprint in Project Context',
              completed: true,
            },
          ],
        },
        {
          id: 'phase-2',
          phaseName: 'Phase 2: Core Engineering & MVP',
          description: 'Implement core functionality, UI components, and backend endpoints.',
          estimatedWeeks: 4,
          tasks: [
            {
              id: 't3',
              title: 'Build primary UI views & state handlers',
              description: 'Develop clean accessible pages and input forms.',
              estimatedDays: 5,
              dependencies: ['t2'],
              expectedOutcome: 'Interactive frontend interface',
              completed: false,
            },
            {
              id: 't4',
              title: 'Integrate Gemini API & logic engine',
              description: 'Connect server endpoints to Gemini model with robust validation.',
              estimatedDays: 6,
              dependencies: ['t3'],
              expectedOutcome: 'Working end-to-end AI features',
              completed: false,
            },
          ],
        },
        {
          id: 'phase-3',
          phaseName: 'Phase 3: Testing, Polish & Defense Prep',
          description: 'Security hardening, performance optimization, and viva rehearsal.',
          estimatedWeeks: 3,
          tasks: [
            {
              id: 't5',
              title: 'Run Judge Evaluation & Viva Coach practice',
              description: 'Identify project weak points and practice viva answer framing.',
              estimatedDays: 4,
              dependencies: ['t4'],
              expectedOutcome: '90+ Judge evaluation score & ready for project defense',
              completed: false,
            },
          ],
        },
      ];

      setRoadmapState(defaultPhases);
      storage.saveRoadmap(defaultPhases);
    }
  };

  const setRoadmap = (newRoadmap: RoadmapPhase[]) => {
    setRoadmapState(newRoadmap);
    storage.saveRoadmap(newRoadmap);
  };

  const toggleTaskCompletion = (phaseId: string, taskId: string) => {
    const updated = roadmap.map((phase) => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });

    setRoadmap(updated);
  };

  return (
    <ProjectContext.Provider
      value={{
        activeStage,
        setActiveStage,
        profile,
        setProfile,
        generatedIdeas,
        setGeneratedIdeas,
        selectedIdeasForClash,
        setSelectedIdeasForClash,
        comparisonResult,
        setComparisonResult,
        selectedProject,
        selectProject,
        realityAnalysis,
        setRealityAnalysis,
        skillGapResult,
        setSkillGapResult,
        blueprint,
        setBlueprint,
        roadmap,
        setRoadmap,
        toggleTaskCompletion,
        mentorMessages,
        setMentorMessages,
        innovations,
        setInnovations,
        scopeModes,
        setScopeModes,
        risks,
        setRisks,
        judgeEvaluation,
        setJudgeEvaluation,
        vivaQuestions,
        setVivaQuestions,
        vivaTurns,
        setVivaTurns,
        improvementResult,
        setImprovementResult,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
