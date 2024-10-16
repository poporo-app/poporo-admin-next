import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getIdToken, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const secret = process.env.NEXTAUTH_SECRET

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credentials not provided')
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
          const user = userCredential.user
          // FirebaseのIDトークンを取得
          const idToken = await getIdToken(user)
          return { id: user.uid, email: user.email, firebaseToken: idToken }
        } catch (error) {
          console.error('Error during authentication:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firebaseToken = user.firebaseToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.firebaseToken = token.firebaseToken
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin', // カスタムサインインページのパス
  },
}
