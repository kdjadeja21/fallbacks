"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ErrorTrigger } from "../common/ErrorTrigger"
import { useErrorTriggerContextSafe } from "../../contexts/ErrorTriggerContext"
import type { ErrorBoundaryProps } from "../../lib/types"

interface Props {
  ErrorBoundaryComponent: React.ComponentType<ErrorBoundaryProps>
}

export function PreviewWrapper({ ErrorBoundaryComponent }: Props) {
  const [key, setKey] = useState(0)
  const { triggerKey, shouldTriggerErrors } = useErrorTriggerContextSafe()

  console.log("shouldTriggerErrors", shouldTriggerErrors)

  const resetError = () => {
    setKey((prev) => prev + 1) // Force re-render to reset error boundary
  }

  const handleErrorTriggered = () => {
    // Optional: Add any additional logic when error is triggered
    console.log("Error triggered in preview wrapper")
  }

  // Reset the error boundary when global state changes from triggered to not triggered
  useEffect(() => {
    // This effect will run whenever shouldTriggerErrors changes
    // When it changes from true to false, we reset the error boundary
    if (!shouldTriggerErrors) {
      resetError()
    }
  }, [shouldTriggerErrors])

  return (
    <div className="w-full">
      {/* Preview area - shows error trigger UI */}
      <div className="relative border rounded-md bg-background min-h-[120px] w-full">
        <ErrorBoundaryComponent key={`${key}-${triggerKey}`} onReset={resetError}>
          <ErrorTrigger
            showTrigger={false}
            errorMessage="This is a test error to demonstrate the error boundary!"
            onErrorTriggered={handleErrorTriggered}
            onReset={resetError}
          />
        </ErrorBoundaryComponent>
      </div>
    </div>
  )
}
