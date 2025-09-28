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
  retryCount: number
  isRetrying: boolean
  copied: boolean
  showDetails: boolean
}

// Modern Icons
const ZapIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const ClipboardIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export class SmartRecoveryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
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
    console.error("SmartRecoveryErrorBoundary caught error:", { error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ isRetrying: true })
    
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1,
        isRetrying: false,
        showDetails: false
      })
      this.props.onReset?.()
    }, 800)
  }

  copyErrorDetails = async () => {
    const { error, errorInfo } = this.state
    // Create comprehensive error logs
    const errorLogs = `=== SMART RECOVERY ERROR LOGS ===
Timestamp: ${new Date().toISOString()}
Retry Count: ${this.state.retryCount}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

=== ERROR INFORMATION ===
Type: ${error?.constructor.name || 'Unknown'}
Message: ${error?.message || 'No error message'}

=== JAVASCRIPT STACK TRACE ===
${error?.stack || 'Stack trace not available'}

=== REACT COMPONENT STACK ===
${errorInfo?.componentStack || 'Component stack not available'}

=== RECOVERY ATTEMPTS ===
Total Retries: ${this.state.retryCount}
Last Attempt: ${new Date().toISOString()}

=== END OF LOGS ===`
    
    try {
      await navigator.clipboard.writeText(errorLogs)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch (err) {
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
        <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl shadow-sm">
          <div className="flex items-start gap-5">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <ZapIcon className="h-6 w-6 text-amber-600" />
              </div>
              {this.state.retryCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {this.state.retryCount}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {/* Heading */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Component Error
              </h3>
              
              {/* Subheading */}
              <p className="text-gray-700 mb-6">
                Something unexpected happened. Let's get this fixed quickly.
              </p>
              
              {/* Action Buttons - Horizontal Layout */}
              <div className="flex items-center gap-3">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-all duration-200 shadow-sm"
                >
                  <RefreshIcon className={`h-4 w-4 ${this.state.isRetrying ? "animate-spin" : ""}`} />
                  {this.state.isRetrying ? "Retrying..." : "Retry"}
                </button>
                
                <button
                  onClick={this.copyErrorDetails}
                  className="flex items-center gap-2 px-4 py-2.5 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  {this.state.copied ? "Copied!" : "Copy"}
                </button>
                
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronRightIcon className={`h-4 w-4 transition-transform ${this.state.showDetails ? "rotate-90" : ""}`} />
                  <span className="text-sm">Details</span>
                </button>
              </div>
              
              {/* Collapsible Details */}
              {this.state.showDetails && (
                <div className="mt-4 p-4 bg-white border border-amber-200 rounded-lg">
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Error Type:</span>
                      <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700 font-mono text-xs">
                        {this.state.error?.constructor.name || 'UnknownError'}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Error Message:</span>
                      <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700 font-mono text-xs">
                        {this.state.error?.message || 'No error message provided'}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Stack Trace:</span>
                      <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap break-all text-gray-700">
                          {this.state.error?.stack || 'Stack trace not available'}
                        </pre>
                      </div>
                    </div>
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <span className="font-medium text-gray-700">Component Stack:</span>
                        <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap break-all text-gray-700">
                            {this.state.errorInfo.componentStack.trim()}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-amber-200">
                      <span>Retries: {this.state.retryCount}</span>
                      <span>Time: {new Date().toLocaleString()}</span>
                    </div>
                  </div>
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