import React from 'react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled UI error', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorState">
          <h2>Something went wrong</h2>
          <p>Refresh the page or try the action again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
