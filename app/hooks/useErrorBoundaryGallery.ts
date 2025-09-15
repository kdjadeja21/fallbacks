"use client"

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Snippet, SnippetCategory, SnippetFeature, GalleryState } from '../lib/types'
import { filterSnippets } from '../lib/utils'

interface UseErrorBoundaryGalleryProps {
  snippets: Snippet[]
  initialSearchQuery?: string
  initialCategory?: SnippetCategory | null
  initialTags?: SnippetFeature[]
}

export function useErrorBoundaryGallery({
  snippets,
  initialSearchQuery = '',
  initialCategory = null,
  initialTags = []
}: UseErrorBoundaryGalleryProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState<SnippetCategory | null>(initialCategory)
  const [selectedTags, setSelectedTags] = useState<SnippetFeature[]>(initialTags)
  const [error, setError] = useState<string | null>(null)

  // Simple search handler - no debouncing needed for client-side filtering
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Memoized filtered snippets
  const filteredSnippets = useMemo(() => {
    try {
      setError(null)
      return filterSnippets(snippets, searchQuery, selectedCategory, selectedTags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter snippets')
      return []
    }
  }, [snippets, searchQuery, selectedCategory, selectedTags])

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

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedTags([])
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

  // Statistics
  const stats = useMemo(() => ({
    total: snippets.length,
    filtered: filteredSnippets.length,
    categories: availableCategories.length,
    tags: availableTags.length,
    hasActiveFilters: searchQuery.trim() !== '' || selectedCategory !== null || selectedTags.length > 0
  }), [snippets.length, filteredSnippets.length, availableCategories.length, availableTags.length, searchQuery, selectedCategory, selectedTags])

  // URL synchronization (optional)
  const updateURL = useCallback(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))

    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, '', newURL)
  }, [searchQuery, selectedCategory, selectedTags])

  useEffect(() => {
    updateURL()
  }, [updateURL])

  const state: GalleryState = {
    searchQuery,
    selectedCategory,
    selectedTags,
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
    clearAllFilters,
    
    // Computed values
    availableCategories,
    availableTags,
    stats
  }
}
