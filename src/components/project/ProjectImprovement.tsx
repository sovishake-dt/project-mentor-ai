import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { ProjectIdea } from '../../types/project';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Wand2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProjectImprovement: React.FC = () => {
  const { profile, improvementResult, setImprovementResult, selectProject, setActiveStage } = useProject();

  const [rawIdeaInput, setRawIdeaInput] = useState(
    'I want to build a web app for college students to share notes and prepare for exams using AI.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImprove = async () => {
    if (!rawIdeaInput.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.improveProject(rawIdeaInput.trim(), profile);
      setImprovementResult(res.result);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze and improve project idea.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptImproved = () => {
    if (!improvementResult) return;

    const newProject: ProjectIdea = {
      id: `improved-${Date.now()}`,
      title: improvementResult.refinedTitle,
      shortDescription: improvementResult.elevatorPitch,
      problemStatement: improvementResult.originalConcept,
      realWorldProblem: improvementResult.refinedTitle,
      targetUsers: ['Students', 'Final-Year Project Examiners'],
      coreFeatures: improvementResult.addedFeatures,
      advancedFeatures: improvementResult.techStackUpgrades,
      aiMlUsage: 'Gemini API multi-modal synthesis & automated evaluation',
      technologyStack: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Express.js', 'Node.js'],
        aiMl: ['Gemini API'],
        database: ['PostgreSQL'],
        tools: ['Docker', 'Cloud Run', 'Vite'],
      },
      difficulty: 'Challenging',
      estimatedDurationWeeks: profile.constraints.availableWeeks,
      estimatedCostUsd: profile.constraints.budgetUsd,
      scores: {
        innovation: 88,
        feasibility: 85,
        impact: 90,
        scalability: 82,
        technicalDepth: 86,
        skillMatch: 88,
      },
      whyItMatches: 'Elevated from your custom project description to meet competition standards.',
    };

    selectProject(newProject);
    setActiveStage('reality-check');
  };

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Improve My Existing Project Idea</h2>
        </div>
        <p className="text-xs text-slate-500">
          Already have a rough idea? Paste it below and let the AI elevate it into a competition-ready project.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Paste / Type Your Raw Idea Description:
          </label>
          <textarea
            value={rawIdeaInput}
            onChange={(e) => setRawIdeaInput(e.target.value)}
            rows={4}
            placeholder="Describe what you want to build, e.g., 'An app that detects crop diseases using image upload and suggests pesticides'..."
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleImprove}
          disabled={!rawIdeaInput.trim() || loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Elevate Project Concept</span>
        </button>
      </div>

      {loading && <LoadingState message="Analyzing and Elevating Your Raw Project Idea..." subtext="Refining title, adding missing competition features, and selecting modern tech stack with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={handleImprove} />}

      {!loading && improvementResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded text-[10px] uppercase">
                Elevated Project Title
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{improvementResult.refinedTitle}</h3>
            </div>

            <button
              onClick={handleAdoptImproved}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Adopt as Active Project</span>
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Elevator Pitch</h4>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                {improvementResult.elevatorPitch}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Features Added to Meet Competition Standards</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {improvementResult.addedFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Tech Stack & Architecture Upgrades</h4>
              <ul className="list-disc list-inside space-y-1 text-indigo-900 font-medium">
                {improvementResult.techStackUpgrades.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Feasibility & Risk Adjustments</h4>
              <p className="p-3 bg-amber-50 text-amber-950 border border-amber-200 rounded-xl leading-relaxed">
                {improvementResult.feasibilityAdjustments}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
