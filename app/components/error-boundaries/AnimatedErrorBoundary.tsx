"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  isVisible: boolean
}

export class AnimatedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, isVisible: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    setTimeout(() => this.setState({ isVisible: true }), 100)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`p-6 border border-red-200 rounded-lg bg-red-50 transition-all duration-500 ${
            this.state.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="animate-bounce w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Oops! Something broke</h2>
              <p className="text-gray-600 mt-1">
                Don't worry, we're on it! You can try refreshing the component or reload the entire page.
              </p>

              <div className="flex items-center gap-3 mt-4">
                {this.props.onReset && (
                  <Button
                    onClick={() => {
                      this.setState({ hasError: false, isVisible: false })
                      this.props.onReset?.()
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reload
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
