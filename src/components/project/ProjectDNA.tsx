import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { ScoreBadge } from '../common/ScoreBadge';
import { Dna, ArrowRight } from 'lucide-react';

export const ProjectDNA: React.FC = () => {
  const { selectedProject, profile, setActiveStage } = useProject();

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Dna className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to view its complete Project DNA metrics.</p>
        <button
          onClick={() => setActiveStage('ideas')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
        >
          <span>Select an Idea</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const scores = selectedProject.scores;

  const dnaMetrics = [
    {
      title: 'Innovation Score',
      score: scores.innovation,
      desc: 'Measures novel technical approach vs standard existing open-source templates.',
    },
    {
      title: 'Feasibility Score',
      score: scores.feasibility,
      desc: `Evaluates realistic completion probability within ${profile.constraints.availableWeeks} weeks.`,
    },
    {
      title: 'Real-World Impact',
      score: scores.impact,
      desc: 'Assesses practical value delivered to target users and domain gaps.',
    },
    {
      title: 'Scalability Potential',
      score: scores.scalability,
      desc: 'Capacity of architecture to support high traffic or large dataset volumes.',
    },
    {
      title: 'Technical Depth',
      score: scores.technicalDepth,
      desc: 'Complexity of algorithms, data structures, and backend systems.',
    },
    {
      title: 'Skill Match Alignment',
      score: scores.skillMatch,
      desc: 'How closely project tech stack aligns with your existing profile skills.',
    },
  ];

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <Dna className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Project DNA & Metric Profile</h2>
        </div>
        <p className="text-xs text-slate-500">
          Quantitative breakdown of <span className="font-bold text-slate-800">{selectedProject.title}</span> across core engineering metrics.
        </p>
      </div>

      {/* DNA Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dnaMetrics.map((item) => (
          <div key={item.title} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <ScoreBadge score={item.score} size="sm" showProgress={false} />
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.score}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Summary Bar */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-indigo-950 mb-1">Ready for Skill Gap Analysis?</h4>
          <p className="text-xs text-indigo-800">
            Compare required project technologies against your exact profile skill set.
          </p>
        </div>
        <button
          onClick={() => setActiveStage('skill-gap')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <span>Run Skill Gap Detector</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
