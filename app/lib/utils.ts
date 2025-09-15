import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Snippet, SnippetCategory, SnippetFeature, SnippetLanguage, SnippetBadge } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterSnippets(
  snippets: Snippet[],
  searchQuery: string,
  selectedCategory: SnippetCategory | null,
  selectedTags: SnippetFeature[],
  selectedLanguages: SnippetLanguage[] = [],
  selectedBadges: SnippetBadge[] = []
): Snippet[] {
  return snippets.filter(snippet => {
    // Enhanced search - search in title, description, id, category, and features
    const searchTerm = searchQuery.trim().toLowerCase()
    const matchesSearch = !searchTerm || 
      snippet.title.toLowerCase().includes(searchTerm) ||
      snippet.description.toLowerCase().includes(searchTerm) ||
      snippet.id.toLowerCase().includes(searchTerm) ||
      snippet.category.toLowerCase().includes(searchTerm) ||
      snippet.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    
    const matchesCategory = !selectedCategory || snippet.category === selectedCategory
    
    // Check both features and tags arrays for selected tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => 
        snippet.features.includes(tag) || snippet.tags.includes(tag)
      )

    const matchesLanguages = selectedLanguages.length === 0 ||
      selectedLanguages.every(lang => snippet.languages.includes(lang))

    const matchesBadges = selectedBadges.length === 0 ||
      (snippet.badge && selectedBadges.includes(snippet.badge))

    return matchesSearch && matchesCategory && matchesTags && matchesLanguages && matchesBadges
  })
}


export function sanitizeFilePath(path: string): string {
  // Remove any path traversal attempts
  return path.replace(/\.\./g, '').replace(/[^a-zA-Z0-9\-_./]/g, '')
}

export function validateTemplateId(id: string): boolean {
  return /^[a-z0-9\-]+$/.test(id)
}
