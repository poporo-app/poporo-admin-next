import admin from '@/lib/firebaseAdmin'
import { withAuth } from '@/lib/withAuth'
import { Query, CollectionReference, WhereFilterOp } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface QueryCondition {
  field: string
  operator: WhereFilterOp
  value: unknown
}

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    console.log(url)
    const params = Object.fromEntries(url.searchParams) as PointHistoryParams

    const db = admin.firestore()

    const pointHistoryRef = db.collection(`user/${params.uid}/point_history`)
    // const usersCollection = db.collection('user') as CollectionReference
    console.log(pointHistoryRef)
    let usersQuery: Query = pointHistoryRef

    // point交換タイプでフィルタリング
    usersQuery = _buildQuery(usersQuery)
    const totalCount = await getTotalCount(usersQuery)
    console.log(totalCount)

    const limit = Number(params.limit) || 10
    usersQuery = usersQuery.limit(limit + 1) // 1つ多く取得して次ページの有無を確認

    if (params.lastVisible) {
      const lastVisibleDoc = await pointHistoryRef.doc(params.lastVisible).get()
      if (lastVisibleDoc.exists) {
        usersQuery = usersQuery.startAfter(lastVisibleDoc)
      }
    }

    const snapshot = await usersQuery.get()
    let usersArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    const hasMore = usersArray.length > limit
    if (hasMore) {
      usersArray = usersArray.slice(0, limit) // 余分に取得した1件を削除
    }

    const lastVisible = usersArray.length > 0 ? usersArray[usersArray.length - 1].id : null

    return NextResponse.json({
      message: 'ポイント交換履歴取得成功',
      users: usersArray,
      lastVisible,
      hasMore,
      totalCount,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'ポイント交換履歴取得に失敗しました' }, { status: 500 })
  }
})

// 検索条件を付け足す
function _buildQuery(usersQuery: Query): Query {
  const conditions: QueryCondition[] = []

  // 名前検索
  conditions.push({
    field: 'type',
    operator: '==',
    value: 'receive',
  })

  // クエリに条件を適用
  conditions.forEach((condition) => {
    usersQuery = usersQuery.where(condition.field, condition.operator, condition.value)
  })

  return usersQuery
}

async function getTotalCount(usersQuery: FirebaseFirestore.Query): Promise<number> {
  // 方法1: 小規模なコレクションの場合
  const snapshot = await usersQuery.get()
  return snapshot.size

  // 方法2: 大規模なコレクションの場合（非推奨だが、他に選択肢がない場合）
  // return (await usersQuery.count().get()).data().count

  // 方法3: カウンタードキュメントを使用する場合
  // const counterDoc = await admin.firestore().doc('counters/users').get()
  // return counterDoc.data()?.count || 0
}
