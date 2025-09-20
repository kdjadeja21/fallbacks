"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  isVisible: boolean
}

// Standalone Button component - no external dependencies
const StandaloneButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  size = "sm",
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "outline"
  size?: "sm" | "md"
  className?: string
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const sizeClasses = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2"
  const variantClasses = variant === "outline" 
    ? "border border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500"
    : "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500"
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// SVG Icons as standalone components
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

export class AnimatedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, isVisible: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    setTimeout(() => this.setState({ isVisible: true }), 100)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`p-4 sm:p-6 border border-red-200 rounded-lg bg-red-50 transition-all duration-500 ${
            this.state.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="animate-bounce w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-start">
              <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-gray-900">Oops! Something broke</h2>
              <p className="text-gray-600 mt-1">
                Don't worry, we're on it! You can try refreshing the component or reload the entire page.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-4">
                {this.props.onReset && (
                  <StandaloneButton
                    onClick={() => {
                      this.setState({ hasError: false, isVisible: false })
                      this.props.onReset?.()
                    }}
                    className="w-full sm:w-auto"
                  >
                    <RefreshIcon className="h-4 w-4 mr-2" />
                    Try Again
                  </StandaloneButton>
                )}
                <StandaloneButton
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <RotateIcon className="h-4 w-4 mr-2" />
                  Reload
                </StandaloneButton>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
