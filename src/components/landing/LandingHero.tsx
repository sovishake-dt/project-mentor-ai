import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { ArrowRight, Lightbulb, Gauge, FileCode2, Wand2, GraduationCap, Sparkles } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { setActiveStage } = useProject();

  const steps = [
    {
      num: '01',
      title: 'Generate',
      desc: 'Create personalized 5–10 project ideas based on your skills, GPU/hardware, time, and career goals.',
      icon: Lightbulb,
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Run a Reality Check feasibility audit, compare ideas in Idea Clash, and discover skill gaps.',
      icon: Gauge,
    },
    {
      num: '03',
      title: 'Build',
      desc: 'Get an end-to-end technical blueprint, architecture schemas, and interactive task roadmap.',
      icon: FileCode2,
    },
    {
      num: '04',
      title: 'Improve',
      desc: 'Enhance your project with AI Innovation Booster suggestions, Scope Optimizer, and Risk Radar.',
      icon: Wand2,
    },
    {
      num: '05',
      title: 'Defend',
      desc: 'Simulate Judge Mode competition evaluation and practice viva defense with your AI Coach.',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-2xs text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Competition-Level Project Advisor & Decision Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          AI Project Idea Generator & Mentor
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 mt-4 max-w-2xl mx-auto font-normal">
          Turn your skills and interests into a practical final-year project.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveStage('profile')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span>Start Building</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveStage('improvement')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-base font-semibold hover:bg-slate-50 transition-colors"
          >
            <Wand2 className="w-5 h-5 text-indigo-600" />
            <span>Improve Existing Idea</span>
          </button>
        </div>
      </div>

      {/* 5 Key Sections */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">How The Decision Engine Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {s.num}
                    </span>
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Don’t just generate a project idea. Build the right project.</h3>
          <p className="text-sm text-slate-300 max-w-xl">
            Evaluate feasibility, discover missing skills, design secure architecture, and defend your code in front of external viva examiners.
          </p>
        </div>
        <button
          onClick={() => setActiveStage('profile')}
          className="shrink-0 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
        >
          Setup Profile & Generate Ideas
        </button>
      </div>
    </div>
  );
};
