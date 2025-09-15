import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join, basename, resolve } from "path"
import { downloadTemplateSchema } from "../../lib/validations"
import { sanitizeFilePath } from "../../lib/utils"

// Rate limiting (simple in-memory implementation)
const downloadAttempts = new Map<string, { count: number; lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 10

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const attempts = downloadAttempts.get(clientId)

  if (!attempts || now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    downloadAttempts.set(clientId, { count: 1, lastAttempt: now })
    return true
  }

  if (attempts.count >= MAX_ATTEMPTS_PER_WINDOW) {
    return false
  }

  attempts.count++
  attempts.lastAttempt = now
  return true
}

function getClientId(request: NextRequest): string {
  // Use IP address as client identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request)
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const templatePath = searchParams.get("path")

    if (!templatePath) {
      return NextResponse.json(
        { error: "Template path is required" },
        { status: 400 }
      )
    }

    // Validate and sanitize the template path
    let validatedPath: string
    try {
      const sanitized = sanitizeFilePath(templatePath)
      const validated = downloadTemplateSchema.parse({ path: sanitized })
      validatedPath = validated.path
    } catch (error) {
      console.error(error)
      console.warn(`[API] Invalid template path: ${templatePath}`)
      return NextResponse.json(
        { error: "Invalid template path" },
        { status: 400 }
      )
    }

    // Construct safe file path
    const projectRoot = process.cwd()
    const safePath = resolve(join(projectRoot, validatedPath))

    // Ensure the resolved path is still within the project directory
    if (!safePath.startsWith(projectRoot)) {
      console.error(`[API] Path traversal attempt: ${validatedPath}`)
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    console.log(`[API] Attempting to read file: ${safePath}`)

    // Read the file
    let fileContent: string
    try {
      fileContent = await readFile(safePath, "utf-8")
    } catch (error) {
      console.error(`[API] File read error:`, error)
      
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'ENOENT') {
          return NextResponse.json(
            { error: "Template file not found" },
            { status: 404 }
          )
        }
        if (error.code === 'EACCES') {
          return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
          )
        }
      }
      
      return NextResponse.json(
        { error: "Failed to read template file" },
        { status: 500 }
      )
    }

    console.log(`[API] Successfully read file, content length: ${fileContent.length}`)

    // Validate file content (basic checks)
    if (fileContent.length === 0) {
      return NextResponse.json(
        { error: "Template file is empty" },
        { status: 422 }
      )
    }

    if (fileContent.length > 100000) { // 100KB limit (increased for open source)
      return NextResponse.json(
        { error: "Template file too large" },
        { status: 413 }
      )
    }

    // Basic content validation - ensure it's a valid JavaScript/TypeScript file
    const isValidJSFile = fileContent.includes('React') || 
                         fileContent.includes('react') || 
                         fileContent.includes('export') || 
                         fileContent.includes('function') ||
                         fileContent.includes('const') ||
                         fileContent.includes('class')
    
    if (!isValidJSFile) {
      return NextResponse.json(
        { error: "Invalid template content - not a valid JavaScript/TypeScript file" },
        { status: 422 }
      )
    }

    // Extract filename for download (preserve original extension)
    const downloadFilename = basename(validatedPath)

    // Determine content type based on file extension
    const fileExtension = validatedPath.split('.').pop()?.toLowerCase()
    const contentType = fileExtension === 'ts' || fileExtension === 'tsx' 
      ? "text/typescript; charset=utf-8"
      : "text/javascript; charset=utf-8"

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
        "Content-Length": fileContent.length.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    })
  } catch (error) {
    console.error("[API] Unexpected error downloading template:", error)
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  )
}