"use client"

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Snippet, SnippetCategory, SnippetFeature, SnippetLanguage, SnippetBadge, GalleryState } from '../lib/types'
import { filterSnippets } from '../lib/utils'

interface UseErrorBoundaryGalleryProps {
  snippets: Snippet[]
  initialSearchQuery?: string
  initialCategory?: SnippetCategory | null
  initialTags?: SnippetFeature[]
  initialLanguages?: SnippetLanguage[]
  initialBadges?: SnippetBadge[]
}

export function useErrorBoundaryGallery({
  snippets,
  initialSearchQuery = '',
  initialCategory = null,
  initialTags = [],
  initialLanguages = [],
  initialBadges = []
}: UseErrorBoundaryGalleryProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState<SnippetCategory | null>(initialCategory)
  const [selectedTags, setSelectedTags] = useState<SnippetFeature[]>(initialTags)
  const [selectedLanguages, setSelectedLanguages] = useState<SnippetLanguage[]>(initialLanguages)
  const [selectedBadges, setSelectedBadges] = useState<SnippetBadge[]>(initialBadges)
  const [error, setError] = useState<string | null>(null)

  // Simple search handler - no debouncing needed for client-side filtering
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Memoized filtered snippets
  const filteredSnippets = useMemo(() => {
    try {
      setError(null)
      return filterSnippets(snippets, searchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter snippets')
      return []
    }
  }, [snippets, searchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges])

  // Category management
  const handleCategoryChange = useCallback((category: SnippetCategory | null) => {
    setSelectedCategory(category)
  }, [])

  const clearCategory = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  // Tag management
  const handleTagToggle = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  const handleTagAdd = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev : [...prev, tag]
    )
  }, [])

  const handleTagRemove = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }, [])

  const clearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  // Language management
  const handleLanguageToggle = useCallback((language: SnippetLanguage) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }, [])

  const clearLanguages = useCallback(() => {
    setSelectedLanguages([])
  }, [])

  // Badge management
  const handleBadgeToggle = useCallback((badge: SnippetBadge) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    )
  }, [])

  const clearBadges = useCallback(() => {
    setSelectedBadges([])
  }, [])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedTags([])
    setSelectedLanguages([])
    setSelectedBadges([])
    setError(null)
  }, [])

  // Get unique categories and tags from snippets
  const availableCategories = useMemo(() => {
    return Array.from(new Set(snippets.map(s => s.category)))
  }, [snippets])

  const availableTags = useMemo(() => {
    const allTags = snippets.flatMap(s => s.tags)
    return Array.from(new Set(allTags)).sort()
  }, [snippets])

  const availableLanguages = useMemo(() => {
    const allLanguages = snippets.flatMap(s => s.languages)
    return Array.from(new Set(allLanguages)).sort()
  }, [snippets])

  const availableBadges = useMemo(() => {
    const allBadges = snippets.filter(s => s.badge).map(s => s.badge!)
    return Array.from(new Set(allBadges)).sort()
  }, [snippets])

  // Statistics
  const stats = useMemo(() => ({
    total: snippets.length,
    filtered: filteredSnippets.length,
    categories: availableCategories.length,
    tags: availableTags.length,
    languages: availableLanguages.length,
    badges: availableBadges.length,
    hasActiveFilters: searchQuery.trim() !== '' || selectedCategory !== null || selectedTags.length > 0 || selectedLanguages.length > 0 || selectedBadges.length > 0
  }), [snippets.length, filteredSnippets.length, availableCategories.length, availableTags.length, availableLanguages.length, availableBadges.length, searchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges])

  // URL synchronization (optional)
  const updateURL = useCallback(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    if (selectedLanguages.length > 0) params.set('languages', selectedLanguages.join(','))
    if (selectedBadges.length > 0) params.set('badges', selectedBadges.join(','))

    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, '', newURL)
  }, [searchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges])

  useEffect(() => {
    updateURL()
  }, [updateURL])

  const state: GalleryState = {
    searchQuery,
    selectedCategory,
    selectedTags,
    selectedLanguages,
    selectedBadges,
    filteredSnippets,
    isLoading: false, // No loading state needed for client-side filtering
    error
  }

  return {
    // State
    ...state,
    
    // Actions
    handleSearchChange,
    setSearchQuery,
    handleCategoryChange,
    clearCategory,
    handleTagToggle,
    handleTagAdd,
    handleTagRemove,
    clearTags,
    handleLanguageToggle,
    clearLanguages,
    handleBadgeToggle,
    clearBadges,
    clearAllFilters,
    
    // Computed values
    availableCategories,
    availableTags,
    availableLanguages,
    availableBadges,
    stats
  }
}
