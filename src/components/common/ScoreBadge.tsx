import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label,
  size = 'md',
  showProgress = true,
}) => {
  let colorBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let barColor = 'bg-emerald-500';

  if (score < 60) {
    colorBg = 'bg-rose-50 text-rose-700 border-rose-200';
    barColor = 'bg-rose-500';
  } else if (score < 80) {
    colorBg = 'bg-amber-50 text-amber-700 border-amber-200';
    barColor = 'bg-amber-500';
  }

  const textSize = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-lg font-bold px-3 py-1' : 'text-sm px-2.5 py-1 font-semibold';

  return (
    <div className="flex flex-col gap-1 inline-flex">
      <div className={`inline-flex items-center gap-1.5 rounded-full border ${colorBg} ${textSize}`}>
        {label && <span className="opacity-80 text-[0.85em] font-normal">{label}:</span>}
        <span>{score}/100</span>
      </div>
      {showProgress && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (difficulty === 'Easy') style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (difficulty === 'Moderate') style = 'bg-blue-50 text-blue-700 border-blue-200';
  if (difficulty === 'Challenging') style = 'bg-amber-50 text-amber-700 border-amber-200';
  if (difficulty === 'Competition-Level') style = 'bg-purple-50 text-purple-700 border-purple-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {difficulty}
    </span>
  );
};
