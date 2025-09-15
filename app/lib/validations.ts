import { z } from 'zod'

export const snippetCategorySchema = z.enum(['professional', 'interactive', 'detailed', 'minimal', 'themed'])

export const snippetFeatureSchema = z.enum([
  'retry', 'collapsible', 'copy', 'animated', 'themed', 'support', 'warning', 
  'info', 'inline-actions', 'modern', 'comprehensive', 'smooth', 'bounce', 
  'transitions', 'automatic', 'smart', 'loading', 'tracking', 'details', 
  'stack-trace', 'essential', 'simple', 'clean', 'space-efficient', 'inline', 
  'minimal', 'dark-mode', 'red-accent', 'gradient', 'colorful', 'beautiful', 
  'fancy', 'elegant', 'premium', 'shadow', 'icon', 'centered', 'svg', 'orange'
])

export const snippetSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9\-]+$/, 'Invalid ID format'),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: snippetCategorySchema,
  tags: z.array(snippetFeatureSchema),
  templatePath: z.string().min(1),
  usageExample: z.string().optional(),
  complexity: z.enum(['simple', 'intermediate', 'advanced']).optional(),
  features: z.array(snippetFeatureSchema).optional(),
})

export const downloadTemplateSchema = z.object({
  path: z.string()
    .min(1)
    .refine(
      (path) => !path.includes('..') && (path.startsWith('templates/') || path.startsWith('app/components/error-boundaries/') || path.startsWith('app/templates/')),
      'Invalid template path'
    )
    .refine(
      (path) => path.endsWith('.tsx') || path.endsWith('.ts') || path.endsWith('.jsx') || path.endsWith('.js'),
      'Invalid file extension'
    )
})

export const searchQuerySchema = z.object({
  q: z.string().max(100).optional(),
  category: snippetCategorySchema.optional(),
  tags: z.array(snippetFeatureSchema).optional(),
})

export type SnippetInput = z.infer<typeof snippetSchema>
export type DownloadTemplateInput = z.infer<typeof downloadTemplateSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>
