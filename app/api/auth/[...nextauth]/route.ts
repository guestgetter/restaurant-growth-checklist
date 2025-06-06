import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Restrict access to authorized users only
      if (account?.provider === 'google' && user.email) {
        // List of allowed email addresses/domains
        const allowedUsers = [
          // Guest Getter team members
          'kyle@guestgetter.com',
          'kyle@guestgetter.co',
          // Add more team emails here
          
          // Restaurant client emails
          'manager@komarestaurant.com',
          'owner@komarestaurant.com', 
          'info@komarestaurant.com',
          // Add more restaurant client emails as needed
        ]
        
        // Allowed domains (for organizations)
        const allowedDomains = [
          '@guestgetter.com',
          '@guestgetter.co',
          // Add client organization domains here
          // '@komarestaurant.com',
        ]
        
        // Check if user email is in allowed list
        const isAllowedUser = user.email ? allowedUsers.includes(user.email) : false
        
        // Check if user domain is in allowed domains
        const isAllowedDomain = allowedDomains.some(domain => 
          user.email?.endsWith(domain) || false
        )
        
        if (isAllowedUser || isAllowedDomain) {
          return true
        } else {
          // Reject unauthorized users
          console.log(`Access denied for: ${user.email || 'unknown email'}`)
          return false
        }
      }
      
      return false // Reject all other providers
    },
    async session({ session, token }) {
      // Add user role and client access to session
      if (session.user?.email) {
        // Check if user is a Guest Getter team member
        const guestGetterEmails = [
          '@guestgetter.com',
          '@guestgetter.co',
          'kyle@guestgetter.com',
          'kyle@guestgetter.co',
        ]
        
        const isTeamMember = guestGetterEmails.some(domain => 
          session.user?.email?.includes(domain)
        )
        
        if (isTeamMember) {
          // Team members get full access to all clients
          session.user.role = 'team'
          session.user.allowedClients = 'all' // Can access all clients
        } else {
          // Restaurant clients get access only to their specific restaurant
          session.user.role = 'client'
          
          // Map client emails to their restaurant client IDs
          const clientMapping: { [email: string]: string } = {
            // Add restaurant client email mappings here
            'manager@komarestaurant.com': 'koma-restaurant',
            'owner@komarestaurant.com': 'koma-restaurant',
            'info@komarestaurant.com': 'koma-restaurant',
            // Add more restaurant mappings as needed
            // 'owner@restaurant2.com': 'restaurant-2-id',
          }
          
          const allowedClientId = clientMapping[session.user.email]
          session.user.allowedClients = allowedClientId || null
        }
        
        session.user.id = token.sub || ''
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 