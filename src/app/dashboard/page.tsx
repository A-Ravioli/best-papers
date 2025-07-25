import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PaperCard from '@/components/PaperCard'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch recent papers
  const { data: recentPapers } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch trending papers (based on likes in the last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: trendingPapers } = await supabase
    .from('papers')
    .select(`
      *,
      likes!inner (
        user_id,
        created_at
      ),
      comments (
        id
      )
    `)
    .gte('likes.created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get total stats
  const { count: totalPapers } = await supabase
    .from('papers')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('papers')
    .select('author_id', { count: 'exact', head: true })

  const { count: totalLikes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })

  // Process papers data to include like/comment counts and user interaction status
  const processedRecentPapers = (recentPapers || []).map(paper => ({
    ...paper,
    likes: {
      count: paper.likes?.length || 0,
      user_liked: paper.likes?.some((like: any) => like.user_id === user.id) || false
    },
    comments: {
      count: paper.comments?.length || 0
    }
  }))

  const processedTrendingPapers = (trendingPapers || []).map(paper => ({
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
              Best Papers
            </h1>
            <div className="flex items-center space-x-4">
              <a
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Upload Paper
              </a>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Papers
              </h2>
              {processedRecentPapers.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                  <div className="text-gray-600 dark:text-gray-300 mb-4">
                    No papers uploaded yet. Be the first to share your research!
                  </div>
                  <a
                    href="/upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  >
                    Upload Your First Paper
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {processedRecentPapers.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      currentUserId={user.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {processedTrendingPapers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Trending This Week
                </h2>
                <div className="space-y-6">
                  {processedTrendingPapers.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      currentUserId={user.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/upload"
                  className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition duration-300"
                >
                  📄 Upload New Paper
                </a>
                <a
                  href="/profile"
                  className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300"
                >
                  👤 View My Papers
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Platform Stats
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Total Papers:</span>
                  <span>{totalPapers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span>{totalUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Likes:</span>
                  <span>{totalLikes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}