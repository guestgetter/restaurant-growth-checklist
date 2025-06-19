import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import AuthWrapper from '../components/AuthWrapper'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Growth OS - Restaurant Growth Platform',
  description: 'Comprehensive restaurant growth management platform with checklist, analytics, and insights',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50 dark:bg-slate-900`}>
        <ErrorBoundary>
          <Providers session={session}>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
} 