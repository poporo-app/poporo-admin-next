'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'

export interface InviteSearchState {
  query?: string
  sort?: string
  results: InviteUsers[]
  totalCount?: number
  lastVisible?: string | null
  hasMore?: boolean
  message?: string
}

export interface InviteDoApprovedState {
  results: boolean
  message?: string
}

export async function inviteAction(prevState: any, formData: FormData): Promise<InviteSearchState> {
  const session = await getServerSession(authOptions)
  const searchParams = extractSearchParams(formData)
  const url = generateSearchUrl(searchParams)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.firebaseToken}`,
    },
    cache: 'no-cache',
  })
  const resJson = await res.json()
  const newResults = resJson.inviteUsers
  const results = formData.get('lastVisible') ? [...prevState.results, ...newResults] : newResults
  // console.log(resJson.inviteUsers)

  return {
    ...searchParams,
    lastVisible: resJson.lastVisible,
    hasMore: resJson.hasMore,
    results: results,
    totalCount: resJson.totalCount,
  }
}

export async function doApproved(
  prevState: any,
  formData: FormData
): Promise<InviteDoApprovedState> {
  const session = await getServerSession(authOptions)
  const res = await fetch(`${process.env.API_URL}/invite`, {
    method: 'POST',
    body: JSON.stringify({
      targetUid: formData.get('targetUid'),
      inviteUid: formData.get('fromUid'),
      inviteDocId: formData.get('inviteId'),
    }),
    headers: {
      Authorization: `Bearer ${session?.user?.firebaseToken}`,
    },
    cache: 'no-cache',
  })

  const result = await res.json()
  if (result.success === 'ok') {
    await fetch(`${process.env.PUSH_SUBMIT_FROM_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        body: 'POPOROの審査が完了しました',
        token: result.fcmToken,
      }),
    })
  }
  return {
    results: true,
    message: '',
  }
}

function extractSearchParams(formData: FormData): UserSearchParams {
  return {
    query: (formData.get('query') as string) || undefined,
    isApply: (formData.get('isApply') as string) || undefined,
    lastVisible: (formData.get('lastVisible') as string) || undefined,
    limit: Number(formData.get('limit')) || 10,
  }
}

function generateSearchUrl(params: UserSearchParams): string {
  const baseUrl = `${process.env.API_URL}/invite`
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value)
    }
  })

  return `${baseUrl}?${searchParams.toString()}`
}
