import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (25MB)
    const maxSize = 25 * 1024 * 1024 // 25MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      )
    }

    // Try to use Vercel Blob if available
    let url: string
    let filename: string
    let size: number

    try {
      // Check if Vercel Blob is configured
      const { put } = await import('@vercel/blob')
      
      const blob = await put(file.name, file, {
        access: 'public',
      })

      url = blob.url
      filename = file.name
      size = file.size
    } catch (blobError) {
      // Fallback to local storage (for development)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Create a unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      filename = `${timestamp}-${sanitizedName}`
      
      // Save to temp directory
      const tempDir = tmpdir()
      const filePath = join(tempDir, filename)
      await writeFile(filePath, buffer)
      
      // For development, return a mock URL
      url = `/api/files/${filename}`
      size = file.size
    }

    return NextResponse.json({
      url,
      filename,
      size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
} 