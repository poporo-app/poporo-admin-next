import { firestore } from 'firebase-admin'
import admin from '@/lib/firebaseAdmin'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { uid, type, point } = body

    const db = admin.firestore()
    const userRef = db.collection('user').doc(uid)

    // トランザクションを使用してポイントを更新
    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef)

      if (!userDoc.exists) {
        throw new Error('ユーザーが見つかりません')
      }

      const userData = userDoc.data() as SalonUser

      const currentPoints = userData.point || 0
      let newPoint = 0
      let message = ''
      const persePoint = parseInt(point, 10)
      if (type === 'plus') {
        newPoint = currentPoints + persePoint
        message = 'ポイントを追加しました。'
      } else if (type === 'minus') {
        newPoint = currentPoints - persePoint
        message = 'ポイントを減らしました'
      } else {
        throw new Error('不正な操作が行われました')
      }

      if (newPoint < 0) {
        throw new Error('ポイントの値が不正です')
      }

      const pointHistoryId = uuidv4()
      const pointHistoryData: PointHistory = {
        id: pointHistoryId,
        point: point,
        type: 'operation',
        createdAt: firestore.Timestamp.now(),
      }

      transaction.update(userRef, { point: newPoint })

      const pointHistoryRef = userRef.collection('point_history').doc(pointHistoryId)
      transaction.set(pointHistoryRef, pointHistoryData)

      return {
        newPoints: newPoint,
        type: type,
        message: message,
      }
    })

    return NextResponse.json({
      message: result.message,
      success: 'ok',
      point: result.newPoints,
    })
  } catch (error) {
    console.error('更新中にエラーが発生しました:', error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : '更新に失敗しました',
        success: 'ng',
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    )
  }
})
