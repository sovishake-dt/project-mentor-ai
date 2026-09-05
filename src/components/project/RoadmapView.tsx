import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Map, CheckSquare, Square, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { selectedProject, roadmap, toggleTaskCompletion, setActiveStage } = useProject();

  if (!selectedProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <Map className="w-12 h-12 text-indigo-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Project Selected</h3>
        <p className="text-xs text-slate-600">Select a project idea to access the development roadmap.</p>
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

  // Calculate overall task stats
  const allTasks = roadmap.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter((t) => t.completed);
  const progressPct = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Interactive Development Roadmap</h2>
            </div>
            <p className="text-xs text-slate-500">
              Phase-by-phase task breakdown for <span className="font-bold text-slate-800">{selectedProject.title}</span>.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 text-right shrink-0">
            <span className="text-xs font-bold text-indigo-900 block">
              Roadmap Progress: {completedTasks.length}/{allTasks.length} Tasks ({progressPct}%)
            </span>
            <div className="w-36 h-2 bg-indigo-200 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phases & Task Checklists */}
      <div className="space-y-6">
        {roadmap.map((phase) => {
          const phaseTasks = phase.tasks;
          const phaseDone = phaseTasks.filter((t) => t.completed).length;

          return (
            <div key={phase.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded uppercase">
                      {phase.estimatedWeeks} Weeks Est.
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{phase.phaseName}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                </div>

                <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                  {phaseDone}/{phaseTasks.length} Tasks Complete
                </span>
              </div>

              <div className="space-y-3">
                {phaseTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompletion(phase.id, task.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-2xs'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0 text-indigo-600">
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4
                          className={`font-bold ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedDays} days
                        </span>
                      </div>

                      <p className="text-slate-600 mb-2">{task.description}</p>

                      <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">Expected Deliverable: </span>
                        <span>{task.expectedOutcome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Need Architecture Advice or Code Guidance?
          </h4>
          <p className="text-xs text-slate-300">
            Chat with your Senior AI Project Mentor for step-by-step technical coaching.
          </p>
        </div>
        <button
          onClick={() => setActiveStage('mentor')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <span>Open AI Project Mentor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
