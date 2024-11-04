import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// JWTシークレット（Firebase認証で使うNextAuthのシークレットと同じ）
const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  // ヘルスチェックエンドポイントをスキップ
  if (req.nextUrl.pathname.startsWith('/api/health')) {
    return NextResponse.next()
  }
  // 認証トークンを取得（JWT）
  const token = await getToken({ req, secret })
  if (token) {
    // トークンが存在する場合、リクエストヘッダーにトークンを付与
    req.headers.set('Authorization', `Bearer ${token.firebaseToken}`)
  }
  const { pathname } = req.nextUrl
  // 認証が不要なページ（例: サインインページなど）はチェックをスキップ
  if (
    pathname.startsWith('/auth') || // 認証ページ
    pathname.startsWith('/api/auth') || // 認証ページ
    // pathname.startsWith('/api') || // API
    pathname.startsWith('/_next') || // Next.jsの内部ファイル
    pathname.startsWith('/favicon.ico') || // Favicon
    pathname.startsWith('/public') // public
  ) {
    return NextResponse.next()
  }

  // トークンがない（＝非ログイン状態）の場合、サインインページにリダイレクト
  if (!token) {
    const loginUrl = new URL('/auth/signin', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // ログイン状態が確認できれば次の処理へ
  return NextResponse.next()
}

// Middlewareの適用範囲
export const config = {
  matcher: ['/', '/users'], // ログインが必要なページのパスを指定
}
