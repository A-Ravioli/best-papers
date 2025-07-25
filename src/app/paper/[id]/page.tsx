import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection'

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
      author:author_id (
        email
      ),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Best Papers
            </h1>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                ← Dashboard
              </a>
              {user && (
                <a
                  href="/upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Upload Paper
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Paper Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {paper.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>By {paper.author?.email || 'Unknown'}</span>
                  <span>•</span>
                  <span>{formatDate(paper.created_at)}</span>
                  <span>•</span>
                  <span>{paper.view_count + 1} views</span>
                </div>

                {paper.description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {paper.description}
                  </p>
                )}

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>❤️</span>
                    <span>{paper.likes.length} likes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>💬</span>
                    <span>{paper.comments.length} comments</span>
                  </div>
                </div>
              </div>

              <div className="ml-8 flex flex-col space-y-3">
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 text-center"
                >
                  📄 View Document
                </a>
                <a
                  href={paper.file_url}
                  download={paper.file_name}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-md transition duration-300 text-center"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                File Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Filename:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{paper.file_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{formatDate(paper.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          {paper.file_url.endsWith('.pdf') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Document Preview
              </h3>
              <div className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <iframe
                  src={`${paper.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full"
                  title={`Preview of ${paper.title}`}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Having trouble viewing? <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open in new tab
                </a>
              </p>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection paperId={paper.id} currentUserId={user?.id} />
        </div>
      </main>
    </div>
  )
}