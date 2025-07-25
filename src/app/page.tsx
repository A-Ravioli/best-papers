export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Best Papers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A simple platform for sharing and discovering academic papers and research writing. 
            Upload your work, discover others' research, and engage with the academic community.
          </p>
          
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Upload PDFs and documents</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Like, comment, and engage</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Discover trending research</span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a 
              href="/login"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block text-center"
            >
              Sign In with Email
            </a>
            <a 
              href="#features"
              className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}