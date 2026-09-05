import { StudentProfile, ProjectIdea, RoadmapPhase } from '../types/project';

const KEYS = {
  PROFILE: 'ai_project_mentor_profile',
  SELECTED_PROJECT: 'ai_project_mentor_selected_project',
  ROADMAP: 'ai_project_mentor_roadmap',
  ACTIVE_STAGE: 'ai_project_mentor_active_stage',
};

export const defaultStudentProfile: StudentProfile = {
  academic: {
    branch: 'Computer Science & Engineering',
    year: 'Final Year (4th Year)',
    specialization: 'Artificial Intelligence & Software Systems',
  },
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Python'],
    frameworks: ['React', 'Express.js', 'Node.js', 'Tailwind CSS'],
    aiMl: ['Gemini API', 'PyTorch'],
    databases: ['PostgreSQL', 'MongoDB'],
    cloudDeployment: ['Docker', 'Vite', 'Cloud Run'],
    other: ['REST APIs', 'Git'],
  },
  interests: {
    domains: ['AI & Machine Learning', 'Developer Tools', 'EdTech'],
    problemAreas: ['Student Learning Productivity', 'Code Quality Automation'],
    hobbies: ['Hackathons', 'Open Source'],
    careerGoals: ['Fullstack AI Engineer', 'Product Architect'],
  },
  experience: {
    level: 'Intermediate',
    previousProjects: 'Built a web-based task management dashboard & a Python web scraper.',
    preferredProjectType: 'Full-Stack Web Application with AI Engine',
  },
  constraints: {
    teamSize: 1,
    availableWeeks: 12,
    hoursPerWeek: 15,
    budgetUsd: 0,
    hardware: '16GB RAM Laptop',
    hasGPU: false,
    hasGoodInternet: true,
    preferredDifficulty: 'Challenging',
  },
  learningGoals: {
    technologiesToLearn: ['Vector Embeddings', 'System Design Patterns', 'Containerization'],
    skillsToImprove: ['System Architecture', 'Prompt Engineering', 'Testing'],
  },
};

export const storage = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : defaultStudentProfile;
    } catch {
      return defaultStudentProfile;
    }
  },

  saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile to localStorage', err);
    }
  },

  getSelectedProject(): ProjectIdea | null {
    try {
      const data = localStorage.getItem(KEYS.SELECTED_PROJECT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveSelectedProject(project: ProjectIdea | null): void {
    try {
      if (project) {
        localStorage.setItem(KEYS.SELECTED_PROJECT, JSON.stringify(project));
      } else {
        localStorage.removeItem(KEYS.SELECTED_PROJECT);
      }
    } catch (err) {
      console.error('Failed to save project to localStorage', err);
    }
  },

  getRoadmap(): RoadmapPhase[] | null {
    try {
      const data = localStorage.getItem(KEYS.ROADMAP);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveRoadmap(roadmap: RoadmapPhase[]): void {
    try {
      localStorage.setItem(KEYS.ROADMAP, JSON.stringify(roadmap));
    } catch (err) {
      console.error('Failed to save roadmap to localStorage', err);
    }
  },

  getActiveStage(): string {
    return localStorage.getItem(KEYS.ACTIVE_STAGE) || 'landing';
  },

  saveActiveStage(stage: string): void {
    localStorage.setItem(KEYS.ACTIVE_STAGE, stage);
  },
};
