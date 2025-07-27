'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Copy, Check } from 'lucide-react'

interface CitationModalProps {
  isOpen: boolean
  onClose: () => void
  paper: {
    title: string
    created_at: string
    file_name: string
    description?: string | null
  }
  authorEmail?: string
}

export default function CitationModal({ isOpen, onClose, paper, authorEmail }: CitationModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  if (!isOpen) return null

  // Format date for citations
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      year: date.getFullYear(),
      fullDate: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  const { year, fullDate } = formatDate(paper.created_at)
  
  // Determine if author should be included (not anonymous)
  const hasAuthor = authorEmail && authorEmail !== 'Anonymous'
  const authorName = hasAuthor ? authorEmail : ''

  // Generate MLA citation
  const generateMLA = () => {
    let citation = ''
    if (hasAuthor) {
      citation += `${authorName}. `
    }
    citation += `"${paper.title}." `
    citation += `${fullDate}.`
    return citation
  }

  // Generate APA citation
  const generateAPA = () => {
    let citation = ''
    if (hasAuthor) {
      citation += `${authorName}. `
    }
    citation += `(${year}). `
    citation += `${paper.title}.`
    return citation
  }

  const mlaCitation = generateMLA()
  const apaCitation = generateAPA()

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Cite This Paper</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{paper.title}</h3>
            <div className="text-sm text-gray-600">
              {hasAuthor && <p>Author: {authorName}</p>}
              <p>Date: {fullDate}</p>
              <p>File: {paper.file_name}</p>
            </div>
          </div>

          <Tabs defaultValue="mla" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mla">MLA Format</TabsTrigger>
              <TabsTrigger value="apa">APA Format</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mla" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">MLA Citation Format</h4>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-mono leading-relaxed">{mlaCitation}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => copyToClipboard(mlaCitation, 'mla')}
                >
                  {copiedFormat === 'mla' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy MLA Citation
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="apa" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">APA Citation Format</h4>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-mono leading-relaxed">{apaCitation}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => copyToClipboard(apaCitation, 'apa')}
                >
                  {copiedFormat === 'apa' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy APA Citation
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> These citations are automatically generated. Please verify formatting 
              according to your institution's style guide requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 