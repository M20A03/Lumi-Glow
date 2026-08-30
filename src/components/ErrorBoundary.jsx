import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (import.meta.env?.DEV) {
      console.error('[LumiGlow ErrorBoundary caught an error]:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-wrapper" role="alert" style={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-subtle, #F2E8DC)',
          borderRadius: 'var(--radius-lg, 16px)',
          margin: '2rem auto',
          maxWidth: 'var(--container-md, 768px)',
          border: '1px solid var(--color-border, rgba(184, 115, 51, 0.2))'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-rose-bg, #FDF0F2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: 'var(--color-error, #D32F2F)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 'var(--font-size-2xl, 2rem)',
            color: 'var(--color-text-primary, #21140B)',
            marginBottom: '0.75rem'
          }}>
            Something unexpected occurred
          </h2>

          <p style={{
            color: 'var(--color-text-secondary, #5C4537)',
            maxWidth: '480px',
            marginBottom: '1.5rem',
            fontSize: 'var(--font-size-base, 1rem)'
          }}>
            We've isolated the issue so it doesn't affect the rest of your experience. You can reload this section or return to browsing.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{
                minHeight: '44px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              className="btn btn-outline"
              style={{
                minHeight: '44px',
                padding: '0.75rem 1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              Back to Home
            </a>
          </div>

          {import.meta.env?.DEV && this.state.error && (
            <details style={{
              marginTop: '2rem',
              textAlign: 'left',
              width: '100%',
              backgroundColor: 'var(--color-bg-primary, #FFF)',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.8125rem'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error Details (Dev Only)</summary>
              <pre style={{ marginTop: '0.5rem', color: '#D32F2F' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
