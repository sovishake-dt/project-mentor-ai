import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'An unexpected issue occurred while communicating with the AI service.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-200 rounded-xl text-center my-6">
      <AlertTriangle className="w-10 h-10 text-rose-600 mb-3" />
      <h3 className="text-base font-semibold text-rose-900 mb-1">AI Request Unsuccessful</h3>
      <p className="text-sm text-rose-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};
