"use client"

import React, { useState } from "react"

interface Props {
  children: React.ReactNode
  onReset?: () => void
  environment?: 'development' | 'production'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: string | null
  retryAttempts: number
  isRetrying: boolean
  showDebugPanel: boolean
}

// Developer-focused Icons
const TerminalIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const BugIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0v3m0-3l-3-3m0 0H8m6 0v14" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l-2 2 2 2v4" />
  </svg>
)

const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const ClipboardIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CodeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

// Enhanced Error Details Component
function DeveloperErrorDetails({ error, errorInfo }: { 
  error: Error | null 
  errorInfo: React.ErrorInfo | null 
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stack' | 'component'>('overview')

  const tabButtonClass = (isActive: boolean) => 
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <div className="mt-4 border border-gray-200 rounded-lg bg-gray-50">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={tabButtonClass(activeTab === 'overview')}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('stack')}
          className={tabButtonClass(activeTab === 'stack')}
        >
          Stack Trace
        </button>
        <button
          onClick={() => setActiveTab('component')}
          className={tabButtonClass(activeTab === 'component')}
        >
          Component Stack
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Error Type</label>
              <div className="font-mono text-sm bg-red-100 text-red-800 p-2 rounded">
                {error?.constructor.name || 'Error'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="font-mono text-sm bg-red-100 text-red-800 p-2 rounded break-all">
                {error?.message || 'No message provided'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
              <div className="font-mono text-sm bg-gray-100 text-gray-800 p-2 rounded">
                {new Date().toISOString()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JavaScript Stack Trace</label>
            <div className="font-mono text-xs bg-white p-3 rounded border max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-all text-gray-800">
                {error?.stack || 'Stack trace not available'}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'component' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">React Component Stack</label>
            <div className="font-mono text-xs bg-white p-3 rounded border max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-all text-gray-800">
                {errorInfo?.componentStack || 'Component stack not available'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Quick Actions Component
function QuickActions({ onCopyReport, onCopyStack, onCopyComponent, copied }: {
  onCopyReport: () => void
  onCopyStack: () => void  
  onCopyComponent: () => void
  copied: string | null
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-sm font-medium text-blue-900 w-full mb-2">Quick Copy Actions:</div>
      
      <button
        onClick={onCopyReport}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {copied === 'report' ? <CheckCircleIcon className="h-3 w-3" /> : <ClipboardIcon className="h-3 w-3" />}
        {copied === 'report' ? 'Copied!' : 'Full Report'}
      </button>
      
      <button
        onClick={onCopyStack}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        {copied === 'stack' ? <CheckCircleIcon className="h-3 w-3" /> : <ClipboardIcon className="h-3 w-3" />}
        {copied === 'stack' ? 'Copied!' : 'JS Stack'}
      </button>
      
      <button
        onClick={onCopyComponent}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        {copied === 'component' ? <CheckCircleIcon className="h-3 w-3" /> : <ClipboardIcon className="h-3 w-3" />}
        {copied === 'component' ? 'Copied!' : 'Component Stack'}
      </button>
    </div>
  )
}

export class DeveloperCentricErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: null,
      retryAttempts: 0,
      isRetrying: false,
      showDebugPanel: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    console.group('🐛 DeveloperCentricErrorBoundary - Error Caught')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Props:', this.props)
    console.groupEnd()
  }

  handleRetry = () => {
    console.info('🔄 Retrying component render...')
    this.setState({ isRetrying: true })
    
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        retryAttempts: this.state.retryAttempts + 1,
        isRetrying: false,
        showDebugPanel: false
      })
      this.props.onReset?.()
    }, 1000)
  }

  copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      this.setState({ copied: type })
      setTimeout(() => this.setState({ copied: null }), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.setState({ copied: type })
      setTimeout(() => this.setState({ copied: null }), 2000)
    }
  }

  copyFullReport = () => {
    const { error, errorInfo } = this.state
    // Create comprehensive developer-focused error logs
    const report = `=== DEVELOPER ERROR REPORT ===
Generated: ${new Date().toISOString()}
Environment: ${this.props.environment || 'unknown'}
Retry Attempts: ${this.state.retryAttempts}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

=== ERROR DETAILS ===
Type: ${error?.constructor.name || 'Unknown'}
Message: ${error?.message || 'No message provided'}
File: ${this.extractFileName(error?.stack)}
Line: ${this.extractLineNumber(error?.stack)}

=== JAVASCRIPT STACK TRACE ===
${error?.stack || 'Not available'}

=== REACT COMPONENT STACK ===
${errorInfo?.componentStack || 'Not available'}

=== BROWSER INFORMATION ===
Platform: ${navigator.platform}
Language: ${navigator.language}
Cookies Enabled: ${navigator.cookieEnabled}
Online: ${navigator.onLine}

=== PERFORMANCE METRICS ===
Memory Usage: ${(performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 'Not available'}
Connection: ${(navigator as any).connection ? (navigator as any).connection.effectiveType : 'Unknown'}

=== END OF REPORT ===`
    
    this.copyToClipboard(report, 'report')
  }

  extractFileName = (stack?: string): string => {
    if (!stack) return 'Unknown'
    const match = stack.match(/at .+ \((.+):(\d+):(\d+)\)/)
    return match ? match[1].split('/').pop() || 'Unknown' : 'Unknown'
  }

  extractLineNumber = (stack?: string): string => {
    if (!stack) return 'Unknown'
    const match = stack.match(/at .+ \((.+):(\d+):(\d+)\)/)
    return match ? match[2] : 'Unknown'
  }

  copyStack = () => {
    this.copyToClipboard(this.state.error?.stack || 'Stack trace not available', 'stack')
  }

  copyComponent = () => {
    this.copyToClipboard(this.state.errorInfo?.componentStack || 'Component stack not available', 'component')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gray-900 text-green-400 rounded-lg border border-gray-700 font-mono shadow-xl">
          <div className="flex items-start gap-4">
            {/* Terminal-style Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-900 rounded-sm flex items-center justify-center border border-red-700">
                <TerminalIcon className="h-5 w-5 text-red-400" />
              </div>
            </div>
            
            <div className="flex-1">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-gray-400 text-sm">error-boundary.tsx</span>
              </div>
              
              {/* Heading */}
              <h3 className="text-red-400 text-lg font-bold mb-2">
                [ERROR] Component Crashed
              </h3>
              
              {/* Subheading */}
              <p className="text-gray-300 mb-4 font-mono text-sm">
                Runtime exception caught • Process can be restarted
              </p>
              
              {/* Terminal-style Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="px-4 py-2 bg-green-800 text-green-200 rounded border border-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors font-mono text-sm"
                >
                  {this.state.isRetrying ? "$ restarting..." : "$ restart"}
                  {this.state.retryAttempts > 0 && ` (${this.state.retryAttempts + 1})`}
                </button>
                
                <button
                  onClick={this.copyFullReport}
                  className="px-4 py-2 bg-blue-800 text-blue-200 rounded border border-blue-600 hover:bg-blue-700 transition-colors font-mono text-sm"
                >
                  {this.state.copied === 'report' ? "$ copied ✓" : "$ export-log"}
                </button>
                
                <button
                  onClick={() => this.setState({ showDebugPanel: !this.state.showDebugPanel })}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded border border-gray-600 hover:bg-gray-700 transition-colors font-mono text-sm"
                >
                  {this.state.showDebugPanel ? "$ hide-debug" : "$ debug"}
                </button>
              </div>
              
              {/* Debug Panel */}
              {this.state.showDebugPanel && (
                <div className="mt-4 p-3 bg-black rounded border border-gray-700">
                  <div className="text-xs space-y-3">
                    <div>
                      <div className="text-yellow-400 mb-1">
                        [ERROR] Type: {this.state.error?.constructor.name || 'Unknown'}
                      </div>
                      <div className="text-red-300 bg-red-900/20 p-2 rounded font-mono break-all">
                        {this.state.error?.message || 'No error message'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-yellow-400 mb-1">
                        [STACK] JavaScript Stack Trace:
                      </div>
                      <div className="text-green-300 bg-gray-900/50 p-2 rounded font-mono text-xs max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap break-all">
                          {this.state.error?.stack || 'Stack trace not available'}
                        </pre>
                      </div>
                    </div>
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <div className="text-yellow-400 mb-1">
                          [REACT] Component Stack:
                        </div>
                        <div className="text-blue-300 bg-blue-900/20 p-2 rounded font-mono text-xs max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap break-all">
                            {this.state.errorInfo.componentStack.trim()}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-yellow-400 mb-1">
                        [INFO] Session Details:
                      </div>
                      <div className="text-gray-300 bg-gray-800/50 p-2 rounded font-mono text-xs">
                        Time: {new Date().toISOString()}<br/>
                        Retries: {this.state.retryAttempts}<br/>
                        URL: {window.location.pathname}<br/>
                        Memory: {(performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}