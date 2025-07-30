'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Uploader from './uploader'

export default function Hero() {
  const scrollToUploader = () => {
    const uploaderElement = document.getElementById('uploader')
    if (uploaderElement) {
      uploaderElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Focus the uploader after scrolling
      setTimeout(() => {
        const dropzoneElement = uploaderElement.querySelector('[role="button"]') as HTMLElement
        if (dropzoneElement) {
          dropzoneElement.focus()
        }
      }, 1000)
    }
  }

  return (
    <section className="w-full bg-bp-bg py-16 md:py-20 lg:py-24">
      <div className="max-w-[1152px] mx-auto px-6 md:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="font-fraunces font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-bp-text mb-6 leading-tight">
            Turn Your Best Papers into
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF]">
              Career Ready Opportunities
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Instantly publish your top coursework, attract professors & recruiters, and build your personal brand—without fear or friction.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="rounded-full px-6 md:px-8 py-3 md:py-3.5 bg-black text-white hover:bg-neutral-800 font-medium"
            >
              <Link href="/browse">
                Explore Top Papers
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="rounded-full px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF] text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              onClick={scrollToUploader}
            >
              <Link href="#uploader">
                Publish Your Paper
              </Link>
            </Button>
          </div>
          
          {/* Uploader */}
          <div id="uploader" className="mt-12">
            <Uploader />
          </div>
        </div>
      </div>
    </section>
  )
} 