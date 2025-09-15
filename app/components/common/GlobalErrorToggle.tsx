"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useErrorTriggerContextSafe } from "../../contexts/ErrorTriggerContext";
import { useEffect } from "react";

interface GlobalErrorToggleProps {
  /** Show as a compact button (default: false) */
  compact?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * Global Error Trigger Button
 *
 * This component provides a single button to trigger or reset errors
 * across all error boundary components in the application.
 */
export function GlobalErrorToggle({
  compact = false,
  className = "",
}: GlobalErrorToggleProps) {
  const { shouldTriggerErrors, toggleAllErrors } = useErrorTriggerContextSafe();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toggleAllErrors();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (compact) {
    return (
      <Button
        variant={shouldTriggerErrors ? "outline" : "destructive"}
        size="sm"
        onClick={toggleAllErrors}
        className={`flex items-center gap-2 ${className}`}
        title={
          shouldTriggerErrors
            ? "Reset all error boundaries"
            : "Trigger all error boundaries"
        }
      >
        {shouldTriggerErrors ? (
          <RotateCcw className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        {shouldTriggerErrors ? "Reset All" : "Trigger Error"}
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <span className="font-medium">Error Boundaries</span>
        <Badge
          variant={shouldTriggerErrors ? "destructive" : "secondary"}
          className="text-xs"
        >
          {shouldTriggerErrors ? "Triggered" : "Ready"}
        </Badge>
      </div>

      <Button
        variant={shouldTriggerErrors ? "outline" : "destructive"}
        size="sm"
        onClick={toggleAllErrors}
        className="flex items-center gap-2"
      >
        {shouldTriggerErrors ? (
          <>
            <RotateCcw className="h-4 w-4" />
            Reset All
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            Trigger Error
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Simple toggle switch for error triggers
 */
export function ErrorTriggerSwitch({ className = "" }: { className?: string }) {
  const { shouldTriggerErrors, toggleAllErrors } = useErrorTriggerContextSafe();

  return (
    <button
      onClick={toggleAllErrors}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${shouldTriggerErrors ? "bg-destructive" : "bg-muted"}
        ${className}
      `}
      role="switch"
      aria-checked={shouldTriggerErrors}
      aria-label="Toggle error triggers"
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${shouldTriggerErrors ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
