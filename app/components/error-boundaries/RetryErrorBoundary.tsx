"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  retryCount: number
  isRetrying: boolean
}

export class RetryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Retry boundary caught error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      isRetrying: true,
      retryCount: this.state.retryCount + 1,
    })

    setTimeout(() => {
      this.setState({
        hasError: false,
        isRetrying: false,
      })
      this.props.onReset?.()
    }, 1000)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 sm:p-5 border-2 border-blue-200 rounded-lg bg-blue-50">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-blue-800">Component Failed to Load</h2>
              <p className="text-blue-700 mt-1">
                {this.state.retryCount > 0
                  ? `Retry attempt ${this.state.retryCount} failed. Try again?`
                  : "Something went wrong. Would you like to retry?"}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mt-4">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {this.state.isRetrying ? "Retrying..." : "Retry"}
                </button>
                {this.state.retryCount >= 2 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full sm:w-auto px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Reload Page
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
