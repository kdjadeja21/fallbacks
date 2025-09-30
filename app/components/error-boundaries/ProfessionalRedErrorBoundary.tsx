"use client"

import React from "react"

interface ProfessionalRedErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

interface ProfessionalRedErrorBoundaryState {
  hasError: boolean
  showDetails: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: boolean
}

// Standalone SVG Icons
const AlertTriangleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

export class ProfessionalRedErrorBoundary extends React.Component<
  ProfessionalRedErrorBoundaryProps,
  ProfessionalRedErrorBoundaryState
> {
  constructor(props: ProfessionalRedErrorBoundaryProps) {
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
    console.error("Professional Red Error Boundary caught error:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, showDetails: false, error: null, errorInfo: null, copied: false })
    this.props.onReset?.()
  }

  handleCopyDetails = async () => {
    const { error, errorInfo } = this.state
    const errorDetails = error 
      ? `Error: ${error.toString()}\nComponent Stack: ${errorInfo?.componentStack || 'N/A'}`
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

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-full overflow-hidden p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Red warning icon */}
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 self-center sm:self-start">
              <AlertTriangleIcon className="w-6 h-6 text-red-600" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 max-w-full overflow-hidden">
              {/* Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                An unexpected error occurred while rendering this section. You can try again or reveal technical details
                below.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                <button
                  onClick={this.handleRetry}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  <AlertTriangleIcon className="w-4 h-4" />
                  Retry
                </button>

                <button
                  onClick={this.handleCopyDetails}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  <CopyIcon className="w-4 h-4" />
                  {this.state.copied ? "Copied!" : "Copy details"}
                </button>
              </div>

              {/* Collapsible details section */}
              <button
                onClick={this.toggleDetails}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-3 w-full sm:w-auto justify-center sm:justify-start"
              >
                <ChevronRightIcon className={`w-4 h-4 transition-transform ${this.state.showDetails ? "rotate-90" : ""}`} />
                Show details
              </button>

              {/* Error details */}
              {this.state.showDetails && (
                <div className="mt-3 w-full overflow-hidden">
                  <div className="p-3 bg-gray-100 rounded-md overflow-hidden">
                    <div className="mb-3">
                      <strong className="text-gray-900 text-sm">Error:</strong>
                      <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded overflow-hidden">
                        <div className="text-xs font-mono text-red-600 break-all overflow-wrap-anywhere max-w-full">
                          {this.state.error?.toString() || "Unknown error occurred"}
                        </div>
                      </div>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong className="text-gray-900 text-sm">Component Stack:</strong>
                        <div className="mt-1 bg-red-50 border border-red-200 rounded overflow-hidden">
                          <div className="p-2 max-h-32 overflow-y-auto overflow-x-hidden">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all overflow-wrap-anywhere max-w-full">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Support text */}
              <p className="text-xs text-gray-500 mt-4">
                If the problem persists, please contact support with the copied error details.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
