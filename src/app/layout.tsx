import type { Metadata } from 'next'
<<<<<<< HEAD
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
=======
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
>>>>>>> 135d673a134d02d5b911721946789efc39855132

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
<<<<<<< HEAD
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>{children}</body>
=======
      <body className={inter.className}>{children}</body>
>>>>>>> 135d673a134d02d5b911721946789efc39855132
    </html>
  )
}