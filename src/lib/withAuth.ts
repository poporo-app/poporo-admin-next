import { NextRequest, NextResponse } from 'next/server'

type RouteHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse

// 認証を行うラッパー関数
export const withAuth = (handler: RouteHandler): RouteHandler => {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      )
    }

    try {
      return handler(req) // 認証が成功した場合にハンドラを呼び出す
    } catch (error) {
      return NextResponse.json({ message: 'Token verification failed' }, { status: 403 })
    }
  }
}
