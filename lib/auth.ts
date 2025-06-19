import CredentialsProvider from 'next-auth/providers/credentials'
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
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist the user data to the token
      if (user) {
        token.id = user.id;
        token.role = 'team'; // Hardcode role for this user
        token.allowedClients = 'all'; // Hardcode client access
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the data from the token to the session object
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.role = token.role ?? 'client';
        session.user.allowedClients = token.allowedClients ?? null;
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