import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ShieldAlert, RefreshCw, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RiskRadar: React.FC = () => {
  const { profile, selectedProject, risks, setRisks, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateRisks(profile, selectedProject);
      setRisks(res.risks);
    } catch (err: any) {
      setError(err?.message || 'Failed to scan project risk radar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && risks.length === 0) {
      fetchRisks();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to view the Risk Radar scan.</p>
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
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900">Project Risk Radar</h2>
          </div>
          <p className="text-xs text-slate-500">
            Proactive risk scan & mitigation strategies for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchRisks}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rescan Risk Radar</span>
        </button>
      </div>

      {loading && <LoadingState message="Scanning Project Risk Vectors..." subtext="Identifying technical failure points, scope creep, and timeline bottlenecks with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={fetchRisks} />}

      {!loading && risks.length > 0 && (
        <div className="space-y-4">
          {risks.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px] uppercase">
                    {item.riskCategory}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      item.likelihood === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : item.likelihood === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Likelihood: {item.likelihood}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      item.impact === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : item.impact === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Impact: {item.impact}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recommended Actionable Mitigation Strategy:
                </span>
                <p className="text-emerald-900">{item.mitigationStrategy}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
