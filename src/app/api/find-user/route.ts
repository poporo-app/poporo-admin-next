import admin from '@/lib/firebaseAdmin'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('id')
    console.log('user id test', userId)

    if (!userId) {
      return NextResponse.json({ message: 'ユーザーIDが必要です' }, { status: 400 })
    }

    const db = admin.firestore()
    const userDoc = await db.collection('user').doc(userId).get()
    console.log('test userDoc', userDoc)

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const userData = {
      id: userDoc.id,
      ...userDoc.data(),
    }
    console.log('test user', userData)

    return NextResponse.json({
      message: 'ユーザー取得成功',
      user: userData,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ message: 'ユーザー取得に失敗しました' }, { status: 500 })
  }
})
