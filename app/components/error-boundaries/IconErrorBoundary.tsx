"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class IconErrorBoundary extends React.Component<Props, State> {
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
        <div className="p-4 sm:p-6 text-center border border-orange-200 rounded-lg bg-orange-50">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-orange-800 mb-2">Component Error</h2>
          <p className="text-orange-700 mb-4 px-2">This component encountered an unexpected error and couldn't load.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            {this.props.onReset && (
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  this.props.onReset?.()
                }}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
