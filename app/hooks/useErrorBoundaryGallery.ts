"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
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

// Cache for expensive computations
const cache = new Map<string, any>()

export function useErrorBoundaryGallery({
  snippets,
  initialSearchQuery = '',
  initialCategory = null,
  initialTags = [],
  initialLanguages = [],
  initialBadges = []
}: UseErrorBoundaryGalleryProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState<SnippetCategory | null>(initialCategory)
  const [selectedTags, setSelectedTags] = useState<SnippetFeature[]>(initialTags)
  const [selectedLanguages, setSelectedLanguages] = useState<SnippetLanguage[]>(initialLanguages)
  const [selectedBadges, setSelectedBadges] = useState<SnippetBadge[]>(initialBadges)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for performance tracking
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const urlTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 250) // Reduced from 300ms to 250ms for better UX
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Cached available collections (computed only once)
  const availableCollections = useMemo(() => {
    const cacheKey = `collections_${snippets.length}`
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const categoriesSet = new Set<SnippetCategory>()
    const tagsSet = new Set<SnippetFeature>()
    const languagesSet = new Set<SnippetLanguage>()
    const badgesSet = new Set<SnippetBadge>()

    // Single pass through snippets
    for (const snippet of snippets) {
      categoriesSet.add(snippet.category)
      
      for (const tag of snippet.tags) tagsSet.add(tag)
      for (const language of snippet.languages) languagesSet.add(language)
      
      if (snippet.badge) badgesSet.add(snippet.badge)
    }

    const result = {
      categories: Array.from(categoriesSet),
      tags: Array.from(tagsSet).sort(),
      languages: Array.from(languagesSet).sort(),
      badges: Array.from(badgesSet).sort()
    }

    cache.set(cacheKey, result)
    return result
  }, [snippets])

  // Destructure for easier access
  const { categories: availableCategories, tags: availableTags, languages: availableLanguages, badges: availableBadges } = availableCollections

  // Optimized filtered snippets with caching
  const filteredSnippets = useMemo(() => {
    try {
      setError(null)
      
      const filterKey = `${debouncedSearchQuery}_${selectedCategory || ''}_${selectedTags.join(',')}_${selectedLanguages.join(',')}_${selectedBadges.join(',')}`
      
      if (cache.has(filterKey)) {
        return cache.get(filterKey)
      }

      const result = filterSnippets(snippets, debouncedSearchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges)
      
      // Cache result for future use
      cache.set(filterKey, result)
      
      // Clean cache if it gets too large
      if (cache.size > 50) {
        const firstKey = cache.keys().next().value
        if (firstKey) {
          cache.delete(firstKey)
        }
      }
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter snippets')
      return []
    }
  }, [snippets, debouncedSearchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges])

  // Optimized handlers with stable references
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleCategoryChange = useCallback((category: SnippetCategory | null) => {
    setSelectedCategory(category)
  }, [])

  const clearCategory = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  const handleTagToggle = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
      return newTags
    })
  }, [])

  const handleTagAdd = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => prev.includes(tag) ? prev : [...prev, tag])
  }, [])

  const handleTagRemove = useCallback((tag: SnippetFeature) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }, [])

  const clearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  const handleLanguageToggle = useCallback((language: SnippetLanguage) => {
    setSelectedLanguages(prev => {
      const newLanguages = prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
      return newLanguages
    })
  }, [])

  const clearLanguages = useCallback(() => {
    setSelectedLanguages([])
  }, [])

  const handleBadgeToggle = useCallback((badge: SnippetBadge) => {
    setSelectedBadges(prev => {
      const newBadges = prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
      return newBadges
    })
  }, [])

  const clearBadges = useCallback(() => {
    setSelectedBadges([])
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setSelectedCategory(null)
    setSelectedTags([])
    setSelectedLanguages([])
    setSelectedBadges([])
    setError(null)
    // Clear relevant cache entries
    cache.clear()
  }, [])

  // Optimized stats calculation
  const stats = useMemo(() => {
    const total = snippets.length
    const filtered = filteredSnippets.length
    const hasActiveFilters = debouncedSearchQuery.trim() !== '' || selectedCategory !== null || 
                           selectedTags.length > 0 || selectedLanguages.length > 0 || selectedBadges.length > 0

    return {
      total,
      filtered,
      categories: availableCategories.length,
      tags: availableTags.length,
      languages: availableLanguages.length,
      badges: availableBadges.length,
      hasActiveFilters
    }
  }, [
    snippets.length, 
    filteredSnippets.length, 
    availableCategories.length, 
    availableTags.length, 
    availableLanguages.length, 
    availableBadges.length, 
    debouncedSearchQuery, 
    selectedCategory, 
    selectedTags.length,
    selectedLanguages.length, 
    selectedBadges.length
  ])

  // Throttled URL synchronization
  const updateURL = useCallback(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (debouncedSearchQuery.trim()) params.set('q', debouncedSearchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    if (selectedLanguages.length > 0) params.set('languages', selectedLanguages.join(','))
    if (selectedBadges.length > 0) params.set('badges', selectedBadges.join(','))

    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    if (window.location.href !== window.location.origin + newURL) {
      window.history.replaceState({}, '', newURL)
    }
  }, [debouncedSearchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges])

  useEffect(() => {
    if (urlTimeoutRef.current) {
      clearTimeout(urlTimeoutRef.current)
    }
    
    urlTimeoutRef.current = setTimeout(updateURL, 400)
    
    return () => {
      if (urlTimeoutRef.current) {
        clearTimeout(urlTimeoutRef.current)
      }
    }
  }, [updateURL])

  // Memoized state object
  const state: GalleryState = useMemo(() => ({
    searchQuery,
    selectedCategory,
    selectedTags,
    selectedLanguages,
    selectedBadges,
    filteredSnippets,
    isLoading: false,
    error
  }), [searchQuery, selectedCategory, selectedTags, selectedLanguages, selectedBadges, filteredSnippets, error])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      if (urlTimeoutRef.current) clearTimeout(urlTimeoutRef.current)
    }
  }, [])

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