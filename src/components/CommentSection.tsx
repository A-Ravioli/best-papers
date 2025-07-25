'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Send, LogIn, Clock, User } from 'lucide-react'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  author?: { email: string }
}

interface CommentSectionProps {
  paperId: string
  currentUserId?: string
}

export default function CommentSection({ paperId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('paper_id', paperId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setComments(data || [])
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [paperId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            content: newComment.trim(),
            paper_id: paperId,
            user_id: currentUserId,
          },
        ])
        .select('*')

      if (error) throw error

      if (data) {
        setComments(prev => [data[0], ...prev])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle>Comments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg" id="comments">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Discussion</CardTitle>
            <Badge variant="secondary">{comments.length}</Badge>
          </div>
        </div>
        <CardDescription>
          Join the conversation about this research paper
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Form */}
        {currentUserId ? (
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this paper..."
                      className="min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <LogIn className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Join the discussion
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Sign in to share your thoughts about this research
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-3">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to share your thoughts about this research!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={comment.id}>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {getInitials('Anonymous')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        Anonymous User
                      </span>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-3">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
                {index < comments.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}