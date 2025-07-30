import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PublishPage({
  searchParams,
}: {
  searchParams: { file?: string }
}) {
  const fileName = searchParams.file ? decodeURIComponent(searchParams.file) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Best Papers
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  Our Services
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

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Publish Your Paper
            </h1>
            <p className="text-lg text-gray-600">
              Share your academic work with the community.
            </p>
          </div>

          {fileName && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Uploaded File</h2>
              <p className="text-gray-600 mb-4">
                File: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{fileName}</span>
              </p>
              <p className="text-sm text-gray-500">
                Your file has been uploaded successfully and is ready for publishing.
              </p>
            </div>
          )}

          {/* Placeholder for publish form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Paper Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your paper title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract
                </label>
                <textarea
                  placeholder="Brief description of your paper"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Area
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a subject area</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="engineering">Engineering</option>
                  <option value="economics">Economics</option>
                  <option value="psychology">Psychology</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button className="bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF] text-white">
                Publish Paper
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Publishing functionality coming soon...
            </p>
            <Button asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 