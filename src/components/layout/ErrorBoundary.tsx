import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Top-level error boundary. Without this, any uncaught render error unmounts the
 * whole React tree and leaves the user staring at a blank white page. Here we
 * catch it, show a recovery UI, and offer a reload. Data lives in localStorage,
 * so a reload is non-destructive and usually clears transient render failures.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface the error for debugging. A real product would forward this to an
    // error-reporting service; console keeps it visible without extra deps.
    console.error('Unhandled render error:', error, info.componentStack)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-on-background">
        <div className="w-full max-w-md rounded-3xl border border-outline-variant/50 bg-surface-container-low p-8 text-center shadow-lg">
          <h1 className="font-display text-2xl font-black tracking-tight text-primary">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-on-surface-variant">
            The app hit an unexpected error. Your data is stored locally and is safe. Reloading
            usually fixes it.
          </p>
          {this.state.error?.message ? (
            <p className="mt-4 break-words rounded-xl bg-surface-container px-3 py-2 text-left font-mono text-xs text-on-surface-variant">
              {this.state.error.message}
            </p>
          ) : null}
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-95"
          >
            Reload app
          </button>
        </div>
      </div>
    )
  }
}
