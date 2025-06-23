import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.username === 'guestgetter' && credentials?.password === 'getguestsnow') {
          return {
            id: '1',
            name: 'Guest Getter Admin',
            email: 'admin@guestgetter.com',
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/business.manage',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, persist the user data to the token
      if (user) {
        token.id = user.id;
        token.role = 'team'; // Hardcode role for this user
        token.allowedClients = 'all'; // Hardcode client access
      }
      
      // Store Google access token for Business Profile API calls
      if (account?.provider === 'google') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass the data from the token to the session object
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.role = token.role ?? 'client';
        session.user.allowedClients = token.allowedClients ?? null;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
} 