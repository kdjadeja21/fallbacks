"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { PreviewWrapper } from "./PreviewWrapper"
import type { Snippet } from "../../lib/types"
import { SNIPPET_CATEGORIES } from "../../lib/constants"

interface Props {
  snippet: Snippet
}

export function ErrorBoundaryCard({ snippet }: Props) {
  const handleDownload = async () => {
    try {
      console.log("[v0] Starting download for:", snippet.templatePath)
      const response = await fetch(`/api/download-template?path=${encodeURIComponent(snippet.templatePath)}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Download API error:", errorData)
        throw new Error(errorData.error || "Failed to download")
      }

      const blob = await response.blob()
      console.log("[v0] Got blob, size:", blob.size)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${snippet.id}.tsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log("[v0] Download completed successfully")
    } catch (error) {
      console.error("[v0] Download failed:", error)
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

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
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PreviewWrapper ErrorBoundaryComponent={snippet.component} />
      </CardContent>
    </Card>
  )
}
