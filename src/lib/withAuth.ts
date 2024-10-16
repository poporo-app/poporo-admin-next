import { NextResponse } from 'next/server'

// 認証を行うラッパー関数
export const withAuth = (handler: Function) => {
  return async (req: Request) => {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    try {
      return handler(req) // 認証が成功した場合にハンドラを呼び出す
    } catch (error) {
      return NextResponse.json({ message: 'Token verification failed' }, { status: 403 })
    }
  }
}
