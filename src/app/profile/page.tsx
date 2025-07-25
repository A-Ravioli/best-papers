import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PaperCard from '@/components/PaperCard'
import LogoutButton from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's papers
  const { data: userPapers } = await supabase
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
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  // Process papers data
  const processedPapers = (userPapers || []).map(paper => ({
    ...paper,
    likes: {
      count: paper.likes?.length || 0,
      user_liked: paper.likes?.some((like: any) => like.user_id === user.id) || false
    },
    comments: {
      count: paper.comments?.length || 0
    }
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                ← Dashboard
              </a>
              <a
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Upload Paper
              </a>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {user.email}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Papers:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {processedPapers.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Likes:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {processedPapers.reduce((sum, paper) => sum + paper.likes.count, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Views:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {processedPapers.reduce((sum, paper) => sum + paper.view_count, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Papers ({processedPapers.length})
              </h2>
            </div>

            {processedPapers.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No papers yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start sharing your research with the community!
                </p>
                <a
                  href="/upload"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Upload Your First Paper
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {processedPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}