'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, Loader2 } from 'lucide-react'

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => {
    // Use local worker file to avoid CDN issues
    if (typeof window !== 'undefined') {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs'
    }
    return mod.Document
  }),
  { ssr: false }
)

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
)

interface PdfViewerProps {
  url: string
  fileName: string
  title: string
}

export default function PdfViewer({ url, fileName, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [viewMode, setViewMode] = useState<'scroll' | 'pages'>('scroll')

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF document')
    setLoading(false)
  }, [])

  const zoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.25))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25))
  }

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const resetView = () => {
    setScale(1.0)
    setRotation(0)
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'scroll' ? 'pages' : 'scroll')
  }

  // Render all pages for scroll mode
  const renderAllPages = () => {
    if (!numPages) return null
    
    return Array.from({ length: numPages }, (_, index) => (
      <div key={index + 1} className="mb-4 flex justify-center">
        <Page
          pageNumber={index + 1}
          scale={scale}
          rotate={rotation}
          loading=""
          className="bg-white border border-gray-300 shadow-md"
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </div>
    ))
  }

  if (!isClient) {
    return (
      <Card className="shadow-lg h-[600px] flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-gray-600">Loading PDF viewer...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-lg h-[600px] flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <div className="text-red-500 text-4xl">📄</div>
          <div>
            <p className="text-gray-900 font-medium mb-2">
              Unable to load PDF
            </p>
            <p className="text-gray-600 text-sm mb-4">
              {error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline" size="sm">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={url} download={fileName}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Document Viewer</CardTitle>
          <div className="flex items-center gap-2">
            {numPages && (
              <Badge variant="secondary" className="text-xs">
                {viewMode === 'scroll' ? `${numPages} pages` : `Page 1 / ${numPages}`}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {Math.round(scale * 100)}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Controls */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'scroll' ? 'default' : 'outline'}
              size="sm"
              onClick={toggleViewMode}
            >
              {viewMode === 'scroll' ? 'Scroll View' : 'Page View'}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              Reset
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative h-[520px] overflow-auto bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="text-sm text-gray-600">Loading document...</p>
              </div>
            </div>
          )}
          
          <div className="p-4">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              className="shadow-lg"
            >
              {viewMode === 'scroll' ? (
                // Scroll view - show all pages
                <div className="space-y-4">
                  {renderAllPages()}
                </div>
              ) : (
                // Single page view
                <div className="flex justify-center">
                  <Page
                    pageNumber={1}
                    scale={scale}
                    rotate={rotation}
                    loading=""
                    className="bg-white border border-gray-300"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              )}
            </Document>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500 truncate max-w-xs">
            {fileName}
          </p>
          <div className="flex gap-1">
            <Button asChild variant="outline" size="sm">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                Open
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={url} download={fileName}>
                <Download className="mr-1 h-3 w-3" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 