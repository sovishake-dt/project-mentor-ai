import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ProjectIdea } from '../../types/project';
import { ScoreBadge, DifficultyBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Lightbulb, Sparkles, Swords, CheckCircle, Eye, ArrowRight, RefreshCw, Filter } from 'lucide-react';

export const IdeaGenerator: React.FC = () => {
  const {
    profile,
    generatedIdeas,
    setGeneratedIdeas,
    selectedIdeasForClash,
    setSelectedIdeasForClash,
    selectProject,
    selectedProject,
    setActiveStage,
  } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModalIdea, setSelectedModalIdea] = useState<ProjectIdea | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateIdeas(profile);
      setGeneratedIdeas(res.ideas);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate project ideas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generatedIdeas.length === 0) {
      fetchIdeas();
    }
  }, []);

  const toggleClashSelection = (idea: ProjectIdea) => {
    if (selectedIdeasForClash.some((i) => i.id === idea.id)) {
      setSelectedIdeasForClash(selectedIdeasForClash.filter((i) => i.id !== idea.id));
    } else {
      if (selectedIdeasForClash.length >= 3) {
        alert('You can select a maximum of 3 ideas for Idea Clash comparison.');
        return;
      }
      setSelectedIdeasForClash([...selectedIdeasForClash, idea]);
    }
  };

  const filteredIdeas = generatedIdeas.filter((idea) => {
    if (difficultyFilter !== 'All' && idea.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Personalized Project Ideas</h2>
          </div>
          <p className="text-xs text-slate-500">
            Engineered based on your stack ({profile.skills.languages.join(', ')}), {profile.constraints.availableWeeks} week limit, and {profile.constraints.preferredDifficulty} difficulty preference.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIdeasForClash.length >= 2 && (
            <button
              onClick={() => setActiveStage('clash')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-xs animate-pulse"
            >
              <Swords className="w-4 h-4" />
              <span>Compare {selectedIdeasForClash.length} Ideas (Clash)</span>
            </button>
          )}

          <button
            onClick={fetchIdeas}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Ideas</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700">Filter Difficulty:</span>
          {['All', 'Easy', 'Moderate', 'Challenging', 'Competition-Level'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                difficultyFilter === diff
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <span className="text-slate-500 font-medium hidden sm:inline">
          Showing {filteredIdeas.length} of {generatedIdeas.length} ideas
        </span>
      </div>

      {/* Loading & Error States */}
      {loading && <LoadingState message="Generating Personalized Project Ideas..." subtext="Analyzing your tech stack, time limits, and hardware constraints with Gemini 3.8 Flash" />}
      {error && <ErrorMessage message={error} onRetry={fetchIdeas} />}

      {/* Ideas Grid */}
      {!loading && !error && filteredIdeas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.map((idea) => {
            const isSelectedAsActive = selectedProject?.id === idea.id;
            const isSelectedForClash = selectedIdeasForClash.some((i) => i.id === idea.id);

            return (
              <div
                key={idea.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  isSelectedAsActive
                    ? 'border-2 border-indigo-600 shadow-md ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Row: Title & Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DifficultyBadge difficulty={idea.difficulty} />
                        <span className="text-xs font-medium text-slate-500">
                          {idea.estimatedDurationWeeks} Weeks • ${idea.estimatedCostUsd} Budget
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{idea.title}</h3>
                    </div>

                    <ScoreBadge score={idea.scores.innovation} label="Innovation" size="sm" showProgress={false} />
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{idea.shortDescription}</p>

                  {/* Problem Statement Snippet */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Real-World Gap:</span>
                    <p className="text-slate-600 line-clamp-2">{idea.realWorldProblem || idea.problemStatement}</p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        ...idea.technologyStack.frontend,
                        ...idea.technologyStack.backend,
                        ...idea.technologyStack.aiMl,
                      ]
                        .slice(0, 5)
                        .map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Why it matches */}
                  <div className="text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-lg mb-4 border border-indigo-100">
                    <span className="font-semibold text-indigo-700">Why it matches you: </span>
                    <span>{idea.whyItMatches}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedModalIdea(idea)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View full idea details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleClashSelection(idea)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        isSelectedForClash
                          ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isSelectedForClash ? 'Selected for Clash' : '+ Compare'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      selectProject(idea);
                      setActiveStage('reality-check');
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelectedAsActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                    }`}
                  >
                    {isSelectedAsActive ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Active Project</span>
                      </>
                    ) : (
                      <>
                        <span>Select Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedModalIdea && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <DifficultyBadge difficulty={selectedModalIdea.difficulty} />
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedModalIdea.title}</h3>
              </div>
              <button
                onClick={() => setSelectedModalIdea(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Problem Statement & Target Users</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedModalIdea.problemStatement}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedModalIdea.targetUsers.map((u) => (
                    <span key={u} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      Target User: {u}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Core Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedModalIdea.coreFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Advanced Innovation Features</h4>
                <ul className="list-disc list-inside space-y-1 text-indigo-900">
                  {selectedModalIdea.advancedFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">AI/ML Integration</h4>
                <p className="bg-purple-50 text-purple-900 p-3 rounded-xl border border-purple-200">{selectedModalIdea.aiMlUsage}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <ScoreBadge score={selectedModalIdea.scores.innovation} label="Innovation" />
                <ScoreBadge score={selectedModalIdea.scores.feasibility} label="Feasibility" />
                <ScoreBadge score={selectedModalIdea.scores.impact} label="Impact" />
                <ScoreBadge score={selectedModalIdea.scores.scalability} label="Scalability" />
                <ScoreBadge score={selectedModalIdea.scores.technicalDepth} label="Tech Depth" />
                <ScoreBadge score={selectedModalIdea.scores.skillMatch} label="Skill Match" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedModalIdea(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  selectProject(selectedModalIdea);
                  setSelectedModalIdea(null);
                  setActiveStage('reality-check');
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Select As My Active Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
