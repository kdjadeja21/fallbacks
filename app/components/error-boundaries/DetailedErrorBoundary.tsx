"use client"

import React, { useState } from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: boolean
}

// Standalone Button component
const DetailedButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  size = "sm",
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md"
  className?: string
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const sizeClasses = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2"
  
  let variantClasses = ""
  if (variant === "outline") {
    variantClasses = "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
  } else if (variant === "ghost") {
    variantClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 p-0 h-auto"
  } else {
    variantClasses = "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500"
  }
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
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

const CopyIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

function ErrorDetailsCollapsible({ error, errorInfo }: { error: Error | null; errorInfo: React.ErrorInfo | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <DetailedButton
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 h-auto w-full sm:w-auto justify-center sm:justify-start"
      >
        <ChevronRightIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        Show details
      </DetailedButton>
      
      {isOpen && (
        <div className="mt-2 p-3 sm:p-4 bg-gray-100 rounded-lg text-sm w-full min-w-0">
          <div className="mb-3">
            <strong className="text-gray-900">Error:</strong>
            <div className="mt-1 font-mono text-red-600 break-all hyphens-auto text-xs sm:text-sm">{error?.toString()}</div>
          </div>
          {errorInfo?.componentStack && (
            <div className="min-w-0">
              <strong className="text-gray-900">Component Stack:</strong>
              <div className="mt-1 text-xs text-gray-700 bg-white p-2 rounded border max-h-32 overflow-y-auto min-w-0">
                <pre className="whitespace-pre-wrap break-all hyphens-auto overflow-wrap-anywhere font-mono">
                  {errorInfo.componentStack}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export class DetailedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, copied: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    console.error("Detailed error:", { error, errorInfo })
  }

  copyErrorDetails = async () => {
    const errorDetails = `Error: ${this.state.error?.toString()}\nComponent Stack: ${this.state.errorInfo?.componentStack}`
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-none p-3 sm:p-6 border border-red-200 rounded-lg bg-red-50 overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center self-center sm:self-start">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-900 break-words">Something went wrong</h2>
                <p className="text-gray-600 mt-1 break-words hyphens-auto">
                  An unexpected error occurred while rendering this section. You can try again or reveal technical details
                  below.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <DetailedButton
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null, copied: false })
                  this.props.onReset?.()
                }}
                className="w-full sm:w-auto"
              >
                <RefreshIcon className="h-4 w-4 mr-2" />
                Retry
              </DetailedButton>
              <DetailedButton
                onClick={this.copyErrorDetails}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <CopyIcon className="h-4 w-4" />
                {this.state.copied ? "Copied!" : "Copy details"}
              </DetailedButton>
            </div>

            <ErrorDetailsCollapsible error={this.state.error} errorInfo={this.state.errorInfo} />

            <p className="text-sm text-gray-500 break-words">
              If the problem persists, please contact support with the copied error details.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
