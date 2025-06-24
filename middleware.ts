import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow these specific API routes to be public
    const publicRoutes = [
      '/api/auth',
      '/api/debug'
    ]
    
    const isPublicRoute = publicRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )
    
    // If it's a public route, allow it through
    if (isPublicRoute) {
      return NextResponse.next()
    }
    
    // For all other API routes, require authentication
    if (req.nextUrl.pathname.startsWith('/api/')) {
      if (!req.nextauth.token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to check auth in middleware
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/api/((?!auth).*)',
    '/dashboard/:path*',
    '/checklist/:path*',
    '/client-profile/:path*',
    '/client/:path*',
    '/reports/:path*',
    '/settings/:path*'
  ]
} 