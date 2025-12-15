import React, { Component, ErrorInfo, ReactNode } from 'react';
import DataFallback from './DataFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DataFallback
          title="Something went wrong"
          description={this.state.error?.message || "An unexpected error occurred"}
          actionText="Try Again"
          onAction={this.handleRetry}
          showAction={true}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;