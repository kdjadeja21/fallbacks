import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GlobalErrorToggle } from "../common/GlobalErrorToggle"

interface StickyHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function StickyHeader({ searchQuery, onSearchChange }: StickyHeaderProps) {
  return (
    <header className="bg-background/40 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm backdrop-saturate-150">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground hidden sm:block">
              {"<"}Fallbacks{" />"}
            </h2>
            <h2 className="text-lg font-semibold text-foreground sm:hidden">
              Templates
            </h2>
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9"
              type="search"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {/* Global Error Toggle */}
          <div className="hidden md:block">
            <GlobalErrorToggle compact />
          </div>
        </div>
      </div>
    </header>
  )
}
