import React from 'react';

/**
 * ErrorBoundary
 * Catches runtime errors in child component tree and prevents whole app from unmounting.
 * Provides a reset option. You can pass a `watch` prop (array of values). When any of those change,
 * it will automatically clear the error state (useful when user switches algorithms).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real production setup you might send this to an external service (Sentry, etc.)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Caught error:', error, info);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.watch && Array.isArray(this.props.watch)) {
      const changed = this.props.watch.some((val, idx) => val !== prevProps.watch?.[idx]);
      if (changed && this.state.hasError) {
        this.setState({ hasError: false, error: null });
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-500/30 rounded-lg bg-red-950/40 text-red-200 space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold flex items-center gap-2">Visualization crashed</h2>
          <p className="text-sm opacity-90">Something went wrong while rendering this component. You can try resetting it or switch algorithms.</p>
          {this.state.error && (
            <details className="text-xs max-h-40 overflow-auto opacity-80 whitespace-pre-wrap">
              <summary className="cursor-pointer select-none">Error details</summary>
              {this.state.error?.toString()}
            </details>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              Reset
            </button>
            {this.props.onRecover && (
              <button
                onClick={() => { this.props.onRecover(); this.handleReset(); }}
                className="px-3 py-1.5 text-sm rounded bg-slate-600 hover:bg-slate-500 text-white font-medium transition-colors"
              >
                Recover Action
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
