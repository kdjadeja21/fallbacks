"use client"

import React from "react"

interface QuickRecoveryErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  maxRetries?: number
  retryDelay?: number
}

interface QuickRecoveryErrorBoundaryState {
  hasError: boolean
  error: Error | null
  retryCount: number
  isRetrying: boolean
  autoRetryEnabled: boolean
}

// Recovery-focused icons
const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 118.944-10.328A5.978 5.978 0 0120 14v.172a3.001 3.001 0 01-2 2.828V20a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1.172a3.001 3.001 0 01-2-2.828V14z" />
  </svg>
)

export class QuickRecoveryErrorBoundary extends React.Component<
  QuickRecoveryErrorBoundaryProps,
  QuickRecoveryErrorBoundaryState
> {
  private retryTimer: NodeJS.Timeout | null = null

  constructor(props: QuickRecoveryErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      autoRetryEnabled: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<QuickRecoveryErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("QuickRecoveryErrorBoundary caught an error:", error, errorInfo)
    
    // Start auto-recovery if enabled and within retry limits
    const maxRetries = this.props.maxRetries || 2
    if (this.state.autoRetryEnabled && this.state.retryCount < maxRetries) {
      this.startAutoRetry()
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }
  }

  startAutoRetry = () => {
    const delay = this.props.retryDelay || 2000
    this.setState({ isRetrying: false })
    
    this.retryTimer = setTimeout(() => {
      this.performRetry()
    }, delay)
  }

  performRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      isRetrying: false,
      retryCount: prev.retryCount + 1,
    }))
    
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    
    this.props.onReset?.()
  }

  handleManualRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    this.performRetry()
  }

  toggleAutoRetry = () => {
    this.setState(prev => ({
      autoRetryEnabled: !prev.autoRetryEnabled
    }))
  }

  resetRetryCount = () => {
    this.setState({ retryCount: 0 })
  }

  render() {
    if (this.state.hasError) {
      const { maxRetries = 2 } = this.props
      const { error, retryCount, isRetrying, autoRetryEnabled } = this.state
      const canRetry = retryCount < maxRetries

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
              {/* Status Icon */}
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isRetrying 
                  ? "bg-blue-100 animate-spin" 
                  : canRetry 
                    ? "bg-orange-100" 
                    : "bg-red-100"
              }`}>
                {isRetrying ? (
                  <RefreshIcon className="w-6 h-6 text-blue-600" />
                ) : canRetry ? (
                  <PlayIcon className="w-6 h-6 text-orange-600" />
                ) : (
                  <ShieldIcon className="w-6 h-6 text-red-600" />
                )}
              </div>

              {/* Status Message */}
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isRetrying ? "Recovering..." : "Component Error"}
              </h2>
              
              <p className="text-gray-600 mb-4 text-sm">
                {isRetrying 
                  ? "Attempting to recover the component automatically"
                  : error?.message || "Something went wrong"
                }
              </p>

              {/* Retry Stats */}
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recovery Attempts:</span>
                  <span className={`font-medium ${
                    retryCount >= maxRetries ? "text-red-600" : "text-gray-900"
                  }`}>
                    {retryCount} / {maxRetries}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Auto Recovery:</span>
                  <span className={`font-medium ${
                    autoRetryEnabled ? "text-green-600" : "text-gray-600"
                  }`}>
                    {autoRetryEnabled ? "On" : "Off"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!isRetrying && canRetry && (
                  <button
                    onClick={this.handleManualRetry}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <RefreshIcon className="w-4 h-4" />
                    Try Again Now
                  </button>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={this.toggleAutoRetry}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      autoRetryEnabled
                        ? "bg-green-100 hover:bg-green-200 text-green-800 focus:ring-green-500"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500"
                    }`}
                  >
                    Auto Recovery {autoRetryEnabled ? "ON" : "OFF"}
                  </button>
                  
                  {retryCount > 0 && (
                    <button
                      onClick={this.resetRetryCount}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Reset Counter
                    </button>
                  )}
                </div>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 mt-4">
                {canRetry 
                  ? isRetrying 
                    ? "Please wait while we attempt recovery..."
                    : "Component will auto-recover or try manually"
                  : "Maximum recovery attempts reached. Please refresh the page."
                }
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}