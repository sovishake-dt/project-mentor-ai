import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../services/api';
import { VivaQuestion } from '../../types/project';
import { ScoreBadge } from '../common/ScoreBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../common/ErrorMessage';
import { GraduationCap, ArrowRight, RefreshCw, Send, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';

export const VivaCoach: React.FC = () => {
  const { selectedProject, vivaQuestions, setVivaQuestions, vivaTurns, setVivaTurns, setActiveStage } = useProject();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active question state
  const [selectedQuestion, setSelectedQuestion] = useState<VivaQuestion | null>(null);
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState<Record<string, boolean>>({});

  const fetchViva = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateViva(selectedProject);
      setVivaQuestions(res.questions);
      if (res.questions.length > 0) setSelectedQuestion(res.questions[0]);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate viva questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject && vivaQuestions.length === 0) {
      fetchViva();
    } else if (vivaQuestions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(vivaQuestions[0]);
    }
  }, [selectedProject]);

  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion || !userAnswerInput.trim() || evaluating) return;

    setEvaluating(true);
    try {
      const res = await api.evaluateVivaAnswer(
        selectedQuestion.question,
        selectedQuestion.category,
        userAnswerInput.trim(),
        selectedQuestion.modelAnswer
      );

      const newTurn = {
        questionId: selectedQuestion.id,
        userAnswer: userAnswerInput.trim(),
        evaluation: res.evaluation,
      };

      setVivaTurns((prev) => [...prev.filter((t) => t.questionId !== selectedQuestion.id), newTurn]);
    } catch (err: any) {
      alert(`Evaluation error: ${err?.message || 'Failed to evaluate answer'}`);
    } finally {
      setEvaluating(false);
    }
  };

  const toggleModelAnswer = (qId: string) => {
    setShowModelAnswer((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to practice viva defense questions.</p>
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

  const currentTurn = selectedQuestion ? vivaTurns.find((t) => t.questionId === selectedQuestion.id) : null;

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Viva Coach & Defense Practice Engine</h2>
          </div>
          <p className="text-xs text-slate-500">
            Practice technical viva defense for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchViva}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate Questions</span>
        </button>
      </div>

      {loading && <LoadingState message="Generating Viva Defense Questions..." subtext="Formulating technical examiner challenges across architecture, security, and scalability with Gemini" />}
      {error && <ErrorMessage message={error} onRetry={fetchViva} />}

      {!loading && vivaQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Questions List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Defense Question Bank ({vivaQuestions.length})
            </h3>

            <div className="space-y-2">
              {vivaQuestions.map((q, idx) => {
                const isSelected = selectedQuestion?.id === q.id;
                const turn = vivaTurns.find((t) => t.questionId === q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setUserAnswerInput(turn?.userAnswer || '');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-medium'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        Q{idx + 1} • {q.category}
                      </span>

                      {turn && <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />}
                    </div>

                    <p className={`line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-800 font-semibold'}`}>{q.question}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Practice Canvas */}
          <div className="lg:col-span-2 space-y-4">
            {selectedQuestion && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded text-[10px] uppercase">
                    Category: {selectedQuestion.category}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{selectedQuestion.question}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong>Why Examiners Ask This:</strong> {selectedQuestion.whyAsked}
                  </p>
                </div>

                {/* User Answer Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Type Your Viva Defense Answer:</label>
                  <textarea
                    value={userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    rows={4}
                    placeholder="Type your explanation here. Use technical terminology, mention tradeoffs..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleModelAnswer(selectedQuestion.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800"
                    >
                      {showModelAnswer[selectedQuestion.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showModelAnswer[selectedQuestion.id] ? 'Hide Model Answer' : 'Reveal Model Answer'}</span>
                    </button>

                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={!userAnswerInput.trim() || evaluating}
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{evaluating ? 'Evaluating...' : 'Submit Answer For AI Grading'}</span>
                    </button>
                  </div>
                </div>

                {/* Model Answer Drawer */}
                {showModelAnswer[selectedQuestion.id] && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs space-y-1 text-purple-950">
                    <span className="font-bold text-purple-900 block">Model Gold-Standard Answer:</span>
                    <p className="leading-relaxed">{selectedQuestion.modelAnswer}</p>
                  </div>
                )}

                {/* Evaluation Feedback Results */}
                {currentTurn && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm">AI Viva Evaluation Feedback</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <ScoreBadge score={currentTurn.evaluation.accuracyScore} label="Accuracy" size="sm" />
                      <ScoreBadge score={currentTurn.evaluation.technicalUnderstandingScore} label="Tech Depth" size="sm" />
                      <ScoreBadge score={currentTurn.evaluation.completenessScore} label="Completeness" size="sm" />
                      <ScoreBadge score={currentTurn.evaluation.clarityScore} label="Clarity" size="sm" />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">Examiner Feedback:</span>
                        <p className="text-slate-600">{currentTurn.evaluation.feedback}</p>
                      </div>

                      {currentTurn.evaluation.missingConcepts.length > 0 && (
                        <div>
                          <span className="font-bold text-rose-800 block mb-0.5">Missing Technical Concepts:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {currentTurn.evaluation.missingConcepts.map((m: string, i: number) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
