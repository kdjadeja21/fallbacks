"use client"

import React from "react"

interface ModernCleanErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  title?: string
  description?: string
}

interface ModernCleanErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

// Simple SVG Icons
const AlertIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const CodeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

export class ModernCleanErrorBoundary extends React.Component<
  ModernCleanErrorBoundaryProps,
  ModernCleanErrorBoundaryState
> {
  constructor(props: ModernCleanErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ModernCleanErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    console.error("ModernCleanErrorBoundary caught an error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      const { title = "Something went wrong", description } = this.props
      const { error } = this.state

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                <AlertIcon className="w-8 h-8 text-red-500" />
              </div>
              
              {/* Content */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {description || 
                  "An unexpected error occurred while rendering this component. This is likely a client-side issue."
                }
              </p>

              {/* Error Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CodeIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Error Details</span>
                </div>
                <code className="text-sm text-red-600 font-mono">
                  {error?.name}: {error?.message || "Unknown error"}
                </code>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshIcon className="w-4 h-4" />
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Reload Page
                </button>
              </div>

              {/* Footer */}
              <p className="text-xs text-gray-500 mt-6">
                If this problem persists, please check the browser console for more details.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}