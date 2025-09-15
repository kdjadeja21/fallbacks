"use client"

import React from "react"
import { AlertCircle } from "lucide-react"

export interface BoundaryRenderProps {
  error: Error | null
  info: React.ErrorInfo | null
  showDetails: boolean
  copied: boolean
  toggleDetails: () => void
  copyDetails: () => void
  reset: () => void
  title: string
}

export interface BaseBoundaryProps {
  children: React.ReactNode
  title?: string
  onReset?: () => void
  renderFallback: (props: BoundaryRenderProps) => React.ReactNode
}

interface BaseBoundaryState {
  hasError: boolean
  error: Error | null
  info: React.ErrorInfo | null
  showDetails: boolean
  copied: boolean
}

export class BaseBoundary extends React.Component<BaseBoundaryProps, BaseBoundaryState> {
  state: BaseBoundaryState = {
    hasError: false,
    error: null,
    info: null,
    showDetails: false,
    copied: false,
  }

  static getDerivedStateFromError(error: Error): Partial<BaseBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info })
  }

  private reset = () => {
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  private toggleDetails = () => this.setState((s) => ({ showDetails: !s.showDetails }))

  private copyDetails = async () => {
    const { error, info } = this.state
    const details = `Error: ${error?.toString() ?? "Unknown"}\n\nComponent Stack:${info?.componentStack ?? " N/A"}`
    try {
      await navigator.clipboard.writeText(details)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 1500)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = details
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 1500)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return this.props.renderFallback({
      error: this.state.error,
      info: this.state.info,
      showDetails: this.state.showDetails,
      copied: this.state.copied,
      toggleDetails: this.toggleDetails,
      copyDetails: this.copyDetails,
      reset: this.reset,
      title: this.props.title ?? "Something went wrong",
    })
  }
}

export default function ProCardErrorBoundary(props: Omit<BaseBoundaryProps, "renderFallback">) {
  return (
    <BaseBoundary
      {...props}
      renderFallback={({ title, error, info, showDetails, copied, toggleDetails, copyDetails, reset }) => {
        const wrap: React.CSSProperties = {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: 16,
        }

        const card: React.CSSProperties = {
          width: "100%",
          maxWidth: 900,
          borderRadius: 16,
          background: "#ffffff",
          border: "1px solid rgba(2,6,23,0.08)",
          boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
          padding: 20,
        }

        return (
          <div style={wrap} role="alert" aria-live="polite">
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    display: "inline-flex",
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(59,130,246,0.12)",
                    color: "#1d4ed8",
                    border: "1px solid rgba(29,78,216,0.15)",
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontWeight: 800, color: "#0f172a", fontSize: 18, lineHeight: 1.2 }}>
                    {title}
                  </h3>
                  <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 14 }}>
                    We encountered a problem rendering this section. You can retry or copy details for support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

export { ProCardErrorBoundary }
