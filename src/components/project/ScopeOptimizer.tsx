import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Sliders, CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

export const ScopeOptimizer: React.FC = () => {
  const { profile, selectedProject, scopeModes, setScopeModes, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScope = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateScope(profile, selectedProject);
      setScopeModes(res.scopeModes);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate scope optimizer configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && scopeModes.length === 0) {
      fetchScope();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Sliders className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to optimize its scope mode.</p>
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
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Scope Optimizer Engine</h2>
          </div>
          <p className="text-xs text-slate-500">
            Select between 3 calibrated scope modes for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchScope}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalibrate Scope</span>
        </button>
      </div>

      {loading && <LoadingState message="Optimizing Scope Configurations..." subtext="Analyzing feature priority matrix vs timeline constraints with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={fetchScope} />}

      {!loading && scopeModes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scopeModes.map((mode, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-4 ${
                mode.modeName.includes('Standard')
                  ? 'border-2 border-indigo-600 shadow-md ring-2 ring-indigo-100'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 font-bold rounded text-[10px] uppercase ${
                      mode.modeName.includes('Minimal')
                        ? 'bg-emerald-100 text-emerald-800'
                        : mode.modeName.includes('Standard')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {mode.modeName}
                  </span>

                  <span className="text-xs font-bold text-slate-700">{mode.estimatedWeeks} Weeks</span>
                </div>

                <p className="text-xs text-slate-600 mb-4">{mode.targetAudience}</p>

                {/* Included Features */}
                <div className="mb-4 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Included Features:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {mode.includedFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Excluded Features */}
                <div className="mb-4 text-xs">
                  <span className="font-bold text-slate-500 flex items-center gap-1 mb-1.5">
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    Excluded / Post-Grad Features:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-500">
                    {mode.excludedFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Advisor Advice:</span>
                  <p>{mode.advisorNote}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs flex items-center justify-between">
                <span className="text-slate-500">
                  Risk Profile: <strong className="text-slate-800">{mode.riskLevel}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
