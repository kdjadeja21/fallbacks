"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Copy, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class MinimalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  copyErrorDetails = () => {
    const errorDetails = `Error: ${this.state.error?.message || "Unknown error"}\nStack: ${this.state.error?.stack || "No stack trace"}`
    navigator.clipboard.writeText(errorDetails)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
              <p className="text-gray-600 mt-1">
                We encountered a problem rendering this section. You can retry or copy details for support.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined })
                    this.props.onReset?.()
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  size="sm"
                >
                  Retry
                </Button>
                <Button
                  onClick={this.copyErrorDetails}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <ErrorDetailsCollapsible error={this.state.error} />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function ErrorDetailsCollapsible({ error }: { error?: Error }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
          <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          Details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div className="p-3 bg-gray-100 rounded text-sm font-mono text-gray-700">
          <div>
            <strong>Error:</strong> {error?.message || "Unknown error"}
          </div>
          {error?.stack && (
            <div className="mt-2">
              <strong>Stack:</strong>
              <pre className="mt-1 text-xs overflow-auto">{error.stack}</pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
