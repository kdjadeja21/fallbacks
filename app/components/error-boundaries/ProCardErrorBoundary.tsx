"use client"

import React from "react"

export interface BoundaryRenderProps {
  error: Error | null
  info: React.ErrorInfo | null
  showDetails: boolean
  copied: boolean
  toggleDetails: () => void
  copyDetails: () => void
  reset: () => void
  title: string
}

export interface BaseBoundaryProps {
  children: React.ReactNode
  title?: string
  onReset?: () => void
  renderFallback?: (props: BoundaryRenderProps) => React.ReactNode
}

interface BaseBoundaryState {
  hasError: boolean
  error: Error | null
  info: React.ErrorInfo | null
  showDetails: boolean
  copied: boolean
}

// Standalone button component
const ProButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary" | "ghost"
  className?: string
}) => {
  let baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  if (variant === "secondary") {
    baseClasses += " bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
  } else if (variant === "ghost") {
    baseClasses += " text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
  } else {
    baseClasses += " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
  }
  
  return (
    <button className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

// Standalone SVG Icons
const AlertCircleIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RefreshIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const CopyIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const ChevronDownIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export class BaseBoundary extends React.Component<BaseBoundaryProps, BaseBoundaryState> {
  state: BaseBoundaryState = {
    hasError: false,
    error: null,
    info: null,
    showDetails: false,
    copied: false,
  }

  static getDerivedStateFromError(error: Error): Partial<BaseBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info })
  }

  private reset = () => {
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  private toggleDetails = () => this.setState((s) => ({ showDetails: !s.showDetails }))

  private copyDetails = async () => {
    const { error, info } = this.state
    const details = `Error: ${error?.toString() ?? "Unknown"}\n\nComponent Stack:${info?.componentStack ?? " N/A"}`
    try {
      await navigator.clipboard.writeText(details)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 1500)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = details
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 1500)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.renderFallback) {
      return this.props.renderFallback({
        error: this.state.error,
        info: this.state.info,
        showDetails: this.state.showDetails,
        copied: this.state.copied,
        toggleDetails: this.toggleDetails,
        copyDetails: this.copyDetails,
        reset: this.reset,
        title: this.props.title ?? "Something went wrong",
      })
    }

    // Default fallback UI
    const { error, info, showDetails, copied } = this.state
    const title = this.props.title ?? "Something went wrong"

    return (
      <div className="w-full flex justify-center p-4" role="alert" aria-live="polite">
        <div className="w-full max-w-4xl rounded-2xl bg-white border border-gray-200 shadow-lg p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
            <div className="inline-flex w-10 h-10 rounded-lg items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0 self-center sm:self-start">
              <AlertCircleIcon size={18} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="margin-0 font-extrabold text-slate-900 text-lg leading-tight">
                {title}
              </h3>
              <p className="mt-1.5 text-slate-600 text-sm">
                We encountered a problem rendering this section. You can retry or copy details for support.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-4">
            <ProButton onClick={this.reset} className="w-full sm:w-auto">
              <RefreshIcon className="mr-2" />
              Retry
            </ProButton>
            <ProButton 
              onClick={this.copyDetails} 
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <CopyIcon className="mr-2" />
              {copied ? "Copied!" : "Copy Details"}
            </ProButton>
            <ProButton 
              onClick={this.toggleDetails} 
              variant="ghost"
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              <ChevronDownIcon className={`mr-2 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              {showDetails ? "Hide" : "Show"} Details
            </ProButton>
          </div>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm w-full">
              <div className="mb-3">
                <strong className="text-gray-900">Error:</strong>
                <div className="mt-1 font-mono text-red-600 break-words overflow-wrap-anywhere text-xs sm:text-sm">{error?.toString()}</div>
              </div>
              {info?.componentStack && (
                <div>
                  <strong className="text-gray-900">Component Stack:</strong>
                  <div className="mt-1 text-xs text-gray-700 bg-white p-2 rounded border max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {info.componentStack}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default function ProCardErrorBoundary(props: Omit<BaseBoundaryProps, "renderFallback">) {
  return <BaseBoundary {...props} />
}

export { ProCardErrorBoundary }
