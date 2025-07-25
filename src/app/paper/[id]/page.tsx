import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'
import PdfViewer from '@/components/PdfViewer'
import LikeButton from '@/components/LikeButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Download, ExternalLink, Heart, MessageCircle, Eye, Calendar, FileText, User, LogIn } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PaperPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user (but don't require authentication)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch paper with author info, likes, and comments count
  const { data: paper, error } = await supabase
    .from('papers')
    .select(`
      *,
      likes (
        user_id
      ),
      comments (
        id
      )
    `)
    .eq('id', id)
    .single()

  if (error || !paper) {
    notFound()
  }

  // For now, we'll show "Anonymous" since we can't easily join with auth.users
  // In a production app, you'd want to store author info in a separate users table
  const authorEmail = 'Anonymous'

  // Increment view count
  await supabase
    .from('papers')
    .update({ view_count: paper.view_count + 1 })
    .eq('id', id)

  // Check if current user liked this paper
  const userLiked = user ? paper.likes.some((like: any) => like.user_id === user.id) : false

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Papers
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Best Papers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button asChild>
                    <Link href="/upload">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Paper
                    </Link>
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout - 1/3 left, 2/3 right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - Paper Details (4/12 = 1/3) */}
          <div className="lg:col-span-4">
            <Card className="shadow-lg h-[600px] flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="text-xl mb-3 leading-tight">
                  {paper.title}
                </CardTitle>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span className="text-xs">{authorEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="text-xs">{formatDate(paper.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="text-xs">{paper.view_count + 1} views</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    {paper.likes.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {paper.comments.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col overflow-hidden">
                {paper.description && (
                  <div className="mb-4 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Abstract
                    </h3>
                    <CardDescription className="text-sm leading-relaxed">
                      {paper.description}
                    </CardDescription>
                  </div>
                )}

                <div className="mt-auto space-y-4 flex-shrink-0">
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </h3>
                    <div className="flex flex-col gap-2">
                      {user ? (
                        <LikeButton
                          paperId={paper.id}
                          initialLiked={userLiked}
                          initialCount={paper.likes.length}
                          currentUserId={user.id}
                          variant="compact"
                          className="w-full"
                        />
                      ) : (
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href="/login">
                            <LogIn className="mr-2 h-3 w-3" />
                            Sign In to Like
                          </Link>
                        </Button>
                      )}
                      <Button asChild size="sm" className="w-full">
                        <a
                          href={paper.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View Document
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a
                          href={paper.file_url}
                          download={paper.file_name}
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      File Info
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300">File:</span>
                        <span className="text-gray-600 dark:text-gray-400 text-right max-w-[140px] truncate" title={paper.file_name}>
                          {paper.file_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                        <span className="text-gray-600 dark:text-gray-400">{formatDate(paper.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Document Preview (8/12 = 2/3) */}
          <div className="lg:col-span-8">
            {paper.file_url.endsWith('.pdf') ? (
              <PdfViewer
                url={paper.file_url}
                fileName={paper.file_name}
                title={paper.title}
              />
            ) : (
              <Card className="shadow-lg h-[600px] flex items-center justify-center">
                <CardContent className="text-center space-y-4">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2">
                      Preview not available
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      This file type is not supported for preview
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild variant="outline" size="sm">
                        <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={paper.file_url} download={paper.file_name}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Comments Section - Full Width */}
        <CommentSection paperId={paper.id} currentUserId={user?.id} />
      </main>
    </div>
  )
}