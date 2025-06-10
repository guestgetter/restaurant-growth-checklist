'use client';

import { SessionProvider } from 'next-auth/react'
import { ClientProvider } from '../lib/ClientContext'

export function Providers({ 
  children,
  session 
}: { 
  children: React.ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <ClientProvider>
        {children}
      </ClientProvider>
    </SessionProvider>
  )
} 