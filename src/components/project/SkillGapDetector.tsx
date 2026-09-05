import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ScoreBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Zap, BookOpen, ArrowRight, RefreshCw } from 'lucide-react';

export const SkillGapDetector: React.FC = () => {
  const { profile, selectedProject, skillGapResult, setSkillGapResult, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSkillGap = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.calculateSkillGap(profile, selectedProject);
      setSkillGapResult(res.skillGapResult);
    } catch (err: any) {
      setError(err?.message || 'Failed to compute skill gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && !skillGapResult) {
      runSkillGap();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Zap className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to run the Skill Gap Detector.</p>
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

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">Skill Gap Detector</h2>
          </div>
          <p className="text-xs text-slate-500">
            Deterministic TypeScript skill matching for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={runSkillGap}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-compute Skill Gap</span>
        </button>
      </div>

      {loading && <LoadingState message="Computing Deterministic Skill Gap Analysis..." subtext="Matching your profile against required frontend, backend, database, and AI skills" />}
      {error && <ErrorMessage message={error} onRetry={runSkillGap} />}

      {!loading && skillGapResult && (
        <>
          {/* Top Metric & Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deterministic Skill Match %</span>
              <ScoreBadge score={skillGapResult.matchPercentage} size="lg" />
              <span className="text-xs text-slate-500">
                Total Estimated Learning: <strong className="text-slate-800">{skillGapResult.totalLearningHours} Hours</strong>
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 md:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Learning Roadmap Rationale</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{skillGapResult.overallAdvice}</p>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                  <span className="font-bold text-sm block">{skillGapResult.strongSkills.length}</span>
                  <span className="text-[11px]">🟢 Strong Skills</span>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                  <span className="font-bold text-sm block">{skillGapResult.partialSkills.length}</span>
                  <span className="text-[11px]">🟡 Partial Skills</span>
                </div>
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
                  <span className="font-bold text-sm block">{skillGapResult.missingSkills.length}</span>
                  <span className="text-[11px]">🔴 Missing Skills</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Skill Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Required Skills & Recommended Learning Sequence
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {skillGapResult.prioritySequence.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                        item.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status === 'Strong' ? '🟢' : item.status === 'Partial' ? '🟡' : '🔴'}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.skill}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                      <p className="text-xs font-medium text-indigo-700 mt-1">
                        Recommendation: {item.recommendedResources}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="font-bold text-slate-800">{item.status} Match</span>
                    <span className="text-slate-500 font-medium">{item.estimatedLearningHours} hrs learning time</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Blueprint */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold mb-1">Next Step: Technical Project Blueprint</h4>
              <p className="text-xs text-slate-300">
                Generate the complete system architecture, database schema recommendations, and security protocols.
              </p>
            </div>
            <button
              onClick={() => setActiveStage('blueprint')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <span>Generate Project Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
