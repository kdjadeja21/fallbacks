"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Copy, ChevronRight, RefreshCw } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class DetailedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    console.error("Detailed error:", { error, errorInfo })
  }

  copyErrorDetails = () => {
    const errorDetails = `Error: ${this.state.error?.toString()}\nComponent Stack: ${this.state.errorInfo?.componentStack}`
    navigator.clipboard.writeText(errorDetails)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
              <p className="text-gray-600 mt-1">
                An unexpected error occurred while rendering this section. You can try again or reveal technical details
                below.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null })
                    this.props.onReset?.()
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  onClick={this.copyErrorDetails}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Copy className="h-4 w-4" />
                  Copy details
                </Button>
              </div>

              <ErrorDetailsCollapsible error={this.state.error} errorInfo={this.state.errorInfo} />

              <p className="text-sm text-gray-500 mt-4">
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

function ErrorDetailsCollapsible({ error, errorInfo }: { error: Error | null; errorInfo: React.ErrorInfo | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 p-0 h-auto">
          <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          Show details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="p-4 bg-gray-100 rounded-lg text-sm">
          <div className="mb-3">
            <strong className="text-gray-900">Error:</strong>
            <div className="mt-1 font-mono text-red-600">{error?.toString()}</div>
          </div>
          {errorInfo?.componentStack && (
            <div>
              <strong className="text-gray-900">Component Stack:</strong>
              <pre className="mt-1 text-xs text-gray-700 overflow-auto bg-white p-2 rounded border">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
