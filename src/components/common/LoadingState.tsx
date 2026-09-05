import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'AI Engine is processing...',
  subtext = 'Analyzing project requirements and student profile context',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm text-center my-6">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
        <Loader2 className="w-14 h-14 text-indigo-600 animate-spin absolute -top-1 -left-1 opacity-75" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{message}</h3>
      <p className="text-sm text-slate-500 max-w-md">{subtext}</p>
    </div>
  );
};
