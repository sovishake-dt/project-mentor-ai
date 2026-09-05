import React from 'react';
import { useProject, StageId } from '../../context/ProjectContext';
import {
  Home,
  UserCheck,
  Lightbulb,
  Swords,
  Gauge,
  Dna,
  Zap,
  FileCode2,
  Map,
  Bot,
  Sparkles,
  Sliders,
  ShieldAlert,
  Award,
  GraduationCap,
  Wand2,
  CheckCircle2,
} from 'lucide-react';

interface StageItem {
  id: StageId;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  requiresProject?: boolean;
}

interface StageGroup {
  groupTitle: string;
  items: StageItem[];
}

const STAGE_GROUPS: StageGroup[] = [
  {
    groupTitle: 'Phase 1: Discovery & Choice',
    items: [
      { id: 'landing', label: 'Landing Overview', icon: Home },
      { id: 'profile', label: 'Student Profile', icon: UserCheck },
      { id: 'ideas', label: 'Idea Generator', icon: Lightbulb },
      { id: 'clash', label: 'Idea Clash (Compare)', icon: Swords },
    ],
  },
  {
    groupTitle: 'Phase 2: Feasibility & Strategy',
    items: [
      { id: 'reality-check', label: 'Project Reality Check', icon: Gauge, requiresProject: true },
      { id: 'dna', label: 'Project DNA', icon: Dna, requiresProject: true },
      { id: 'skill-gap', label: 'Skill Gap Detector', icon: Zap, requiresProject: true },
    ],
  },
  {
    groupTitle: 'Phase 3: Execution Blueprint',
    items: [
      { id: 'blueprint', label: 'Project Blueprint', icon: FileCode2, requiresProject: true },
      { id: 'roadmap', label: 'Development Roadmap', icon: Map, requiresProject: true },
      { id: 'scope', label: 'Scope Optimizer', icon: Sliders, requiresProject: true },
    ],
  },
  {
    groupTitle: 'Phase 4: Mentorship & Defense',
    items: [
      { id: 'mentor', label: 'Context AI Mentor', icon: Bot, requiresProject: true },
      { id: 'innovation', label: 'Innovation Booster', icon: Sparkles, requiresProject: true },
      { id: 'risks', label: 'Risk Radar', icon: ShieldAlert, requiresProject: true },
      { id: 'judge', label: 'Judge Mode Evaluation', icon: Award, requiresProject: true },
      { id: 'viva', label: 'Viva Coach & Challenge', icon: GraduationCap, requiresProject: true },
      { id: 'improvement', label: 'Improve My Idea', icon: Wand2 },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { activeStage, setActiveStage, selectedProject, profile } = useProject();

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 justify-between">
      <div className="p-4 overflow-y-auto space-y-5">
        {STAGE_GROUPS.map((group, groupIdx) => (
          <div key={group.groupTitle} className={groupIdx > 0 ? 'pt-2 border-t border-slate-100' : ''}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
              {group.groupTitle}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = activeStage === item.id;
                const isDisabled = item.requiresProject && !selectedProject;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => !isDisabled && setActiveStage(item.id)}
                      disabled={isDisabled}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs'
                          : isDisabled
                          ? 'text-slate-300 cursor-not-allowed opacity-50'
                          : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : isDisabled
                              ? 'bg-slate-100 text-slate-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.requiresProject && selectedProject && isActive && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      )}
                      {isDisabled && (
                        <span className="text-[10px] uppercase font-bold text-slate-300">Lock</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Student Context Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-900 rounded-lg p-3 text-white shadow-sm">
          <div className="text-[10px] text-indigo-300 uppercase font-bold mb-1 tracking-wider">
            Student Context
          </div>
          <div className="text-xs font-semibold text-white">
            {profile.name || 'Student Profile'}
          </div>
          <div className="text-[10px] text-slate-400">
            {profile.academic.branch || 'CS'} · {profile.academic.year || 'Senior Year'}
          </div>
          {selectedProject && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-indigo-200 truncate font-medium">
              Target: {selectedProject.title}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
