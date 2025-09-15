import { Badge } from "@/components/ui/badge"

interface HeaderBannerProps {
  totalTemplates: number
}

export function HeaderBanner({ totalTemplates }: HeaderBannerProps) {
  return (
    <div className="relative border-b shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-card/30 to-muted/20 backdrop-blur-md"></div>
      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center space-y-6">
          <div className="space-y-5">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight font-mono">
              {"<"}Fallbacks {"/>"}
            </h1>
            <div className="py-2 px-4 rounded-lg bg-background/20 border inline-block mx-auto">
              <h2 className="text-2xl font-medium text-foreground/90">
                A Gallery of React Error Boundary Templates
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              A comprehensive collection of {totalTemplates} production-ready error boundary components for modern React applications. 
              Built with TypeScript and Tailwind CSS for seamless integration.
            </p>
          </div>

          {/* Stats and links */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 font-medium">
              {totalTemplates} Production Templates
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5 hover:bg-secondary/10 transition-colors">
              Copy-Paste Ready
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5 hover:bg-secondary/10 transition-colors">
              TypeScript
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5 hover:bg-secondary/10 transition-colors">
              Tailwind CSS
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
