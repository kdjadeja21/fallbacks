"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

// Standalone Button component for dark mode
const DarkModeButton = ({ 
  children, 
  onClick, 
  className = "" 
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) => (
  <button 
    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-red-800 hover:bg-red-700 text-red-100 focus:ring-red-500 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

// Standalone SVG Icons
const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export class DarkModeErrorBoundary extends React.Component<Props, State> {
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
        <div className="p-4 sm:p-6 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center self-center sm:self-start">
              <AlertCircleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-red-400">Error Detected</h2>
              <p className="text-gray-300 mt-1">
                Component failed to render properly. You can reset the component to try again.
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                <DarkModeButton
                  onClick={() => {
                    this.setState({ hasError: false })
                    this.props.onReset?.()
                  }}
                  className="w-full sm:w-auto"
                >
                  <RefreshIcon className="h-4 w-4 mr-2" />
                  Reset Component
                </DarkModeButton>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
