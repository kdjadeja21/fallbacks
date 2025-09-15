"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorTriggerContextType {
  /** Global state indicating if errors should be triggered */
  shouldTriggerErrors: boolean
  /** Global counter to force re-renders when triggering/resetting */
  triggerKey: number
  /** Trigger errors in all error boundaries */
  triggerAllErrors: () => void
  /** Reset all error boundaries */
  resetAllErrors: () => void
  /** Toggle between trigger and reset states */
  toggleAllErrors: () => void
}

const ErrorTriggerContext = createContext<ErrorTriggerContextType | undefined>(undefined)

interface ErrorTriggerProviderProps {
  children: ReactNode
  /** Initial state for triggering errors (default: false) */
  initialTriggerState?: boolean
}

/**
 * Provider component that manages global error trigger state
 */
export function ErrorTriggerProvider({ 
  children, 
  initialTriggerState = false 
}: ErrorTriggerProviderProps) {
  const [shouldTriggerErrors, setShouldTriggerErrors] = useState(initialTriggerState)
  const [triggerKey, setTriggerKey] = useState(0)

  const triggerAllErrors = () => {
    setShouldTriggerErrors(true)
    setTriggerKey(prev => prev + 1)
  }

  const resetAllErrors = () => {
    setShouldTriggerErrors(false)
    setTriggerKey(prev => prev + 1)
  }

  const toggleAllErrors = () => {
    if (shouldTriggerErrors) {
      resetAllErrors()
    } else {
      triggerAllErrors()
    }
  }

  const value: ErrorTriggerContextType = {
    shouldTriggerErrors,
    triggerKey,
    triggerAllErrors,
    resetAllErrors,
    toggleAllErrors
  }

  return (
    <ErrorTriggerContext.Provider value={value}>
      {children}
    </ErrorTriggerContext.Provider>
  )
}

/**
 * Hook to access the error trigger context
 */
export function useErrorTriggerContext(): ErrorTriggerContextType {
  const context = useContext(ErrorTriggerContext)
  
  if (context === undefined) {
    throw new Error('useErrorTriggerContext must be used within an ErrorTriggerProvider')
  }
  
  return context
}

/**
 * Hook that provides safe access to error trigger context with fallback
 * This is useful when the component might be used outside of the provider
 */
export function useErrorTriggerContextSafe(): ErrorTriggerContextType {
  const context = useContext(ErrorTriggerContext)
  
  // Provide default values if context is not available
  if (context === undefined) {
    return {
      shouldTriggerErrors: false,
      triggerKey: 0,
      triggerAllErrors: () => {},
      resetAllErrors: () => {},
      toggleAllErrors: () => {}
    }
  }
  
  return context
}
