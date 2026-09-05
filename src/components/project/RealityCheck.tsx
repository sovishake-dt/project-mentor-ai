import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ScoreBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Gauge, ShieldAlert, AlertOctagon, CheckCircle2, ArrowRight, RefreshCw, Wand2, Sparkles, Sliders } from 'lucide-react';

export const RealityCheck: React.FC = () => {
  const { profile, selectedProject, realityAnalysis, setRealityAnalysis, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAdjustment, setLastAdjustment] = useState<string | null>(null);

  const fetchRealityCheck = async (adjustmentMode?: string) => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);
    if (adjustmentMode) setLastAdjustment(adjustmentMode);

    try {
      const res = await api.analyzeProject(profile, selectedProject, adjustmentMode);
      setRealityAnalysis(res.analysis);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze project reality.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && !realityAnalysis) {
      fetchRealityCheck();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Gauge className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Please select or generate a project idea first to run the Reality Check audit.</p>
        <button
          onClick={() => setActiveStage('ideas')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
        >
          <span>Browse Ideas</span>
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
            <Gauge className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Project Reality Check</h2>
          </div>
          <p className="text-xs text-slate-500">
            Serious feasibility audit for <span className="font-bold text-slate-800">{selectedProject.title}</span> against student constraints.
          </p>
        </div>

        <button
          onClick={() => fetchRealityCheck()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run Audit</span>
        </button>
      </div>

      {loading && <LoadingState message="Auditing Feasibility & Resource Dependencies..." subtext="Evaluating timeline risks, dataset availability, and cost constraints with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={() => fetchRealityCheck()} />}

      {!loading && realityAnalysis && (
        <>
          {/* Reality Score & Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Reality Score</span>
              <ScoreBadge score={realityAnalysis.realityScore} size="lg" />
              <p className="text-xs text-slate-600 mt-2">
                {realityAnalysis.realityScore >= 80
                  ? 'High probability of on-time completion and strong presentation.'
                  : realityAnalysis.realityScore >= 60
                  ? 'Feasible, but requires strict scope control and early MVP execution.'
                  : 'High-risk project. Consider reducing scope or using pre-trained APIs.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 md:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Audit Summary & Timeline Alignment</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{realityAnalysis.feasibility}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-0.5">Time Fit ({profile.constraints.availableWeeks} weeks):</span>
                  <span className="text-slate-600">{realityAnalysis.timeFit}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-0.5">Cost Fit (${profile.constraints.budgetUsd} budget):</span>
                  <span className="text-slate-600">{realityAnalysis.costFeasibility}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Adjustment Action Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold">Dynamic Reality Optimization</h3>
            </div>
            <p className="text-xs text-slate-300">
              Click any mode button below to instruct the AI to recalculate and optimize this project's feasibility:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Make More Feasible', mode: 'Make More Feasible', icon: CheckCircle2 },
                { label: 'Make More Innovative', mode: 'Make More Innovative', icon: Sparkles },
                { label: 'Make More Advanced', mode: 'Make More Advanced', icon: Wand2 },
                { label: 'Reduce Scope', mode: 'Reduce Scope', icon: Sliders },
              ].map(({ label, mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => fetchRealityCheck(mode)}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    lastAdjustment === mode
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dependencies & Risk Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Resource & Hardware Dependencies</h3>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="font-bold text-slate-800">Dataset Dependency: </span>
                  <span className="text-slate-600">{realityAnalysis.datasetDependency}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="font-bold text-slate-800">API Dependency: </span>
                  <span className="text-slate-600">{realityAnalysis.apiDependency}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="font-bold text-slate-800">Hardware Requirements: </span>
                  <span className="text-slate-600">{realityAnalysis.hardwareDependency}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Major Risks & Potential Blockers
              </h3>
              <div>
                <span className="font-bold text-rose-800 block mb-1">Identified Project Risks:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {realityAnalysis.majorRisks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              {realityAnalysis.majorBlockers.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-amber-800 block mb-1">Critical Blockers:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {realityAnalysis.majorBlockers.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Version Scope Breakdowns: MVP vs Standard vs Advanced */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recommended Project Staging Versions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* MVP */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px] uppercase">
                    Version 1.0 (MVP)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">{realityAnalysis.versions.mvp.title}</h4>
                  <span className="text-slate-500 block mb-3 font-medium">{realityAnalysis.versions.mvp.estimatedWeeks} Weeks Required</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {realityAnalysis.versions.mvp.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Standard */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-md text-[10px] uppercase">
                    Version 2.0 (Standard)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">{realityAnalysis.versions.standard.title}</h4>
                  <span className="text-slate-500 block mb-3 font-medium">{realityAnalysis.versions.standard.estimatedWeeks} Weeks Required</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {realityAnalysis.versions.standard.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Advanced */}
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-md text-[10px] uppercase">
                    Version 3.0 (Competition)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">{realityAnalysis.versions.advanced.title}</h4>
                  <span className="text-slate-500 block mb-3 font-medium">{realityAnalysis.versions.advanced.estimatedWeeks} Weeks Required</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {realityAnalysis.versions.advanced.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
