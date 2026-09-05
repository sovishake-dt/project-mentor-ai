import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

import { LandingHero } from './components/landing/LandingHero';
import { ProfileWizard } from './components/profile/ProfileWizard';
import { IdeaGenerator } from './components/ideas/IdeaGenerator';
import { IdeaClash } from './components/ideas/IdeaClash';
import { RealityCheck } from './components/project/RealityCheck';
import { ProjectDNA } from './components/project/ProjectDNA';
import { SkillGapDetector } from './components/project/SkillGapDetector';
import { BlueprintView } from './components/project/BlueprintView';
import { RoadmapView } from './components/project/RoadmapView';
import { AIMentor } from './components/mentor/AIMentor';
import { InnovationBooster } from './components/project/InnovationBooster';
import { ScopeOptimizer } from './components/project/ScopeOptimizer';
import { RiskRadar } from './components/project/RiskRadar';
import { JudgeMode } from './components/project/JudgeMode';
import { VivaCoach } from './components/project/VivaCoach';
import { ProjectImprovement } from './components/project/ProjectImprovement';

const MainContent: React.FC = () => {
  const { activeStage } = useProject();

  const renderStage = () => {
    switch (activeStage) {
      case 'landing':
        return <LandingHero />;
      case 'profile':
        return <ProfileWizard />;
      case 'ideas':
        return <IdeaGenerator />;
      case 'clash':
        return <IdeaClash />;
      case 'reality-check':
        return <RealityCheck />;
      case 'dna':
        return <ProjectDNA />;
      case 'skill-gap':
        return <SkillGapDetector />;
      case 'blueprint':
        return <BlueprintView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'mentor':
        return <AIMentor />;
      case 'innovation':
        return <InnovationBooster />;
      case 'scope':
        return <ScopeOptimizer />;
      case 'risks':
        return <RiskRadar />;
      case 'judge':
        return <JudgeMode />;
      case 'viva':
        return <VivaCoach />;
      case 'improvement':
        return <ProjectImprovement />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderStage()}
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <span>AI Project Idea Generator & Mentor • Powered by Gemini 3.8 Flash Engine</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ProjectProvider>
      <MainContent />
    </ProjectProvider>
  );
}

export default App;
