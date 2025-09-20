"use client"

import React, { useState } from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
  copied: boolean
}

// Standalone Button component
const MinimalButton = ({ 
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
    variantClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
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
const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function ErrorDetailsCollapsible({ error }: { error?: Error }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <MinimalButton
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 h-auto w-full sm:w-auto justify-center sm:justify-start"
      >
        <ChevronRightIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        Details
      </MinimalButton>
      
      {isOpen && (
        <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono text-gray-700 w-full min-w-0">
          <div className="break-all hyphens-auto overflow-wrap-anywhere">
            <strong>Error:</strong> {error?.message || "Unknown error"}
          </div>
          {error?.stack && (
            <div className="mt-2 min-w-0">
              <strong>Stack:</strong>
              <div className="mt-1 text-xs bg-white p-2 rounded border max-h-32 overflow-y-auto min-w-0">
                <pre className="whitespace-pre-wrap break-all hyphens-auto overflow-wrap-anywhere text-gray-700 font-mono">{error.stack}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export class MinimalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, copied: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, copied: false }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  copyErrorDetails = async () => {
    const errorDetails = `Error: ${this.state.error?.message || "Unknown error"}\nStack: ${this.state.error?.stack || "No stack trace"}`
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
        <div className="w-full max-w-none p-3 sm:p-6 border border-blue-200 rounded-lg bg-blue-50 overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center self-center sm:self-start">
                <AlertCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-900 break-words">Something went wrong</h2>
                <p className="text-gray-600 mt-1 break-words hyphens-auto">
                  We encountered a problem rendering this section. You can retry or copy details for support.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <MinimalButton
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, copied: false })
                  this.props.onReset?.()
                }}
                className="w-full sm:w-auto"
              >
                Retry
              </MinimalButton>
              <MinimalButton
                onClick={this.copyErrorDetails}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <CopyIcon className="h-4 w-4" />
                {this.state.copied ? "Copied!" : "Copy"}
              </MinimalButton>
            </div>
            
            <ErrorDetailsCollapsible error={this.state.error} />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
