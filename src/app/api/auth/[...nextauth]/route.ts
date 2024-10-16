import NextAuth from 'next-auth/next'
import { authOptions } from '@/config/auth'
import { NextApiRequest, NextApiResponse } from 'next'

async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    ...authOptions,
  })
}

export { auth as GET, auth as POST }
