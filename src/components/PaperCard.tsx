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
    <a href={`/paper/${paper.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition duration-300 p-6 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition duration-300">
            {paper.title}
          </h3>
          {paper.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {paper.description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            window.open(paper.file_url, '_blank')
          }}
          className="ml-4 bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 transition duration-300"
          title="View PDF"
        >
          📄
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>By Anonymous</span>
          <span>•</span>
          <span>{formatDate(paper.created_at)}</span>
          <span>•</span>
          <span>{paper.view_count} views</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleLike()
            }}
            disabled={!currentUserId}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition duration-300 ${
              isLiked
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.location.href = `/paper/${paper.id}#comments`
            }}
            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition duration-300"
          >
            <span>💬</span>
            <span>{paper.comments?.count || 0}</span>
          </button>
        </div>

        <span className="text-blue-600 hover:text-blue-700 font-medium transition duration-300">
          Read more →
        </span>
      </div>
    </a>
  )
}