import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const fraunces = Fraunces({ 
  subsets: ['latin'],
  weight: '700',
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: 'Best Papers - Share Your Academic Writing',
  description: 'A platform for sharing and discovering academic papers and research writing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>{children}</body>
    </html>
  )
}