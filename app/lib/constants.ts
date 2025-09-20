import type { SnippetCategory, SnippetFeature, SortField } from './types'

export const SNIPPET_CATEGORIES: Record<SnippetCategory, string> = {
  professional: 'Professional',
  interactive: 'Interactive', 
  detailed: 'Detailed',
  minimal: 'Minimal',
  themed: 'Themed'
} as const

export const SNIPPET_FEATURES: Record<SnippetFeature, string> = {
  retry: 'Retry Logic',
  collapsible: 'Collapsible Details',
  copy: 'Copy Functionality',
  animated: 'Animations',
  themed: 'Custom Theme',
  support: 'Support Guidance',
  warning: 'Warning Style',
  info: 'Info Style',
  'inline-actions': 'Inline Actions',
  modern: 'Modern Design',
  comprehensive: 'Comprehensive',
  smooth: 'Smooth Animations',
  bounce: 'Bounce Effects',
  transitions: 'Transitions',
  automatic: 'Automatic Retry',
  smart: 'Smart Logic',
  loading: 'Loading States',
  tracking: 'Retry Tracking',
  details: 'Error Details',
  'stack-trace': 'Stack Trace',
  essential: 'Essential Features',
  simple: 'Simple Design',
  clean: 'Clean Layout',
  'space-efficient': 'Space Efficient',
  inline: 'Inline Layout',
  minimal: 'Minimal Design',
  'dark-mode': 'Dark Mode',
  'red-accent': 'Red Accent',
  gradient: 'Gradient Design',
  colorful: 'Colorful',
  beautiful: 'Beautiful Design',
  fancy: 'Fancy Styling',
  elegant: 'Elegant Design',
  premium: 'Premium Look',
  shadow: 'Shadow Effects',
  icon: 'Icon Focus',
  centered: 'Centered Layout',
  svg: 'SVG Icons',
  orange: 'Orange Theme',
  professional: 'Professional',
  card: 'Card Style',
  detailed: 'Detailed Info',
  compact: 'Compact Design'
} as const

export const SNIPPET_LANGUAGES: Record<string, string> = {
  jsx: 'JSX',
  tsx: 'TypeScript React',
  css: 'CSS',
  tailwind: 'Tailwind CSS',
  html: 'HTML',
  scss: 'SCSS',
  sass: 'Sass',
  'styled-components': 'Styled Components',
  emotion: 'Emotion'
} as const

export const SNIPPET_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'New', variant: 'default' },
  popular: { label: 'Popular', variant: 'secondary' },
  stable: { label: 'Stable', variant: 'outline' },
  beta: { label: 'Beta', variant: 'secondary' },
  experimental: { label: 'Experimental', variant: 'destructive' }
} as const

export const SORT_OPTIONS: Record<SortField, string> = {
  title: 'Name',
  category: 'Category',
  complexity: 'Complexity',
  badge: 'Status'
} as const

export const COMPLEXITY_ORDER: Record<'simple' | 'intermediate' | 'advanced', number> = {
  simple: 0,
  intermediate: 1,
  advanced: 2
} as const

export const BADGE_ORDER: Record<string, number> = {
  new: 0,
  popular: 1,
  stable: 2,
  beta: 3,
  experimental: 4
} as const

export const TEMPLATE_PATHS = {
  TEMPLATES_DIR: 'app/components/error-boundaries',
  API_ENDPOINT: '/api/download-template'
} as const

export const ALLOWED_TEMPLATE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'] as const

export const MAX_RETRY_ATTEMPTS = 3
export const RETRY_DELAY_MS = 1000
