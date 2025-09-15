"use client";

import React, { Suspense, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createLazyTemplate, type TemplateId } from "../../lib/template-loader";
import type { Snippet } from "../../lib/types";
import { SNIPPET_CATEGORIES } from "../../lib/constants";
import { ErrorTrigger as CentralizedErrorTrigger } from "../common/ErrorTrigger";
import { useErrorTriggerContextSafe } from "../../contexts/ErrorTriggerContext";

interface Props {
  snippet: Snippet;
}

// Skeleton loader for templates
function TemplateSkeleton() {
  return (
    <div className="relative border rounded-md bg-background min-h-[120px] w-full flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading template...</span>
      </div>
    </div>
  );
}

// Error fallback for failed template loads
function TemplateError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="relative border border-destructive/20 rounded-md bg-destructive/5 min-h-[120px] w-full flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-sm text-destructive mb-2">Failed to load template</p>
        <Button size="sm" variant="outline" onClick={retry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

// Error boundary for template loading
class TemplateErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Template loading error:", error, errorInfo);
    toast.error("Failed to load template component");
  }

  render() {
    if (this.state.hasError) {
      return (
        <TemplateError
          error={this.state.error!}
          retry={() => {
            this.setState({ hasError: false, error: null });
            this.props.onRetry();
          }}
        />
      );
    }

    return this.props.children;
  }
}

export function LazyErrorBoundaryCard({ snippet }: Props) {
  const [retryKey, setRetryKey] = React.useState(0);
  const { triggerKey, shouldTriggerErrors } = useErrorTriggerContextSafe();

  const handleDownload = async () => {
    try {
      console.log("[Gallery] Starting download for:", snippet.templatePath);
      const response = await fetch(
        `/api/download-template?path=${encodeURIComponent(
          snippet.templatePath
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Gallery] Download API error:", errorData);
        throw new Error(errorData.error || "Failed to download");
      }

      const blob = await response.blob();
      console.log("[Gallery] Got blob, size:", blob.size);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${snippet.id}.tsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("[Gallery] Download completed successfully");
      toast.success(`Template "${snippet.title}" downloaded successfully`);
    } catch (error) {
      console.error("[Gallery] Download failed:", error);
      toast.error(
        `Failed to download "${snippet.title}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleCopy = async () => {
    try {
      console.log("[v0] Starting copy for:", snippet.templatePath);
      const response = await fetch(
        `/api/download-template?path=${encodeURIComponent(
          snippet.templatePath
        )}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("[v0] Copy API error:", errorData);
        throw new Error(errorData.error || "Failed to copy");
      } // Get file text instead of blob
      const text = await response.text();

      // Add the snippet title as a comment at the top of the code
      const textWithTitle = `// ${snippet.title}\n\n${text}`;
      
      await navigator.clipboard.writeText(textWithTitle);
      console.log("[v0] Snippet copied successfully");
      toast.success(`Template "${snippet.title}" copied to clipboard`);
    } catch (error) {
      console.error("[v0] Copy failed:", error);
      toast.error(
        `Failed to copy "${snippet.title}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleErrorTriggered = () => {
    console.log("Error triggered in gallery card:", snippet.id);
    // toast.error(`Error triggered in "${snippet.id}.tsx" template`);
  };

  // Reset the error boundary when global state changes from triggered to not triggered
  useEffect(() => {
    // This effect will run whenever shouldTriggerErrors changes
    // When it changes from true to false, we reset the error boundary
    if (!shouldTriggerErrors) {
      handleRetry();
    }
  }, [shouldTriggerErrors]);

  // Create lazy component for this specific template
  const LazyTemplate = React.useMemo(() => {
    return createLazyTemplate(snippet.id as TemplateId);
  }, [snippet.id]);

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{snippet.title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {SNIPPET_CATEGORIES[snippet.category]}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {snippet.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="cursor-pointer w-full sm:w-auto flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden xs:inline">Copy Snippet</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="cursor-pointer w-full sm:w-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TemplateErrorBoundary onRetry={handleRetry}>
          <Suspense fallback={<TemplateSkeleton />}>
            <div className="w-full">
              <div className="relative border rounded-md bg-background min-h-[120px] w-full">
                <LazyTemplate
                  key={`${retryKey}-${triggerKey}`}
                  onReset={handleRetry}
                >
                  <CentralizedErrorTrigger
                    showTrigger={false}
                    errorMessage="This is a demonstration error to show the error boundary in action"
                    buttonText="Trigger Error"
                    onErrorTriggered={handleErrorTriggered}
                    onReset={handleRetry}
                  />
                </LazyTemplate>
              </div>
            </div>
          </Suspense>
        </TemplateErrorBoundary>
      </CardContent>
    </Card>
  );
}
