import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Snippet, SnippetCategory, SnippetFeature, SnippetLanguage, SnippetBadge, SortField, SortDirection } from './types'
import { COMPLEXITY_ORDER, BADGE_ORDER } from './constants'

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
  // Early return if no filters applied
  const hasFilters = searchQuery.trim() || selectedCategory || selectedTags.length || selectedLanguages.length || selectedBadges.length
  if (!hasFilters) return snippets

  const searchTerm = searchQuery.trim().toLowerCase()
  const hasSearchTerm = Boolean(searchTerm)
  const hasCategory = Boolean(selectedCategory)
  const hasTags = selectedTags.length > 0
  const hasLanguages = selectedLanguages.length > 0
  const hasBadges = selectedBadges.length > 0

  return snippets.filter(snippet => {
    // Category filter (fastest, do first)
    if (hasCategory && snippet.category !== selectedCategory) return false

    // Badge filter (second fastest)
    if (hasBadges && (!snippet.badge || !selectedBadges.includes(snippet.badge))) return false

    // Languages filter (check arrays)
    if (hasLanguages && !selectedLanguages.every(lang => snippet.languages.includes(lang))) return false

    // Tags filter (check arrays)  
    if (hasTags && !selectedTags.every(tag => 
      snippet.features.includes(tag) || snippet.tags.includes(tag)
    )) return false

    // Search filter (most expensive, do last)
    if (hasSearchTerm) {
      return (
        snippet.title.toLowerCase().includes(searchTerm) ||
        snippet.description.toLowerCase().includes(searchTerm) ||
        snippet.id.toLowerCase().includes(searchTerm) ||
        snippet.category.toLowerCase().includes(searchTerm) ||
        snippet.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    return true
  })
}


export function sanitizeFilePath(path: string): string {
  // Remove any path traversal attempts
  return path.replace(/\.\./g, '').replace(/[^a-zA-Z0-9\-_./]/g, '')
}

export function validateTemplateId(id: string): boolean {
  return /^[a-z0-9\-]+$/.test(id)
}

export function sortSnippets(
  snippets: Snippet[],
  sortField: SortField,
  sortDirection: SortDirection
): Snippet[] {
  const sorted = [...snippets].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'complexity':
        comparison = (COMPLEXITY_ORDER[a.complexity] ?? 999) - (COMPLEXITY_ORDER[b.complexity] ?? 999);
        break;
      case 'badge':
        const aBadgeOrder = a.badge ? (BADGE_ORDER[a.badge] ?? 999) : 999;
        const bBadgeOrder = b.badge ? (BADGE_ORDER[b.badge] ?? 999) : 999;
        comparison = aBadgeOrder - bBadgeOrder;
        break;
      default:
        comparison = 0;
    }

    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return sorted;
}
