"use client"

import React from "react"
import { AlertTriangle, Copy, ChevronRight } from "lucide-react"

interface ProfessionalRedErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

interface ProfessionalRedErrorBoundaryState {
  hasError: boolean
  showDetails: boolean
  errorDetails: string
}

export class ProfessionalRedErrorBoundary extends React.Component<
  ProfessionalRedErrorBoundaryProps,
  ProfessionalRedErrorBoundaryState
> {
  constructor(props: ProfessionalRedErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      showDetails: false,
      errorDetails:
        "TypeError: Cannot read property 'map' of undefined\n    at Component.render (Component.jsx:15:23)\n    at ReactDOMComponent.render",
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Professional Red Error Boundary caught error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, showDetails: false })
    this.props.onReset?.()
  }

  handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorDetails)
    } catch (err) {
      console.error("Failed to copy error details:", err)
    }
  }

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-4">
            {/* Red warning icon */}
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                An unexpected error occurred while rendering this section. You can try again or reveal technical details
                below.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Retry
                </button>

                <button
                  onClick={this.handleCopyDetails}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy details
                </button>
              </div>

              {/* Collapsible details section */}
              <button
                onClick={this.toggleDetails}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${this.state.showDetails ? "rotate-90" : ""}`} />
                Show details
              </button>

              {/* Error details */}
              {this.state.showDetails && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{this.state.errorDetails}</pre>
                </div>
              )}

              {/* Support text */}
              <p className="text-xs text-gray-500 mt-4">
                If the problem persists, please contact support with the copied error details.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
