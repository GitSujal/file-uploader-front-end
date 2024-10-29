import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-600">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Retry
      </button>
    )}
  </div>
);