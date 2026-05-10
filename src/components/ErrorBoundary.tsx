import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Route error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bgPrimary text-brand-textPrimary px-6">
          <h1 className="font-display text-[32px] tracking-tighter uppercase mb-4">Something went wrong</h1>
          <p className="font-body text-white/40 max-w-md text-center mb-8">
            We encountered an unexpected error. Please refresh the page or return home.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#c8ff00] text-black font-body font-bold text-[11px] uppercase tracking-[0.2em]"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
