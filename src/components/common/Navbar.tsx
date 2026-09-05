import React from 'react';
import { useProject, StageId } from '../../context/ProjectContext';
import { Cpu, User, FolderCheck, Sparkles, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeStage, setActiveStage, selectedProject, profile } = useProject();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
      {/* Brand */}
      <div
        onClick={() => setActiveStage('landing')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-2xs group-hover:bg-indigo-700 transition-colors">
          A
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
              AI Mentor
            </h1>
            <span className="hidden md:inline-block text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Decision Engine
            </span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold leading-tight mt-0.5">
            Final-Year Project Advisor
          </p>
        </div>
      </div>

      {/* Selected Project Pill & Quick Actions */}
      <div className="flex items-center gap-3">
        {selectedProject ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
              Selected
            </span>
            <div
              onClick={() => setActiveStage('reality-check')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition-colors max-w-[180px] truncate"
              title={selectedProject.title}
            >
              <FolderCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{selectedProject.title}</span>
            </div>
            <button
              onClick={() => setActiveStage('scope')}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-2xs hover:bg-indigo-700 transition-colors"
            >
              Modify Scope
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveStage('ideas')}
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-2xs hover:bg-indigo-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Ideas</span>
          </button>
        )}

        {/* Student Profile Quick Button */}
        <button
          onClick={() => setActiveStage('profile')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
            activeStage === 'profile'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">{profile.name || 'Profile'}</span>
        </button>
      </div>
    </header>
  );
};
