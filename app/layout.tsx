import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Restaurant Growth OS Checklist',
  description: 'A comprehensive growth checklist for restaurant success',
  keywords: 'restaurant, growth, checklist, marketing, business',
  authors: [{ name: 'Restaurant Growth OS' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100`}>
        {children}
      </body>
    </html>
  )
} 