import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    firebaseToken?: string
  }
  interface Session extends DefaultSession {
    user?: {
      id: string
      email?: string
      firebaseToken?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    firebaseToken?: string // firebaseToken をJWTトークンに追加
  }
}
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string | unknown
//       name?: string | null
//       email?: string | null
//       image?: string | null
//     }
//   }
// }
