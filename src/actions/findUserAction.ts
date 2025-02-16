'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'

interface UserResponse {
  message: string
  user?: SalonUser
  error?: string
}

export async function getUserById(id: string): Promise<UserResponse> {
  console.log('aaaabbbbb')
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.firebaseToken) {
      throw new Error('認証エラー: ユーザーセッションが無効です')
    }
    console.log(session)
    // APIのベースURLを環境変数から取得（開発/本番環境で切り替え可能に）
    const response = await fetch(`${process.env.API_URL}/find-user?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.firebaseToken}`,
      },
      cache: 'no-store', // 常に最新のデータを取得
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        message: errorData.message || 'ユーザー取得に失敗しました',
        error: errorData.message,
      }
    }

    const data = await response.json()
    return {
      message: data.message,
      user: data.user,
    }
  } catch (error) {
    console.error('Error in getUserById:', error)
    return {
      message: 'ユーザー取得に失敗しました',
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    }
  }
}
