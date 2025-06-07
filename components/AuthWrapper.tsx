'use client';

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from './Layout/Sidebar'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    // Allow access to sign-in page
    if (pathname === '/auth/signin') {
      if (session) {
        router.push('/')
      }
      return
    }

    // Redirect to sign-in if not authenticated
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router, pathname])

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show sign-in page if not authenticated (but only for sign-in route)
  if (!session && pathname === '/auth/signin') {
    return children
  }

  // Show loading while redirecting to sign-in
  if (!session) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  // Show authenticated app with sidebar
  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
} 