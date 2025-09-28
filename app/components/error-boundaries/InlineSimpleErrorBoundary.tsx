"use client"

import React from "react"

interface InlineSimpleErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  fallbackText?: string
  showRetry?: boolean
  variant?: "inline" | "card" | "banner"
}

interface InlineSimpleErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Minimal icons
const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RotateIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export class InlineSimpleErrorBoundary extends React.Component<
  InlineSimpleErrorBoundaryProps,
  InlineSimpleErrorBoundaryState
> {
  constructor(props: InlineSimpleErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<InlineSimpleErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("InlineSimpleErrorBoundary caught an error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  renderInlineVariant() {
    const { fallbackText = "Error", showRetry = true } = this.props
    
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-md border border-red-200">
        <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">{fallbackText}</span>
        {showRetry && (
          <button
            onClick={this.handleRetry}
            className="ml-1 p-1 hover:bg-red-100 rounded transition-colors"
            title="Retry"
          >
            <RotateIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  renderCardVariant() {
    const { fallbackText = "Component Error", showRetry = true } = this.props
    const { error } = this.state
    
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-red-800 mb-1">
              {fallbackText}
            </h4>
            <p className="text-sm text-red-700">
              {error?.message || "Something went wrong with this component"}
            </p>
            {showRetry && (
              <button
                onClick={this.handleRetry}
                className="mt-2 inline-flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RotateIcon className="w-3 h-3" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderBannerVariant() {
    const { fallbackText = "Component Error", showRetry = true } = this.props
    const { error } = this.state
    
    return (
      <div className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md">
        <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">
            {fallbackText}: {error?.message || "Something went wrong"}
          </p>
        </div>
        {showRetry && (
          <button
            onClick={this.handleRetry}
            className="flex-shrink-0 inline-flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <RotateIcon className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      const { variant = "card" } = this.props
      
      switch (variant) {
        case "inline":
          return this.renderInlineVariant()
        case "card":
          return this.renderCardVariant()
        case "banner":
          return this.renderBannerVariant()
        default:
          return this.renderCardVariant()
      }
    }

    return this.props.children
  }
}