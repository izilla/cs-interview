import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { JWT } from 'next-auth/jwt'
import { env } from 'process'

export const authOptions = {
  callbacks: {
    session({ session, token, user }: { session: any; token: JWT; user: User }) {
      return session
    }
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'johnsmith@foo.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, request): Promise<User | null> {
        const client = new PrismaClient()
        const user = await client.users.findFirst({
          where: {
            email: credentials?.username,
            password_plain: credentials?.password
          }
        })

        if (user) {
          client.$disconnect()
          return {
            id: '' + user.id,
            name: user.name,
            email: user.email
          }
        } else {
          return null
        }
      }
    })
  ]
}

export default NextAuth(authOptions)
