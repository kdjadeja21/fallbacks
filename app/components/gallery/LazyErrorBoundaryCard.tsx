"use client";

import React, { Suspense, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createLazyTemplate, type TemplateId } from "../../lib/template-loader";
import type { Snippet } from "../../lib/types";
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
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const { triggerKey, shouldTriggerErrors } = useErrorTriggerContextSafe();

  const handleDownload = async () => {
    if (isDownloading) return; // Prevent multiple concurrent downloads
    
    setIsDownloading(true);
    try {
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

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${snippet.id}.tsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Template "${snippet.title}" downloaded successfully`);
    } catch (error) {
      console.error("[Gallery] Download failed:", error);
      toast.error(
        `Failed to download "${snippet.title}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (isCopying) return; // Prevent multiple concurrent copies
    
    setIsCopying(true);
    try {
      const response = await fetch(
        `/api/download-template?path=${encodeURIComponent(
          snippet.templatePath
        )}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("[v0] Copy API error:", errorData);
        throw new Error(errorData.error || "Failed to copy");
      }
      
      // Get file text instead of blob
      const text = await response.text();

      // Add the snippet title as a comment at the top of the code
      const textWithTitle = `// ${snippet.title}\n\n${text}`;
      
      await navigator.clipboard.writeText(textWithTitle);
      toast.success(`Template "${snippet.title}" copied to clipboard`);
    } catch (error) {
      console.error("[v0] Copy failed:", error);
      toast.error(
        `Failed to copy "${snippet.title}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCopying(false);
    }
  };

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleErrorTriggered = () => {
    console.error("Error triggered in gallery card:", snippet.id);
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
    <Card className="h-fit hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{snippet.title}</CardTitle>
              {/* <Badge variant="secondary" className="text-xs">
                {SNIPPET_CATEGORIES[snippet.category]}
              </Badge>
              {snippet.badge && (
                <Badge 
                  variant={SNIPPET_BADGES[snippet.badge].variant} 
                  className="text-xs font-medium"
                >
                  {SNIPPET_BADGES[snippet.badge].label}
                </Badge>
              )} */}
            </div>
            
            {/* Languages Section */}
            {/* {snippet.languages && snippet.languages.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-sm text-muted-foreground font-medium">Languages:</span>
                {snippet.languages.map((language) => (
                  <Badge 
                    key={language} 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-150"
                  >
                    {SNIPPET_LANGUAGES[language] || language}
                  </Badge>
                ))}
              </div>
            )} */}
            
            {/* Features Section */}
            {/* <div className="flex flex-wrap gap-1 items-center">
              <span className="text-sm text-muted-foreground font-medium">Features:</span>
              {snippet.features.map((feature) => (
                <Badge 
                  key={feature} 
                  variant="outline" 
                  className="text-xs hover:bg-gray-50 transition-colors duration-150"
                >
                  {feature}
                </Badge>
              ))}
            </div> */}
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={isCopying}
              className="cursor-pointer w-full sm:w-auto flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isCopying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{isCopying ? "Copying..." : "Copy"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="cursor-pointer w-full sm:w-auto flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
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
