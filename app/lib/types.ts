import type React from "react"

export interface ErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
  fallback?: React.ComponentType<ErrorBoundaryFallbackProps>
}

export interface ErrorBoundaryFallbackProps {
  error: Error
  resetError: () => void
  retry: () => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export type SnippetCategory = 'professional' | 'interactive' | 'detailed' | 'minimal' | 'themed'
export type SnippetFeature = 'retry' | 'collapsible' | 'copy' | 'animated' | 'themed' | 'support' | 'warning' | 'info' | 'inline-actions' | 'modern' | 'comprehensive' | 'smooth' | 'bounce' | 'transitions' | 'automatic' | 'smart' | 'loading' | 'tracking' | 'details' | 'stack-trace' | 'essential' | 'simple' | 'clean' | 'space-efficient' | 'inline' | 'minimal' | 'dark-mode' | 'red-accent' | 'gradient' | 'colorful' | 'beautiful' | 'fancy' | 'elegant' | 'premium' | 'shadow' | 'icon' | 'centered' | 'svg' | 'orange' | 'professional' | 'card' | 'detailed' | 'compact'

export type SnippetLanguage = 'jsx' | 'tsx' | 'css' | 'tailwind' | 'html' | 'scss' | 'sass' | 'styled-components' | 'emotion'
export type SnippetBadge = 'new' | 'popular' | 'stable' | 'beta' | 'experimental'

export interface Snippet {
  id: string
  title: string
  description: string
  component: React.ComponentType<ErrorBoundaryProps>
  category: SnippetCategory
  tags: readonly SnippetFeature[]
  templatePath: string
  usageExample?: string
  complexity: 'simple' | 'intermediate' | 'advanced'
  features: readonly SnippetFeature[]
  languages: readonly SnippetLanguage[]
  badge?: SnippetBadge
}

export interface CodeSection {
  component: string
  usage: string
  types?: string
}

export interface GalleryFilters {
  searchQuery: string
  selectedCategory: SnippetCategory | null
  selectedTags: SnippetFeature[]
  selectedLanguages: SnippetLanguage[]
  selectedBadges: SnippetBadge[]
}

export interface GalleryState extends GalleryFilters {
  filteredSnippets: Snippet[]
  isLoading: boolean
  error: string | null
}
