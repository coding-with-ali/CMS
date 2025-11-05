import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Maintenance Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const username = credentials?.username
        const password = credentials?.password
        if (!username || !password) return null
        if (username === process.env.MAINTENANCE_USERNAME && password === process.env.MAINTENANCE_PASSWORD) {
          return { id: 'maintenance-1', name: 'Maintenance User', email: process.env.MAINTENANCE_USERNAME, role: 'maintenance' }
        }
        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || 'maintenance'
      return token
    },
    async session({ session, token }) {
      (session as any).user.role = (token as any).role
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
