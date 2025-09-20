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
const StandaloneButton = ({ 
  children, 
  onClick, 
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) => (
  <button 
    className={`inline-flex items-center justify-center px-2 py-1 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-red-600 hover:text-red-700 hover:bg-red-100 focus:ring-red-500 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

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

export class CompactErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3 flex-1">
              <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900">Error loading component</span>
            </div>
            <StandaloneButton
              onClick={() => {
                this.setState({ hasError: false })
                this.props.onReset?.()
              }}
              className="self-end sm:self-auto"
            >
              <RefreshIcon className="h-4 w-4 mr-1" />
              Retry
            </StandaloneButton>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
