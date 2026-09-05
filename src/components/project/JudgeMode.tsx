import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ScoreBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Award, Trophy, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const JudgeMode: React.FC = () => {
  const { profile, selectedProject, judgeEvaluation, setJudgeEvaluation, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJudgeEvaluation = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.evaluateJudge(profile, selectedProject);
      setJudgeEvaluation(res.evaluation);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate Judge Mode evaluation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && !judgeEvaluation) {
      fetchJudgeEvaluation();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Award className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to simulate Judge Mode evaluation.</p>
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
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">Judge Mode Competition Simulator</h2>
          </div>
          <p className="text-xs text-slate-500">
            Simulates external panel grading for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchJudgeEvaluation}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-evaluate Project</span>
        </button>
      </div>

      {loading && <LoadingState message="Simulating Competition Jury Evaluation..." subtext="Grading innovation, technical complexity, utility, architecture, and presentation with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={fetchJudgeEvaluation} />}

      {!loading && judgeEvaluation && (
        <>
          {/* Overall Score & Verdict Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/50 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Jury Ranking & Verdict
                </span>
                <h3 className="text-xl font-extrabold text-amber-100">{judgeEvaluation.verdict}</h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-300 block mb-1">Total Score</span>
                <ScoreBadge score={judgeEvaluation.overallScore} size="lg" />
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">{judgeEvaluation.jurySummary}</p>
          </div>

          {/* 5 Core Evaluation Criteria Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {judgeEvaluation.criteriaBreakdown.map((crit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{crit.criterion}</h4>
                    <ScoreBadge score={crit.score} size="sm" showProgress={false} />
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${crit.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{crit.feedback}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Standout Jury Highlights
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {judgeEvaluation.standoutHighlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Key Recommendations to Reach Top 5%
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {judgeEvaluation.keyWeaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Practice Your Defense in Viva Coach
              </h4>
              <p className="text-xs text-slate-300">
                Simulate tough examiner questions and get real-time feedback on your answers.
              </p>
            </div>
            <button
              onClick={() => setActiveStage('viva')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <span>Launch Viva Coach</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
