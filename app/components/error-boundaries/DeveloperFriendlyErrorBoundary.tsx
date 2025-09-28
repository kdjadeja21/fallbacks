"use client"

import React from "react"

interface DeveloperFriendlyErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  showStackTrace?: boolean
}

interface DeveloperFriendlyErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  showDetails: boolean
  copied: boolean
}

// Developer-focused icons
const BugIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8m0 0V6a2 2 0 012-2h6a2 2 0 012 2v2M9 12h6m-6 4h6" />
  </svg>
)

const CodeBranchIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const CopyIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

export class DeveloperFriendlyErrorBoundary extends React.Component<
  DeveloperFriendlyErrorBoundaryProps,
  DeveloperFriendlyErrorBoundaryState
> {
  constructor(props: DeveloperFriendlyErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<DeveloperFriendlyErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    
    // Developer-friendly console logging
    console.group("🚨 React Error Boundary")
    console.error("Error:", error)
    console.error("Component Stack:", errorInfo.componentStack)
    console.error("Error Stack:", error.stack)
    console.groupEnd()
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, copied: false })
    this.props.onReset?.()
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  copyErrorInfo = async () => {
    const { error, errorInfo } = this.state
    const errorText = `Error: ${error?.name}: ${error?.message}\n\nStack Trace:\n${error?.stack}\n\nComponent Stack:${errorInfo?.componentStack || ""}`
    try {
      await navigator.clipboard.writeText(errorText)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch (err) {
      console.error("Failed to copy error details:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = errorText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    }
  }

  render() {
    if (this.state.hasError) {
      const { showStackTrace = true } = this.props
      const { error, errorInfo, showDetails } = this.state

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4 bg-slate-50">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <BugIcon className="w-6 h-6 text-white" />
                  <div>
                    <h1 className="text-xl font-bold text-white">Component Error</h1>
                    <p className="text-red-100 text-sm">Something went wrong during rendering</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Error Summary */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 mb-1">
                        {error?.name || "Error"}
                      </h3>
                      <p className="text-sm text-red-700">
                        {error?.message || "An unknown error occurred"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={this.handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                  
                  <button
                    onClick={this.copyErrorInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <CopyIcon className="w-4 h-4" />
                    {this.state.copied ? "Copied!" : "Copy Error"}
                  </button>
                  
                  {showStackTrace && (
                    <button
                      onClick={this.toggleDetails}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      {showDetails ? "Hide" : "Show"} Details
                    </button>
                  )}
                </div>

                {showDetails && showStackTrace && (
                  <div className="space-y-4">
                    {error?.stack && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <CodeBranchIcon className="w-4 h-4" />
                          Stack Trace
                        </h4>
                        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      </div>
                    )}

                    {errorInfo?.componentStack && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Component Stack
                        </h4>
                        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                          <pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
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