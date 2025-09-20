"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class GradientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-100 via-pink-50 to-red-100 border border-white/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Something Went Wrong
            </h2>
            <p className="text-gray-700 mb-6 px-4">We encountered an unexpected error. Please try refreshing the page.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              {this.props.onReset && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false })
                    this.props.onReset?.()
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
