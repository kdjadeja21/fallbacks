"use client"

import React from "react"

interface ProfessionalBlueErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

interface ProfessionalBlueErrorBoundaryState {
  hasError: boolean
  showDetails: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: boolean
}

// Standalone SVG Icons
const InfoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const CopyIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export class ProfessionalBlueErrorBoundary extends React.Component<
  ProfessionalBlueErrorBoundaryProps,
  ProfessionalBlueErrorBoundaryState
> {
  constructor(props: ProfessionalBlueErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      showDetails: false,
      error: null,
      errorInfo: null,
      copied: false,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Professional Blue Error Boundary caught error:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, showDetails: false, error: null, errorInfo: null, copied: false })
    this.props.onReset?.()
  }

  handleCopy = async () => {
    const errorDetails = this.state.error
      ? `Error: ${this.state.error.toString()}\nComponent Stack: ${this.state.errorInfo?.componentStack || 'N/A'}`
      : "Component rendering failed - please try refreshing the page or contact support if the issue persists."
    try {
      await navigator.clipboard.writeText(errorDetails)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch (err) {
      console.error("Failed to copy error details:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = errorDetails
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    }
  }

  handleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-full overflow-hidden p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Blue info icon */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
              <InfoIcon className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 max-w-full overflow-hidden">
              {/* Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                We encountered a problem rendering this section. You can retry or copy details for support.
              </p>

              {/* Action buttons in a responsive layout */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  <RefreshIcon className="w-4 h-4" />
                  Retry
                </button>

                <button
                  onClick={this.handleCopy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  <CopyIcon className="w-4 h-4" />
                  {this.state.copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={this.handleDetails}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  <ChevronRightIcon className={`w-4 h-4 transition-transform ${this.state.showDetails ? "rotate-90" : ""}`} />
                  Details
                </button>
              </div>

              {/* Collapsible Error Details */}
              {this.state.showDetails && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md w-full overflow-hidden">
                  <div className="mb-3">
                    <strong className="text-gray-900 text-sm">Error:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">
                      <div className="text-xs font-mono text-red-600 break-all overflow-wrap-anywhere max-w-full">
                        {this.state.error?.toString() || "Unknown error occurred"}
                      </div>
                    </div>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong className="text-gray-900 text-sm">Component Stack:</strong>
                      <div className="mt-1 bg-white rounded border overflow-hidden">
                        <div className="p-2 max-h-32 overflow-y-auto overflow-x-hidden">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all overflow-wrap-anywhere max-w-full">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
