'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-error-container/20 border border-error/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
            <h2 className="text-xl font-bold text-on-surface">Something went wrong</h2>
          </div>
          
          <p className="text-on-surface-variant mb-6">
            We encountered an error loading this page. This could be due to a temporary issue or a problem with your connection.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-surface-container-low rounded-lg p-4 mb-6 overflow-auto">
              <p className="text-xs font-mono text-error">{error.message}</p>
              {error.stack && (
                <pre className="text-xs font-mono text-on-surface-variant mt-2 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Try again
            </button>
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
