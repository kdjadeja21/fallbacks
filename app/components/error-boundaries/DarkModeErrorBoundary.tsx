"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

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
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-400">Error Detected</h2>
              <p className="text-gray-300 mt-1">
                Component failed to render properly. You can reset the component to try again.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false })
                    this.props.onReset?.()
                  }}
                  className="bg-red-800 hover:bg-red-700 text-red-100"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Component
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
