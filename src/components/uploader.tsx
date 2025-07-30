'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { fireConfetti } from '@/lib/confetti'

interface UploadResponse {
  url: string
  filename: string
  size: number
}

interface UploaderProps {
  onUploadSuccess?: (response: UploadResponse) => void
}

export default function Uploader({ onUploadSuccess }: UploaderProps) {
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initDropzone = async () => {
      const Dropzone = (await import('dropzone')).default
      
      if (!dropzoneRef.current) return

      // Disable auto discover
      Dropzone.autoDiscover = false

      const dropzone = new Dropzone(dropzoneRef.current, {
        url: '/api/upload',
        acceptedFiles: '.pdf,.doc,.docx',
        maxFilesize: 25, // MB
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: '',
        dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
        dictInvalidFileType: 'You can\'t upload files of this type.',
        dictRemoveFile: '×',
        clickable: true,
        createImageThumbnails: false,
      })

      dropzone.on('addedfile', (file: File) => {
        setUploadedFile(file)
        setError(null)
        setIsUploading(true)
        setUploadProgress(0)
      })

      dropzone.on('removedfile', () => {
        setUploadedFile(null)
        setUploadProgress(0)
        setIsUploading(false)
        setError(null)
        setUploadSuccess(false)
      })

      dropzone.on('uploadprogress', (file: File, progress: number) => {
        setUploadProgress(progress)
      })

      dropzone.on('success', (file: File, response: UploadResponse) => {
        setIsUploading(false)
        setUploadSuccess(true)
        fireConfetti()
        onUploadSuccess?.(response)
      })

      dropzone.on('error', (file: File, errorMessage: string) => {
        setIsUploading(false)
        setError(errorMessage)
        setTimeout(() => setError(null), 5000)
      })

      return () => {
        dropzone.destroy()
      }
    }

    initDropzone()
  }, [onUploadSuccess])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      dropzoneRef.current?.click()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={dropzoneRef}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`
          border-2 border-dashed border-neutral-300 rounded-2xl p-10 md:p-12 
          bg-white/60 backdrop-blur-sm shadow-sm
          transition-all duration-200 cursor-pointer
          ${isDragOver ? 'border-blue-400 bg-blue-50/60' : ''}
          ${error ? 'border-red-400 bg-red-50/60' : ''}
          ${uploadSuccess ? 'border-green-400 bg-green-50/60' : ''}
        `}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Upload className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF]" />
          </div>
          
          <h3 className="font-semibold text-lg mb-2">
            Drag & Drop Your Paper
          </h3>
          
          <p className="text-sm text-neutral-600 mb-4">
            {uploadSuccess 
              ? "Uploaded! Verified and ready to publish."
              : "Instant preview and verification."
            }
          </p>

          {uploadedFile && (
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {isUploading && (
                  <div className="ml-4 flex-1 max-w-xs">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm mt-2" aria-live="polite">
              {error}
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4">
              <button
                onClick={() => window.location.href = `/publish?file=${encodeURIComponent(uploadedFile?.name || '')}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Continue to Publish →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 