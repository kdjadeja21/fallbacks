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
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

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

  const copyErrorDetails = () => {
    const errorDetails = `Error: ${error?.toString()}\nComponent Stack: ${errorInfo?.componentStack}`
    navigator.clipboard.writeText(errorDetails)
  }

  return (
    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h2>
          <p className="text-gray-600 mt-1">
            We encountered a problem while rendering this component. You can try again or view the error details.
          </p>

          <div className="flex items-center gap-2 mt-4">
            {onReset && (
              <Button onClick={onReset} className="bg-gray-900 hover:bg-gray-800 text-white" size="sm">
                Retry
              </Button>
            )}
            <Button
              onClick={copyErrorDetails}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              Copy details
            </Button>
          </div>

          <Collapsible open={showDetails} onOpenChange={setShowDetails} className="mt-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 p-0 h-auto">
                <ChevronRight className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
                Show details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="p-3 bg-gray-100 rounded text-sm font-mono text-gray-700">
                <div className="mb-2">
                  <strong>Error:</strong> {error?.toString()}
                </div>
                {errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs overflow-auto max-h-32 bg-white p-2 rounded border">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
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
