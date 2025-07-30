'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Heart, MessageCircle, TrendingUp, Users, Download, Search, Upload, BookOpen, Star, ArrowRight, Eye } from 'lucide-react'
<<<<<<< HEAD
import Hero from '@/components/hero'
=======
>>>>>>> 135d673a134d02d5b911721946789efc39855132

export default function LandingPage() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Frosted Blur Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Best Papers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  Our Services
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  Browse Papers
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* New Hero Section */}
      <Hero />
=======
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              🚀 Academic Research Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Discover, Share & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Collaborate
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Browse exceptional academic work from students at top universities. No account needed to explore research - 
            sign in only when you&apos;re ready to share your own work or join the discussion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <Eye className="mr-2 h-4 w-4" />
                Browse Papers Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/login">
                <Upload className="mr-2 h-4 w-4" />
                Sign In to Publish
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-sm text-gray-600">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Active Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Research Fields</div>
            </div>
          </div>
        </div>
      </section>
>>>>>>> 135d673a134d02d5b911721946789efc39855132

      <Separator className="mx-auto max-w-6xl" />

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-white mb-4">
              Open access to academic excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore research freely, contribute when inspired. Our platform welcomes both casual browsers and active contributors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Browse Freely</CardTitle>
                <CardDescription>
                  No account required to explore papers. Browse, search, and discover academic work from top universities instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy Upload & Share</CardTitle>
                <CardDescription>
                  Sign in to upload PDFs, Word docs, and research papers with drag-and-drop simplicity. Share your work with the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Social Engagement</CardTitle>
                <CardDescription>
                  Like papers and join discussions. Create an account to interact with research and connect with fellow academics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Trending Research</CardTitle>
                <CardDescription>
                  Discover what&apos;s popular in your field. Our algorithm surfaces the most engaging papers from the past 24 hours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>In-Browser Reading</CardTitle>
                <CardDescription>
                  Read papers directly in your browser with our native PDF viewer. No downloads required for quick reviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Download & Reference</CardTitle>
                <CardDescription>
                  Download papers for offline reading and get proper citation formats for your own research work.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start exploring in seconds
            </h2>
            <p className="text-lg text-gray-600">
              No barriers to discovery, optional registration for contribution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Immediately</h3>
                              <p className="text-gray-600">
                  Start exploring papers right away. Search, filter, and discover research without any registration.
                </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign In When Ready</h3>
                              <p className="text-gray-600">
                  Create an account only when you want to upload papers, like content, or join discussions.
                </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share & Engage</h3>
                              <p className="text-gray-600">
                  Upload your research, engage with others&apos; work, and become part of the academic community.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to explore academic excellence?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of researchers and students discovering and sharing breakthrough research on Best Papers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/dashboard">
                  Start Browsing Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-blue-600 border-white hover:bg-white hover:text-blue-600">
                <Link href="/login">
                  Sign In to Contribute
                  <Upload className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
                      <div className="text-center text-gray-600">
            <p>&copy; 2024 Best Papers. Open access to academic research.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}