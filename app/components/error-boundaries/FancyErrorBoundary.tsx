"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

// Standalone Button component
const FancyButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "outline"
  className?: string
}) => {
  const baseClasses = "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
  const variantClasses = variant === "outline" 
    ? "border border-orange-300 text-orange-700 bg-white hover:bg-orange-50 focus:ring-orange-500"
    : "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500"
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Standalone SVG Icons
const AlertTriangleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const RotateIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
)

export class FancyErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 sm:p-6 border border-orange-200 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center self-center sm:self-start">
              <AlertTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">Unexpected Error</h2>
              <p className="text-gray-600 mt-1">
                We encountered an issue while loading this component. Please try refreshing or contact support if the
                problem continues.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-6">
                {this.props.onReset && (
                  <FancyButton
                    onClick={() => {
                      this.setState({ hasError: false })
                      this.props.onReset?.()
                    }}
                    className="w-full sm:w-auto"
                  >
                    <RefreshIcon className="h-4 w-4 mr-2" />
                    Try Again
                  </FancyButton>
                )}
                <FancyButton
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <RotateIcon className="h-4 w-4 mr-2" />
                  Reload Page
                </FancyButton>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
