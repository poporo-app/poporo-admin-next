'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'

export interface SearchState {
  query?: string
  category?: string
  isApply?: string
  sort?: string
  results: SalonUser[]
  totalCount?: number
  lastVisible?: string | null
  hasMore?: boolean
  message?: string
}

export async function searchAction(prevState: any, formData: FormData): Promise<SearchState> {
  const searchParams = extractSearchParams(formData)
  const url = generateSearchUrl(searchParams)
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
    const newResults = resJson.users
    const results = formData.get('lastVisible') ? [...prevState.results, ...newResults] : newResults

    return {
      ...searchParams,
      lastVisible: resJson.lastVisible,
      hasMore: resJson.hasMore,
      results: results,
      totalCount: resJson.totalCount,
      message: 'ok',
    }
  } catch (error) {
    return { ...searchParams, results: [], message: (error as Error).message }
  }
}

function extractSearchParams(formData: FormData): UserSearchParams {
  return {
    query: (formData.get('query') as string) || undefined,
    category: (formData.get('category') as string) || undefined,
    isApply: (formData.get('isApply') as string) || undefined,
    sort: (formData.get('sort') as string) || undefined,
    lastVisible: (formData.get('lastVisible') as string) || undefined,
    limit: Number(formData.get('limit')) || 10,
  }
}

function generateSearchUrl(params: UserSearchParams): string {
  const baseUrl = `${process.env.API_URL}/user`
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value)
    }
  })

  return `${baseUrl}?${searchParams.toString()}`
}
