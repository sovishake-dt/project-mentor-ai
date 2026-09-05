import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { FileCode2, Database, Shield, Cpu, RefreshCw, Copy, Check, ArrowRight, Layers } from 'lucide-react';

export const BlueprintView: React.FC = () => {
  const { profile, selectedProject, blueprint, setBlueprint, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const fetchBlueprint = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateBlueprint(profile, selectedProject);
      setBlueprint(res.blueprint);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate technical project blueprint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && !blueprint) {
      fetchBlueprint();
    }
  }, [selectedProject]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <FileCode2 className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to generate the technical blueprint.</p>
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
            <FileCode2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Technical Project Blueprint</h2>
          </div>
          <p className="text-xs text-slate-500">
            System architecture, database schema, API specification & Gemini prompts for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchBlueprint}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate Blueprint</span>
        </button>
      </div>

      {loading && <LoadingState message="Generating End-to-End Technical Blueprint..." subtext="Designing system components, database schemas, API specs, and Gemini prompts" />}
      {error && <ErrorMessage message={error} onRetry={fetchBlueprint} />}

      {!loading && blueprint && (
        <>
          {/* Architecture Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              High-Level Architecture Pattern
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">{blueprint.architectureOverview}</p>
          </div>

          {/* System Components Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              System Components & Responsibilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {blueprint.components.map((comp, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{comp.name}</h4>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-semibold rounded text-[10px]">
                      {comp.tech}
                    </span>
                  </div>
                  <p className="text-slate-600">{comp.responsibility}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Database Schemas & Models */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              Database Tables / Document Schemas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {blueprint.databaseSchema.tables.map((table, idx) => (
                <div key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 font-mono">
                  <div className="flex items-center justify-between text-indigo-300 font-bold">
                    <span>Table / Collection: {table.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{table.purpose}</p>

                  <div className="pt-2 space-y-1 text-[11px]">
                    {table.columns.map((col, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <span className="text-emerald-400 font-bold">{col.name}</span>
                        <span className="text-slate-400">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Endpoints Specification */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-600" />
              API Endpoints Specification
            </h3>

            <div className="space-y-3 text-xs">
              {blueprint.apiEndpoints.map((ep, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 font-bold rounded text-[10px] text-white ${
                        ep.method === 'GET'
                          ? 'bg-blue-600'
                          : ep.method === 'POST'
                          ? 'bg-emerald-600'
                          : ep.method === 'PUT'
                          ? 'bg-amber-600'
                          : 'bg-rose-600'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{ep.path}</span>
                  </div>

                  <p className="text-slate-600">{ep.description}</p>

                  {ep.requestBody && (
                    <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                      <strong>Req:</strong> {ep.requestBody}
                    </div>
                  )}

                  {ep.responseBody && (
                    <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                      <strong>Res:</strong> {ep.responseBody}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gemini API Prompt Templates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              Production Gemini API Prompts & Configuration
            </h3>

            <div className="space-y-4 text-xs">
              {blueprint.geminiPrompts.map((p, idx) => (
                <div key={idx} className="bg-purple-950 text-purple-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">{p.featureName}</span>
                    <button
                      onClick={() => copyToClipboard(p.systemPrompt, idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-800/60 hover:bg-purple-800 text-purple-200 rounded text-[11px] font-semibold transition-colors"
                    >
                      {copiedPromptIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied Prompt</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-purple-200/80">{p.purpose}</p>

                  <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-purple-200 border border-purple-900/50 space-y-1">
                    <div className="text-purple-400 font-bold">// System Prompt Wrapper</div>
                    <p className="whitespace-pre-wrap">{p.systemPrompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Data Flow */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Security Architecture & Data Privacy Protocols
            </h3>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
              <p className="font-medium">{blueprint.securityProtocol}</p>
              <div className="pt-1">
                <span className="font-bold block mb-1">Data Flow Step-by-Step:</span>
                <p className="text-emerald-900">{blueprint.dataFlow}</p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold mb-1">Proceed to Interactive Roadmap</h4>
              <p className="text-xs text-slate-300">
                Track phase-by-phase development tasks with week estimations and dependency maps.
              </p>
            </div>
            <button
              onClick={() => setActiveStage('roadmap')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <span>View Development Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
