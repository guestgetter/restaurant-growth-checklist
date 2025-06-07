'use client';

import React from 'react';
import ErrorBoundary, { ErrorFallbackProps } from './ErrorBoundary';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';

interface DataErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Specialized error fallback for data-related errors
const DataErrorFallback: React.FC<ErrorFallbackProps & {
  fallbackTitle?: string;
  fallbackMessage?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}> = ({
  error,
  resetError,
  errorId,
  fallbackTitle = "Unable to load data",
  fallbackMessage = "There was a problem loading the data. This could be due to a network issue or temporary service interruption.",
  showRetry = true,
  onRetry,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    resetError();
  };

  // Determine if this is likely a data/API error
  const isApiError = error?.message?.includes('fetch') || 
                     error?.message?.includes('network') ||
                     error?.message?.includes('API') ||
                     error?.name === 'TypeError';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
          {isApiError ? (
            <Database className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          ) : (
            <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {fallbackTitle}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        {fallbackMessage}
      </p>

      {showRetry && (
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left w-full max-w-md">
          <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            Debug Info (Development)
          </summary>
          <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
            <div className="mb-1">
              <strong>Error:</strong> {error?.message || 'Unknown'}
            </div>
            <div>
              <strong>ID:</strong> {errorId}
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

// Data Error Boundary component
const DataErrorBoundary: React.FC<DataErrorBoundaryProps> = ({
  children,
  fallbackTitle,
  fallbackMessage,
  showRetry = true,
  onRetry,
  onError,
}) => {
  const fallbackComponent = (props: ErrorFallbackProps) => (
    <DataErrorFallback
      {...props}
      fallbackTitle={fallbackTitle}
      fallbackMessage={fallbackMessage}
      showRetry={showRetry}
      onRetry={onRetry}
    />
  );

  return (
    <ErrorBoundary
      fallbackComponent={fallbackComponent}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default DataErrorBoundary; 