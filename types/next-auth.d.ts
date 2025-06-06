import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'team' | 'client'
      allowedClients: 'all' | string | null
    }
  }

  interface User {
    role?: 'team' | 'client'
    allowedClients?: 'all' | string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: 'team' | 'client'
  }
} 