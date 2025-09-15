"use client"

import React from "react"
import { Info, RotateCcw, Copy, ChevronRight } from "lucide-react"

interface ProfessionalBlueErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

interface ProfessionalBlueErrorBoundaryState {
  hasError: boolean
}

export class ProfessionalBlueErrorBoundary extends React.Component<
  ProfessionalBlueErrorBoundaryProps,
  ProfessionalBlueErrorBoundaryState
> {
  constructor(props: ProfessionalBlueErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Professional Blue Error Boundary caught error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  handleCopy = async () => {
    const errorDetails =
      "Component rendering failed - please try refreshing the page or contact support if the issue persists."
    try {
      await navigator.clipboard.writeText(errorDetails)
    } catch (err) {
      console.error("Failed to copy error details:", err)
    }
  }

  handleDetails = () => {
    // Could open a modal or expand details
    console.log("Show error details")
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-4">
            {/* Blue info icon */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                We encountered a problem rendering this section. You can retry or copy details for support.
              </p>

              {/* Action buttons in a row */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>

                <button
                  onClick={this.handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>

                <button
                  onClick={this.handleDetails}
                  className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                >
                  Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
