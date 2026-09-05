import { Router, Request, Response } from 'express';
import { generateWithGemini } from '../services/gemini';
import { PromptBuilder } from '../services/promptBuilder';
import { safeJsonParse } from '../utils/jsonFixer';
import { calculateSkillGap } from '../services/skillMatcher';

import {
  StudentProfile,
  ProjectIdea,
  ProjectAnalysis,
  ProjectBlueprint,
  InnovationSuggestion,
  ScopeModeConfig,
  RiskItem,
  JudgeEvaluation,
  ProjectImprovementResult,
} from '../../src/types/project';

const router = Router();

// Analyze Project / Reality Check
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { profile, project, adjustmentMode } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
      adjustmentMode?: string;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const prompt = PromptBuilder.analyzeProject(
      profile,
      project,
      adjustmentMode
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const analysis = safeJsonParse<ProjectAnalysis>(responseText, {
      realityScore: 80,
      feasibility: 'Feasible with consistent weekly progress.',
      timeFit: 'Fits timeline.',
      technicalComplexity: 'Moderate complexity.',
      costFeasibility: 'Fits budget.',
      resourceRequirements: ['Node.js server', 'Database'],
      datasetDependency: 'Public datasets available.',
      apiDependency: 'Gemini API required.',
      hardwareDependency: 'Standard computer.',
      teamDependency: 'Distributed workload.',
      majorRisks: ['Timeline crunch'],
      majorBlockers: ['API rate limits'],
      versions: {
        mvp: {
          title: 'MVP',
          features: project.coreFeatures,
          estimatedWeeks: 4,
        },
        standard: {
          title: 'Standard',
          features: project.coreFeatures,
          estimatedWeeks: 8,
        },
        advanced: {
          title: 'Advanced',
          features: [
            ...project.coreFeatures,
            ...project.advancedFeatures,
          ],
          estimatedWeeks: 12,
        },
      },
      actionableRecommendations: [
        'Focus on MVP feature set first.',
      ],
    });

    res.json({ analysis });
  } catch (error: any) {
    console.error('Error analyzing project:', error);

    res.status(500).json({
      error: 'Failed to analyze project reality.',
      details: error?.message || 'Server error',
    });
  }
});

// Deterministic Skill Gap Analysis
router.post('/skill-gap', async (req: Request, res: Response) => {
  try {
    const { profile, project } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const requiredSkillsList: {
      skill: string;
      category: string;
    }[] = [];

    if (project.technologyStack) {
      project.technologyStack.frontend?.forEach((s) =>
        requiredSkillsList.push({
          skill: s,
          category: 'Frontend',
        })
      );

      project.technologyStack.backend?.forEach((s) =>
        requiredSkillsList.push({
          skill: s,
          category: 'Backend',
        })
      );

      project.technologyStack.database?.forEach((s) =>
        requiredSkillsList.push({
          skill: s,
          category: 'Database',
        })
      );

      project.technologyStack.aiMl?.forEach((s) =>
        requiredSkillsList.push({
          skill: s,
          category: 'AI/ML',
        })
      );

      project.technologyStack.tools?.forEach((s) =>
        requiredSkillsList.push({
          skill: s,
          category: 'Tools/Cloud',
        })
      );
    }

    const skillGapResult = calculateSkillGap(
      profile,
      requiredSkillsList
    );

    res.json({ skillGapResult });
  } catch (error: any) {
    console.error('Error calculating skill gap:', error);

    res.status(500).json({
      error: 'Failed to compute skill gap analysis.',
    });
  }
});

// Generate Blueprint
router.post('/blueprint', async (req: Request, res: Response) => {
  try {
    const { profile, project } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const prompt = PromptBuilder.generateBlueprint(
      profile,
      project
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const blueprint = safeJsonParse<ProjectBlueprint>(
      responseText,
      {
        problem: {
          statement: project.problemStatement,
          motivation: 'Addresses real-world inefficiency.',
          existingLimitations: [
            'Manual workflows',
            'Lack of AI decision support',
          ],
        },
        objectives: {
          mainObjectives: [
            'Build responsive web application',
            'Integrate AI model',
          ],
          measurableGoals: [
            'Sub-second response latency',
            '100% test coverage for core math',
          ],
        },
        users: {
          targetUsers: project.targetUsers,
          userRoles: ['User', 'Admin'],
          userJourneys: [
            'Sign up',
            'Input parameters',
            'View recommendations',
          ],
        },
        features: {
          core: project.coreFeatures,
          advanced: project.advancedFeatures,
          optional: ['Export report'],
        },
        architecture: {
          frontend: 'React, TypeScript, Vite, Tailwind CSS',
          backend: 'Node.js, Express, TypeScript',
          apis: ['Express REST endpoints'],
          databaseRecommendation: 'PostgreSQL / Firestore',
          aiServices: ['Google Gemini API'],
          externalServices: ['Cloud Run'],
          deploymentArchitecture:
            'Docker containerized Cloud Run service',
        },
        aiComponents: [],
        security: {
          authentication: 'JWT tokens',
          authorization: 'Role check middleware',
          inputValidation: 'TypeScript schemas',
          apiSecurity: 'Rate limiting & CORS',
          dataPrivacy: 'No raw secrets stored in logs',
          secretManagement: 'Environment variables',
        },
        testing: {
          unitTesting: 'Vitest unit tests',
          integrationTesting:
            'Supertest API route testing',
          uiTesting: 'React Testing Library',
          aiValidation: 'JSON schema verification',
          edgeCases: [
            'Rate limit handling',
            'Empty inputs',
          ],
        },
        deployment: {
          recommendations: ['Vercel / Cloud Run'],
          pipeline: 'GitHub CI/CD',
        },
        futureScope: ['Mobile app integration'],
      }
    );

    res.json({ blueprint });
  } catch (error: any) {
    console.error('Error generating blueprint:', error);

    res.status(500).json({
      error: 'Failed to generate project blueprint.',
      details: error?.message || 'Server error',
    });
  }
});

// Innovation Booster
router.post('/innovation', async (req: Request, res: Response) => {
  try {
    const { project } = req.body as {
      project: ProjectIdea;
    };

    if (!project) {
      return res.status(400).json({
        error: 'Project is required.',
      });
    }

    const prompt = PromptBuilder.generateInnovations(project);

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const innovations =
      safeJsonParse<InnovationSuggestion[]>(
        responseText,
        []
      );

    res.json({ innovations });
  } catch (error: any) {
    console.error('Error generating innovations:', error);

    res.status(500).json({
      error: 'Failed to generate innovation suggestions.',
      details: error?.message || 'Server error',
    });
  }
});

// Scope Optimizer
router.post('/scope', async (req: Request, res: Response) => {
  try {
    const { profile, project } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const prompt = PromptBuilder.generateScopeOptimizer(
      profile,
      project
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const scopeModes =
      safeJsonParse<ScopeModeConfig[]>(
        responseText,
        []
      );

    res.json({ scopeModes });
  } catch (error: any) {
    console.error('Error generating scope optimizer:', error);

    res.status(500).json({
      error: 'Failed to generate scope optimizer.',
      details: error?.message || 'Server error',
    });
  }
});

// Risk Radar
router.post('/risks', async (req: Request, res: Response) => {
  try {
    const { profile, project } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const prompt = PromptBuilder.generateRiskRadar(
      profile,
      project
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const risks = safeJsonParse<RiskItem[]>(
      responseText,
      []
    );

    res.json({ risks });
  } catch (error: any) {
    console.error('Error generating risk radar:', error);

    res.status(500).json({
      error: 'Failed to generate risk radar.',
      details: error?.message || 'Server error',
    });
  }
});

// Judge Mode Evaluation
router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { profile, project } = req.body as {
      profile: StudentProfile;
      project: ProjectIdea;
    };

    if (!profile || !project) {
      return res.status(400).json({
        error: 'Profile and project are required.',
      });
    }

    const prompt = PromptBuilder.evaluateJudgeMode(
      profile,
      project
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const evaluation = safeJsonParse<JudgeEvaluation>(
      responseText,
      {
        overallScore: 82,
        criteriaScores: {
          problemRelevance: 85,
          innovation: 80,
          technicalDepth: 82,
          feasibility: 85,
          aiUsage: 80,
          impact: 80,
          scalability: 75,
          security: 78,
          ux: 82,
          presentationPotential: 85,
        },
        strongestAspects: [
          'Target user relevance',
          'Clear technical stack',
        ],
        weakestAspects: [
          'Needs more explicit test coverage plan',
        ],
        majorConcerns: ['Timeline constraints'],
        top3Improvements: [
          'Add benchmark metrics',
          'Implement test suite',
          'Polish presentation slides',
        ],
        judgeFeedback:
          'Solid competition entry with clear execution plan.',
      }
    );

    res.json({ evaluation });
  } catch (error: any) {
    console.error('Error evaluating judge mode:', error);

    res.status(500).json({
      error: 'Failed to evaluate project for judge mode.',
      details: error?.message || 'Server error',
    });
  }
});

// Improve Existing Project Idea
router.post('/improve', async (req: Request, res: Response) => {
  try {
    const { rawProjectIdea, profile } = req.body as {
      rawProjectIdea: string;
      profile: StudentProfile;
    };

    if (!rawProjectIdea || !profile) {
      return res.status(400).json({
        error: 'Raw project idea and profile are required.',
      });
    }

    const prompt = PromptBuilder.improveExistingProject(
      rawProjectIdea,
      profile
    );

    const responseText = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const result =
      safeJsonParse<ProjectImprovementResult>(
        responseText,
        {
          originalIdea: rawProjectIdea,
          weaknesses: ['Vague technical architecture'],
          missingFeatures: ['Automated error handling'],
          technicalProblems: ['Lacks AI integration'],
          innovationOpportunities: [
            'Add predictive analytics',
          ],
          aiOpportunities: ['Smart decision support'],
          securityProblems: ['Unvalidated inputs'],
          scalabilityImprovements: ['Cache layer'],
          improvedProject: {
            id: `improved-${Date.now()}`,
            title:
              'Enhanced ' +
              rawProjectIdea.slice(0, 30),
            shortDescription:
              'Upgraded competition-ready version of student idea.',
            problemStatement: rawProjectIdea,
            targetUsers: ['Target Audience'],
            realWorldProblem:
              'Current solution is manual.',
            coreFeatures: [
              'Core Feature 1',
              'Core Feature 2',
            ],
            advancedFeatures: ['AI Reasoning Engine'],
            technologyStack: {
              frontend: ['React', 'TypeScript'],
              backend: ['Node.js', 'Express'],
              database: ['PostgreSQL'],
              aiMl: ['Gemini API'],
              tools: ['Vite', 'Docker'],
            },
            aiMlUsage:
              'Gemini API powered decision engine',
            difficulty: 'Challenging',
            estimatedDurationWeeks: 10,
            estimatedCostUsd: 0,
            scores: {
              innovation: 88,
              feasibility: 85,
              impact: 86,
              scalability: 82,
              technicalDepth: 85,
              skillMatch: 80,
            },
            whyItMatches:
              'Transformed to align with your skills and timeline.',
          },
        }
      );

    res.json({ result });
  } catch (error: any) {
    console.error('Error improving project:', error);

    res.status(500).json({
      error: 'Failed to analyze and improve project idea.',
      details: error?.message || 'Server error',
    });
  }
});

export default router;