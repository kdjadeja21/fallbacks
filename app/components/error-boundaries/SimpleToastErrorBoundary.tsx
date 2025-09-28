"use client"

import React from "react"

interface SimpleToastErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  position?: "top" | "bottom" | "center"
  autoHide?: boolean
  duration?: number
}

interface SimpleToastErrorBoundaryState {
  hasError: boolean
  error: Error | null
  isVisible: boolean
}

// Simple icons
const XMarkIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ExclamationIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

export class SimpleToastErrorBoundary extends React.Component<
  SimpleToastErrorBoundaryProps,
  SimpleToastErrorBoundaryState
> {
  private hideTimer: NodeJS.Timeout | null = null

  constructor(props: SimpleToastErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isVisible: true,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<SimpleToastErrorBoundaryState> {
    return { hasError: true, error, isVisible: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SimpleToastErrorBoundary caught an error:", error, errorInfo)
    
    // Auto-hide timer
    if (this.props.autoHide !== false) {
      const duration = this.props.duration || 5000
      this.hideTimer = setTimeout(() => {
        this.setState({ isVisible: false })
      }, duration)
    }
  }

  componentWillUnmount() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
    }
  }

  handleClose = () => {
    this.setState({ isVisible: false })
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, isVisible: true })
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
    }
    this.props.onReset?.()
  }

  getPositionClasses = () => {
    const { position = "top" } = this.props
    const base = "fixed left-1/2 transform -translate-x-1/2 z-50"
    
    switch (position) {
      case "top": return `${base} top-4`
      case "bottom": return `${base} bottom-4`
      case "center": return `${base} top-1/2 -translate-y-1/2`
      default: return `${base} top-4`
    }
  }

  render() {
    if (this.state.hasError && this.state.isVisible) {
      const { error } = this.state

      return (
        <>
          {/* Toast Notification */}
          <div className={this.getPositionClasses()}>
            <div className="bg-white border border-red-200 rounded-lg shadow-lg max-w-md mx-4 overflow-hidden animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start p-4">
                <div className="flex-shrink-0">
                  <ExclamationIcon className="w-5 h-5 text-red-500 mt-0.5" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    Component Error
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {error?.message || "Something went wrong"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={this.handleRetry}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      Retry
                    </button>
                    <button
                      onClick={this.handleClose}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  onClick={this.handleClose}
                  className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Fallback Content */}
          <div className="min-h-[200px] flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationIcon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Component Unavailable
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                This component encountered an error and cannot be displayed.
              </p>
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </>
      )
    }

    if (this.state.hasError && !this.state.isVisible) {
      // Show minimal fallback when toast is dismissed
      return (
        <div className="min-h-[100px] flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-center">
            <p className="text-sm text-red-700 mb-2">Component error occurred</p>
            <button
              onClick={this.handleRetry}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}