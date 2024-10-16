'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'

export interface PointState {
  point: number
  type: string
  message: string
}

export async function pointAction(prevState: any, formData: FormData): Promise<PointState> {
  const session = await getServerSession(authOptions)
  console.log(formData.get('type'))
  const res = await fetch(`${process.env.API_URL}/point`, {
    method: 'POST',
    body: JSON.stringify({
      uid: formData.get('uid'),
      type: formData.get('type'),
      point: formData.get('point'),
    }),
    headers: {
      Authorization: `Bearer ${session?.user?.firebaseToken}`,
    },
    cache: 'no-cache',
  })

  const result = await res.json()

  return {
    point: result.point,
    type: result.type,
    message: result.message,
  }
}
