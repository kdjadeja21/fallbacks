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
}

// Standalone Button component
const StandaloneButton = ({ 
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

// Standalone Collapsible component
const StandaloneCollapsible = ({ 
  children, 
  open, 
  onOpenChange 
}: {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { open, onOpenChange })
        }
        return child
      })}
    </div>
  )
}

const CollapsibleTrigger = ({ 
  children, 
  open, 
  onOpenChange 
}: {
  children: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <div onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  )
}

const CollapsibleContent = ({ 
  children, 
  open 
}: {
  children: React.ReactNode
  open?: boolean
}) => {
  if (!open) return null
  return <div>{children}</div>
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

function ErrorFallback({
  error,
  errorInfo,
  onReset,
}: {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  onReset?: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyErrorDetails = async () => {
    const errorDetails = `Error: ${error?.toString()}\nComponent Stack: ${errorInfo?.componentStack}`
    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy error details:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = errorDetails
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full max-w-none p-3 sm:p-6 border border-red-200 rounded-lg bg-red-50 overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center self-center sm:self-start">
            <AlertCircleIcon className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-900 break-words">Oops! Something went wrong</h2>
            <p className="text-gray-600 mt-1 break-words hyphens-auto">
              We encountered a problem while rendering this component. You can try again or view the error details.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {onReset && (
            <StandaloneButton onClick={onReset} className="w-full sm:w-auto">
              Retry
            </StandaloneButton>
          )}
          <StandaloneButton
            onClick={copyErrorDetails}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <CopyIcon className="h-4 w-4" />
            {copied ? "Copied!" : "Copy details"}
          </StandaloneButton>
        </div>

        <StandaloneCollapsible open={showDetails} onOpenChange={setShowDetails}>
          <CollapsibleTrigger>
            <StandaloneButton 
              variant="ghost" 
              className="flex items-center gap-1 p-2 h-auto w-full sm:w-auto justify-center sm:justify-start"
              onClick={() => setShowDetails(!showDetails)}
            >
              <ChevronRightIcon className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
              Show details
            </StandaloneButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-3 bg-gray-100 rounded text-sm font-mono text-gray-700 w-full min-w-0">
              <div className="mb-2">
                <strong>Error:</strong> 
                <div className="mt-1 break-all hyphens-auto overflow-wrap-anywhere text-red-600">{error?.toString()}</div>
              </div>
              {errorInfo?.componentStack && (
                <div className="min-w-0">
                  <strong>Component Stack:</strong>
                  <div className="mt-1 text-xs bg-white p-2 rounded border max-h-32 overflow-y-auto min-w-0">
                    <pre className="whitespace-pre-wrap break-all hyphens-auto overflow-wrap-anywhere text-gray-700 font-mono">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </StandaloneCollapsible>
      </div>
    </div>
  )
}

export class CollapsibleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={() => {
            this.setState({ hasError: false, error: null, errorInfo: null })
            this.props.onReset?.()
          }}
        />
      )
    }

    return this.props.children
  }
}
