'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PaperCardProps {
  paper: {
    id: string
    title: string
    description: string | null
    file_url: string
    file_name: string
    author_id: string
    created_at: string
    view_count: number
    likes?: { count: number; user_liked: boolean }
    comments?: { count: number }
    author?: { email: string }
  }
  currentUserId?: string
}

export default function PaperCard({ paper, currentUserId }: PaperCardProps) {
  const [isLiked, setIsLiked] = useState(paper.likes?.user_liked || false)
  const [likeCount, setLikeCount] = useState(paper.likes?.count || 0)
  const supabase = createClient()

  const handleLike = async () => {
    if (!currentUserId) return

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('paper_id', paper.id)

        if (!error) {
          setIsLiked(false)
          setLikeCount(prev => prev - 1)
        }
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([
            {
              user_id: currentUserId,
              paper_id: paper.id,
            },
          ])

        if (!error) {
          setIsLiked(true)
          setLikeCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            <a
              href={`/paper/${paper.id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
            >
              {paper.title}
            </a>
          </h3>
          {paper.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {paper.description}
            </p>
          )}
        </div>
        <a
          href={paper.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition duration-300"
          title="View PDF"
        >
          📄
        </a>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>By {paper.author?.email || 'Unknown'}</span>
          <span>•</span>
          <span>{formatDate(paper.created_at)}</span>
          <span>•</span>
          <span>{paper.view_count} views</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!currentUserId}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition duration-300 ${
              isLiked
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>

          <a
            href={`/paper/${paper.id}#comments`}
            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition duration-300"
          >
            <span>💬</span>
            <span>{paper.comments?.count || 0}</span>
          </a>
        </div>

        <a
          href={`/paper/${paper.id}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition duration-300"
        >
          Read more →
        </a>
      </div>
    </div>
  )
}