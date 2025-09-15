"use client"

import React from "react"
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../../lib/types"

export abstract class BaseErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.logError(error, errorInfo)
  }

  protected logError(error: Error, errorInfo: React.ErrorInfo) {
    // Centralized error logging
    console.error('Error Boundary:', error, errorInfo)
    
    // In production, you would send this to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { errorInfo } })
    }
  }

  protected resetError = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  abstract renderError(): React.ReactNode
  
  render() {
    if (this.state.hasError) {
      return this.renderError()
    }
    return this.props.children
  }
}
