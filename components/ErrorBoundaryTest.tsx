'use client';

import React, { useState } from 'react';
import { Bug, Database, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryTestProps {
  className?: string;
}

const ErrorBoundaryTest: React.FC<ErrorBoundaryTestProps> = ({ className = '' }) => {
  const [shouldError, setShouldError] = useState(false);

  // Component that throws an error when shouldError is true
  const ErrorTrigger = () => {
    if (shouldError) {
      throw new Error('Intentional error for testing Error Boundary');
    }
    return null;
  };

  const triggerRenderError = () => {
    setShouldError(true);
  };

  const triggerAsyncError = () => {
    // Simulate an async error (note: error boundaries don't catch these)
    setTimeout(() => {
      throw new Error('Async error - this will NOT be caught by Error Boundary');
    }, 100);
  };

  const triggerPromiseRejection = () => {
    // Promise rejection (note: error boundaries don't catch these either)
    Promise.reject(new Error('Promise rejection - this will NOT be caught by Error Boundary'));
  };

  // Only hide in actual production (not preview deployments)
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    return null; // Don't show test component in actual production
  }

  return (
    <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Bug className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
          Error Boundary Test (Development Only)
        </h3>
      </div>
      
      <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-4">
        These buttons test different error scenarios. Only render errors will be caught by Error Boundaries.
      </p>

      <div className="space-y-2">
        <button
          onClick={triggerRenderError}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors w-full"
        >
          <AlertTriangle className="h-4 w-4" />
          Trigger Render Error (Will be caught)
        </button>
        
        <button
          onClick={triggerAsyncError}
          className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors w-full"
        >
          <Database className="h-4 w-4" />
          Trigger Async Error (Won't be caught)
        </button>
        
        <button
          onClick={triggerPromiseRejection}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors w-full"
        >
          <Bug className="h-4 w-4" />
          Trigger Promise Rejection (Won't be caught)
        </button>
      </div>

      <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
        <strong>Note:</strong> Error boundaries only catch errors during rendering, in lifecycle methods, 
        and in constructors. They do NOT catch errors in event handlers, async code, or during SSR.
      </div>

      {/* This will trigger the error when shouldError is true */}
      <ErrorTrigger />
    </div>
  );
};

export default ErrorBoundaryTest; 