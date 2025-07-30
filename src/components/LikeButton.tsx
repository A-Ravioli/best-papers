'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  paperId: string
  initialLiked: boolean
  initialCount: number
  currentUserId?: string
  variant?: 'default' | 'compact'
  className?: string
}

export default function LikeButton({ 
  paperId, 
  initialLiked, 
  initialCount, 
  currentUserId,
  variant = 'default',
  className 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLike = async () => {
    if (!currentUserId || isLoading) return

    setIsLoading(true)
    
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('paper_id', paperId)

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
              paper_id: paperId,
            },
          ])

        if (!error) {
          setIsLiked(true)
          setLikeCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUserId) {
    return (
      <Button
        variant="outline"
        size={variant === 'compact' ? 'sm' : 'default'}
        className={cn("cursor-not-allowed", className)}
        disabled
      >
        <Heart className={cn("h-4 w-4 mr-2", variant === 'compact' && "h-3 w-3 mr-1")} />
        {likeCount}
      </Button>
    )
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size={variant === 'compact' ? 'sm' : 'default'}
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isLiked && "bg-red-500 hover:bg-red-600 border-red-500 text-white",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 mr-2 transition-all duration-200",
          variant === 'compact' && "h-3 w-3 mr-1",
          isLiked && "fill-current"
        )} 
      />
      {isLoading ? '...' : likeCount}
    </Button>
  )
} 