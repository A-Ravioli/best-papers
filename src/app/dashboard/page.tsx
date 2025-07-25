'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PaperCard from '@/components/PaperCard'
import LikeButton from '@/components/LikeButton'
import LogoutButton from '@/components/LogoutButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Search, 
  Upload, 
  TrendingUp, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  User,
  Calendar,
  FileText,
  LogIn
} from 'lucide-react'

interface Paper {
  id: string
  title: string
  description: string | null
  file_url: string
  file_name: string
  author_id: string
  created_at: string
  view_count: number
  likes: any[]
  comments: any[]
  likeCount?: number
  userLiked?: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [papers, setPapers] = useState<Paper[]>([])
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('trending')
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalUsers: 0,
    totalLikes: 0
  })
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchStats()
    // Always fetch papers, regardless of authentication status
    fetchPapers()
  }, [])

  useEffect(() => {
    // Refetch papers when tab changes or user state changes
    fetchPapers()
  }, [activeTab, user])

  useEffect(() => {
    filterPapers()
  }, [papers, searchQuery])

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    // Don't redirect if no user - allow browsing without authentication
    setUser(user)
  }

  const fetchStats = async () => {
    try {
      const [
        { count: totalPapers },
        { count: totalUsers },
        { count: totalLikes }
      ] = await Promise.all([
        supabase.from('papers').select('*', { count: 'exact', head: true }),
        supabase.from('papers').select('author_id', { count: 'exact', head: true }),
        supabase.from('likes').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalPapers: totalPapers || 0,
        totalUsers: totalUsers || 0,
        totalLikes: totalLikes || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPapers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('papers')
        .select(`
          *,
          likes (user_id, created_at),
          comments (id)
        `)

      if (activeTab === 'trending') {
        // Trending: papers with most likes in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        query = query
          .gte('created_at', twentyFourHoursAgo)
          .order('created_at', { ascending: false })
      } else {
        // Recent: newest papers first
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(20)

      if (error) throw error

      // Process papers and sort trending by like count
      let processedPapers = (data || []).map(paper => ({
        ...paper,
        likeCount: paper.likes?.length || 0,
        userLiked: user ? paper.likes?.some((like: any) => like.user_id === user.id) : false
      }))

      if (activeTab === 'trending') {
        processedPapers = processedPapers.sort((a, b) => b.likeCount - a.likeCount)
      }

      setPapers(processedPapers)
    } catch (error) {
      console.error('Error fetching papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPapers = () => {
    if (!searchQuery.trim()) {
      setFilteredPapers(papers)
      return
    }

    const filtered = papers.filter(paper => 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredPapers(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading && papers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Best Papers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                  <LogoutButton />
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Publications
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover exceptional academic work from students at top universities. Find 
            inspiration, learn from peers, and explore cutting-edge research.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search Papers, Authors, or Topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-base"
              />
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Select defaultValue="all-grades">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-grades">All Grades</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-schools">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-schools">All Schools</SelectItem>
                  <SelectItem value="northeastern">Northeastern</SelectItem>
                  <SelectItem value="mit">MIT</SelectItem>
                  <SelectItem value="harvard">Harvard</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-courses">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-courses">All Courses</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Your Paper Now
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In to Publish
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="trending" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Trending Papers
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most liked papers in the last 24 hours
              </p>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Recently Published
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Latest papers from the community
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Papers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No papers found' : 'No papers yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or filters.'
                : 'Be the first to share your research with the community!'
              }
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href={user ? "/upload" : "/login"}>
                  {user ? (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Paper
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to Upload
                    </>
                  )}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Anonymous University • CS101
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight mb-2">
                    <Link 
                      href={`/paper/${paper.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {paper.title}
                    </Link>
                  </CardTitle>
                  {paper.description && (
                    <CardDescription className="line-clamp-3 text-sm">
                      {paper.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      Final Paper
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      A
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {paper.view_count}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {paper.likes?.length || 0}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {paper.comments?.length || 0}
                      </div>
                    </div>
                    <span>{formatDate(paper.created_at)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <LikeButton
                      paperId={paper.id}
                      initialLiked={paper.userLiked || false}
                      initialCount={paper.likes?.length || 0}
                      currentUserId={user?.id}
                      variant="compact"
                    />
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/paper/${paper.id}`}>
                        Read more →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.totalPapers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Papers
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Researchers
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.totalLikes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}