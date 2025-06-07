'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send this to your error reporting service (Sentry, LogRocket, etc.)
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    };

    console.error('Error Report:', errorReport);
    
    // Example: Send to error tracking service
    // errorTrackingService.captureException(error, { extra: errorReport });
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
            errorId={this.state.errorId}
          />
        );
      }

      // Default error fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorId,
}) => {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const copyErrorDetails = () => {
    const errorDetails = `
Error ID: ${errorId}
Message: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace available'}
Time: ${new Date().toISOString()}
URL: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}
    `.trim();

    if (typeof window !== 'undefined' && window.navigator.clipboard) {
      window.navigator.clipboard.writeText(errorDetails);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The application encountered an unexpected error. Don't worry, this has been logged and we'll look into it.
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={resetError}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </button>
          
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
        </div>

        <details className="text-left">
          <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
            <Bug className="h-3 w-3" />
            Technical Details
          </summary>
          <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
            <div className="mb-2">
              <strong>Error ID:</strong> {errorId}
            </div>
            <div className="mb-2">
              <strong>Message:</strong> {error?.message || 'Unknown error'}
            </div>
            <div className="break-all">
              <strong>Stack:</strong>
              <pre className="mt-1 whitespace-pre-wrap">{error?.stack || 'No stack trace available'}</pre>
            </div>
            <button
              onClick={copyErrorDetails}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              Copy Error Details
            </button>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ErrorBoundary; 