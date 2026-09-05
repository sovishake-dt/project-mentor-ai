import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Sparkles, RefreshCw, ArrowRight, Zap } from 'lucide-react';

export const InnovationBooster: React.FC = () => {
  const { selectedProject, innovations, setInnovations, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInnovations = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateInnovations(selectedProject);
      setInnovations(res.innovations);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate innovation suggestions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && innovations.length === 0) {
      fetchInnovations();
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Sparkles className="w-12 h-12 text-purple-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to view Innovation Booster enhancements.</p>
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
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">AI Innovation Booster</h2>
          </div>
          <p className="text-xs text-slate-500">
            Elevate <span className="font-bold text-slate-800">{selectedProject.title}</span> with competition-grade features and modern tech integration.
          </p>
        </div>

        <button
          onClick={fetchInnovations}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Generate Innovations</span>
        </button>
      </div>

      {loading && <LoadingState message="Brainstorming Competition Innovations..." subtext="Formulating novel algorithms, API integrations, and unique UI/UX capabilities with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={fetchInnovations} />}

      {!loading && innovations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {innovations.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px] uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{item.impactScore} Score Boost
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Implementation Technique:</span>
                  <p className="text-slate-600">{item.implementationDetail}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Effort: <strong className="text-slate-700">{item.effortLevel}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
