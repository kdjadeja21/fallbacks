"use client"

import { lazy } from 'react'
import type { ErrorBoundaryProps } from './types'

// Template loader registry
const templateLoaders = {
  'professional-red': () => import('@/app/components/error-boundaries/ProfessionalRedErrorBoundary'),
  'professional-blue': () => import('@/app/components/error-boundaries/ProfessionalBlueErrorBoundary'),
  'pro-card': () => import('@/app/components/error-boundaries/ProCardErrorBoundary'),
  'animated': () => import('@/app/components/error-boundaries/AnimatedErrorBoundary'),
  'retry': () => import('@/app/components/error-boundaries/RetryErrorBoundary'),
  'collapsible': () => import('@/app/components/error-boundaries/CollapsibleErrorBoundary'),
  'detailed': () => import('@/app/components/error-boundaries/DetailedErrorBoundary'),
  'minimal': () => import('@/app/components/error-boundaries/MinimalErrorBoundary'),
  'compact': () => import('@/app/components/error-boundaries/CompactErrorBoundary'),
  'dark-mode': () => import('@/app/components/error-boundaries/DarkModeErrorBoundary'),
  'gradient': () => import('@/app/components/error-boundaries/GradientErrorBoundary'),
  'fancy': () => import('@/app/components/error-boundaries/FancyErrorBoundary'),
  'icon': () => import('@/app/components/error-boundaries/IconErrorBoundary'),
} as const

export type TemplateId = keyof typeof templateLoaders

// Cache for loaded templates
const templateCache = new Map<TemplateId, React.ComponentType<ErrorBoundaryProps>>()

export const loadTemplate = async (templateId: TemplateId) => {
  // Check cache first
  if (templateCache.has(templateId)) {
    return templateCache.get(templateId)!
  }

  const loader = templateLoaders[templateId]
  if (!loader) {
    throw new Error(`Template ${templateId} not found`)
  }

  try {
    const module = await loader() as any
    
    // Handle different export patterns
    let Component: React.ComponentType<ErrorBoundaryProps>
    
    if (module.default) {
      // Default export (e.g., ProCardErrorBoundary)
      Component = module.default
    } else {
      // Named export - find the component class
      const componentName = Object.keys(module).find(key => 
        key.includes('ErrorBoundary') && typeof module[key] === 'function'
      )
      
      if (!componentName) {
        throw new Error(`No error boundary component found in module for ${templateId}`)
      }
      
      Component = module[componentName]
    }
    
    if (!Component) {
      throw new Error(`Component not found for template ${templateId}`)
    }
    
    // Cache the loaded component
    templateCache.set(templateId, Component)
    
    return Component
  } catch (error) {
    console.error(`Failed to load template ${templateId}:`, error)
    throw new Error(`Failed to load template ${templateId}`)
  }
}

// Create lazy components for each template
export const createLazyTemplate = (templateId: TemplateId) => {
  return lazy(() => loadTemplate(templateId).then(Component => ({ default: Component })))
}

// Preload critical templates
export const preloadCriticalTemplates = async () => {
  const criticalTemplates: TemplateId[] = ['minimal', 'professional-red', 'retry']
  
  try {
    await Promise.all(
      criticalTemplates.map(templateId => loadTemplate(templateId))
    )
    console.log('Critical templates preloaded successfully')
  } catch (error) {
    console.warn('Failed to preload some critical templates:', error)
  }
}

// Clear template cache (useful for development)
export const clearTemplateCache = () => {
  templateCache.clear()
}
