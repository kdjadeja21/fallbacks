"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  isRetrying: boolean
  copied: boolean
  showDetails: boolean
}

// Simple Icons
const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export class GracefulFallbackErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      copied: false,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    console.error('Application error:', error)
  }

  handleRetry = () => {
    this.setState({ isRetrying: true })
    
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        showDetails: false
      })
      this.props.onReset?.()
    }, 600)
  }

  copyErrorDetails = async () => {
    const { error, errorInfo } = this.state
    // Create comprehensive error logs
    const errorLogs = `=== ERROR LOGS ===
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

=== ERROR DETAILS ===
Type: ${error?.constructor.name || 'Unknown'}
Message: ${error?.message || 'No error message'}

=== STACK TRACE ===
${error?.stack || 'Stack trace not available'}

=== COMPONENT STACK ===
${errorInfo?.componentStack || 'Component stack not available'}

=== END OF LOGS ===`
    
    try {
      await navigator.clipboard.writeText(errorLogs)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = errorLogs
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
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
        <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border border-purple-200 rounded-2xl shadow-lg">
          <div className="text-center max-w-md mx-auto">
            {/* Elegant Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircleIcon className="h-8 w-8 text-white" />
            </div>
            
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Oops! Something went wrong
            </h2>
            
            {/* Subheading */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected issue. Don't worry, you can try again or get help.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshIcon className={`h-5 w-5 ${this.state.isRetrying ? "animate-spin" : ""}`} />
                  {this.state.isRetrying ? "Retrying..." : "Try Again"}
                </div>
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={this.copyErrorDetails}
                  className="flex-1 py-2.5 px-4 border-2 border-purple-300 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CopyIcon className="h-4 w-4" />
                    {this.state.copied ? "Copied!" : "Copy Details"}
                  </div>
                </button>
                
                <button
                  onClick={this.toggleDetails}
                  className="flex-1 py-2.5 px-4 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${this.state.showDetails ? "rotate-180" : ""}`} />
                    Details
                  </div>
                </button>
              </div>
            </div>
            
            {/* Simple Details */}
            {this.state.showDetails && (
              <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 text-left">
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-700">Error Message:</strong>
                    <div className="mt-1 font-mono text-xs text-red-600 bg-red-50 p-3 rounded border">
                      {this.state.error?.message || 'No error message available'}
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Stack Trace:</strong>
                    <div className="mt-1 font-mono text-xs text-gray-700 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-all">
                        {this.state.error?.stack || 'Stack trace not available'}
                      </pre>
                    </div>
                  </div>
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong className="text-gray-700">Component Stack:</strong>
                      <div className="mt-1 font-mono text-xs text-gray-700 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap break-all">
                          {this.state.errorInfo.componentStack.trim()}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>Timestamp: {new Date().toLocaleString()}</span>
                    <span>Session: {Date.now().toString(36).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}