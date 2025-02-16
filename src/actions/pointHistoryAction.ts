'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'

interface HistoryParams {
  uid: string
}

export interface HistoryState {
  results: PointHistory[]
  totalCount: number
  message: string
}

// 施術履歴取得
export async function pointHistoryAction(uid: string): Promise<HistoryState> {
  console.log(uid)
  // const searchParams = extractHistoryParams(formData)
  const url = generateHistoryUrl({ uid: uid })
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.firebaseToken) {
      throw new Error('認証エラー: ユーザーセッションが無効です')
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.user?.firebaseToken}`,
      },
      cache: 'no-cache',
    })

    if (!res.ok) {
      throw new Error(`APIエラー: ${res.status} ${res.statusText}`)
    }

    const resJson = await res.json()
    const results = resJson.users

    return {
      results: results,
      totalCount: resJson.totalCount,
      message: 'ok',
    }
  } catch (error) {
    return { results: [], totalCount: 0, message: (error as Error).message }
  }
}

function generateHistoryUrl(params: HistoryParams): string {
  const baseUrl = `${process.env.API_URL}/history`
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value)
    }
  })

  return `${baseUrl}?${searchParams.toString()}`
}
