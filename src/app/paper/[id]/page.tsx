import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Download, ExternalLink, Heart, MessageCircle, Eye, Calendar, FileText, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PaperPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
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
                  Dashboard
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Best Papers
              </h1>
            </div>
            {user && (
              <Button asChild>
                <Link href="/upload">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Paper
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Paper Details */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-3 leading-tight">
                      {paper.title}
                    </CardTitle>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {authorEmail}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(paper.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {paper.view_count + 1} views
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {paper.likes.length} likes
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {paper.comments.length} comments
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {paper.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Abstract
                    </h3>
                    <CardDescription className="text-base leading-relaxed">
                      {paper.description}
                    </CardDescription>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Actions
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <a
                        href={paper.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Document
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <a
                        href={paper.file_url}
                        download={paper.file_name}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    File Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Filename:</span>
                      <span className="text-gray-600 dark:text-gray-400 text-right max-w-xs truncate">{paper.file_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                      <span className="text-gray-600 dark:text-gray-400">{formatDate(paper.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Document Preview */}
          <div className="space-y-6">
            {paper.file_url.endsWith('.pdf') && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Document Preview
                  </CardTitle>
                  <CardDescription>
                    View the document directly in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={`${paper.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full"
                      title={`Preview of ${paper.title}`}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Having trouble viewing?{' '}
                    <a
                      href={paper.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Open in new tab
                    </a>
                  </p>
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