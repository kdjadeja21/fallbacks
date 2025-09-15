"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { useErrorTriggerContextSafe } from "../../contexts/ErrorTriggerContext"

interface ErrorTriggerProps {
  /** Whether to show the trigger button by default */
  showTrigger?: boolean
  /** Custom error message to throw */
  errorMessage?: string
  /** Custom button text */
  buttonText?: string
  /** Callback when error is triggered */
  onErrorTriggered?: () => void
  /** Callback when component is reset */
  onReset?: () => void
}

interface ErrorTriggerState {
  shouldThrowError: boolean
  hasTriggered: boolean
}

/**
 * Centralized Error Trigger Component
 * 
 * This component provides a safe way to trigger errors for demonstration purposes
 * without causing build issues during deployment. The error is only thrown when
 * explicitly triggered by user interaction.
 */
export function ErrorTrigger({
  showTrigger = true,
  errorMessage = "This is a demonstration error to show the error boundary in action",
  buttonText = "Trigger Error",
  onErrorTriggered,
  onReset
}: ErrorTriggerProps) {
  const { shouldTriggerErrors, triggerKey } = useErrorTriggerContextSafe()
  const [state, setState] = useState<ErrorTriggerState>({
    shouldThrowError: false,
    hasTriggered: false
  })

  // Handle global trigger state changes with useEffect
  useEffect(() => {
    if (shouldTriggerErrors) {
      setState({ shouldThrowError: true, hasTriggered: false })
    } else {
      setState({ shouldThrowError: false, hasTriggered: false })
    }
  }, [triggerKey, shouldTriggerErrors])

  // This effect will throw the error after state update - MUST HAPPEN BEFORE EARLY RETURNS
  if (state.shouldThrowError && !state.hasTriggered) {
    // Mark as triggered before throwing to prevent infinite loops
    setState({ shouldThrowError: false, hasTriggered: true })
    onErrorTriggered?.()
    throw new Error(errorMessage)
  }

  const handleTriggerError = () => {
    setState({ shouldThrowError: true, hasTriggered: false })
  }

  const handleReset = () => {
    setState({ shouldThrowError: false, hasTriggered: false })
    onReset?.()
  }

  if (!showTrigger) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p>Error boundary is ready to catch errors</p>
        <p className="text-sm mt-2">Use the global &quot;Trigger Error&quot; button to test all error boundaries</p>
      </div>
    )
  }

  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-orange-500" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Error Boundary Demo</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Click the button below to trigger an error and see how this error boundary handles it.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          onClick={handleTriggerError}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          {buttonText}
        </Button>
        
        {state.hasTriggered && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Simple Error Trigger for cases where you just need the error throwing logic
 * without the UI. This is useful for testing error boundaries programmatically.
 */
export function useErrorTrigger(errorMessage?: string) {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    setShouldThrow(false)
    throw new Error(errorMessage || "Programmatically triggered error")
  }

  return {
    triggerError: () => setShouldThrow(true)
  }
}

/**
 * HOC that wraps a component with error triggering capability
 */
export function withErrorTrigger<P extends object>(
  Component: React.ComponentType<P>,
  errorMessage?: string
) {
  return function WrappedComponent(props: P) {
    const { triggerError } = useErrorTrigger(errorMessage)
    
    return (
      <div>
        <div className="mb-4 text-center">
          <Button
            onClick={triggerError}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Test Error Boundary
          </Button>
        </div>
        <Component {...props} />
      </div>
    )
  }
}
