import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ScoreBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Swords, Trophy, CheckCircle, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const IdeaClash: React.FC = () => {
  const {
    profile,
    selectedIdeasForClash,
    setSelectedIdeasForClash,
    comparisonResult,
    setComparisonResult,
    selectProject,
    setActiveStage,
  } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runComparison = async () => {
    if (selectedIdeasForClash.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.compareIdeas(profile, selectedIdeasForClash);
      setComparisonResult(res.comparison);
    } catch (err: any) {
      setError(err?.message || 'Failed to compare ideas in Idea Clash.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIdeasForClash.length >= 2 && !comparisonResult) {
      runComparison();
    }
  }, [selectedIdeasForClash]);

  if (selectedIdeasForClash.length < 2) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Swords className="w-12 h-12 text-purple-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Idea Clash Comparison Engine</h3>
        <p className="text-xs text-slate-600">
          Select 2 or 3 project ideas from the Idea Generator to run a side-by-side competition clash audit.
        </p>
        <button
          onClick={() => setActiveStage('ideas')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
        >
          <span>Go to Idea Generator</span>
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
            <Swords className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">Idea Clash Comparison Matrix</h2>
          </div>
          <p className="text-xs text-slate-500">
            Comparing {selectedIdeasForClash.length} projects against your skill profile, team constraints ({profile.constraints.teamSize} member), and timeline ({profile.constraints.availableWeeks} weeks).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runComparison}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-run Clash Audit</span>
          </button>
        </div>
      </div>

      {loading && <LoadingState message="Running Idea Clash Evaluation Matrix..." subtext="Evaluating technical depth, feasibility, and competition judge alignment with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={runComparison} />}

      {!loading && comparisonResult && (
        <>
          {/* Winner Rationale Banner */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>AI Recommended Champion Project</span>
            </div>
            <h3 className="text-xl font-extrabold">
              {selectedIdeasForClash.find((i) => i.id === comparisonResult.bestProjectId)?.title || 'Best Project Choice'}
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed max-w-3xl">
              {comparisonResult.recommendationReason}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const best = selectedIdeasForClash.find((i) => i.id === comparisonResult.bestProjectId);
                  if (best) selectProject(best);
                  setActiveStage('reality-check');
                }}
                className="px-5 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
              >
                <span>Adopt Recommended Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overall Comparison */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Side-by-Side Tradeoff Analysis
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{comparisonResult.overallComparison}</p>
          </div>

          {/* Comparative Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedIdeasForClash.map((idea) => {
              const isBest = comparisonResult.bestProjectId === idea.id;
              const strengths = comparisonResult.strengths[idea.id] || [];
              const weaknesses = comparisonResult.weaknesses[idea.id] || [];

              return (
                <div
                  key={idea.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-4 ${
                    isBest ? 'border-2 border-amber-400 shadow-md ring-2 ring-amber-100' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {isBest && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-md text-[11px] mb-3">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Recommended #1 Choice</span>
                      </div>
                    )}

                    <h4 className="text-base font-bold text-slate-900 mb-2">{idea.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">{idea.shortDescription}</p>

                    {/* Scores Breakdown */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <ScoreBadge score={idea.scores.innovation} label="Innovation" size="sm" />
                      <ScoreBadge score={idea.scores.feasibility} label="Feasibility" size="sm" />
                      <ScoreBadge score={idea.scores.technicalDepth} label="Tech Depth" size="sm" />
                      <ScoreBadge score={idea.scores.skillMatch} label="Skill Match" size="sm" />
                    </div>

                    {/* Strengths */}
                    {strengths.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Key Strengths:
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                          {strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {weaknesses.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1 mb-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          Risks / Weaknesses:
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                          {weaknesses.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        selectProject(idea);
                        setActiveStage('reality-check');
                      }}
                      className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors"
                    >
                      Select This Project
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
