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
    const params = Object.fromEntries(url.searchParams) as UserSearchParams

    const db = admin.firestore()

    const usersCollection = db.collection('user') as CollectionReference
    let usersQuery: Query = usersCollection

    // クエリパラメーターが存在する場合、フィルタリングを適用
    usersQuery = _buildQuery(usersQuery, params)
    const totalCount = await getTotalCount(usersQuery)

    const limit = Number(params.limit) || 10
    usersQuery = usersQuery.limit(limit + 1) // 1つ多く取得して次ページの有無を確認

    if (params.lastVisible) {
      const lastVisibleDoc = await usersCollection.doc(params.lastVisible).get()
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
      message: 'ユーザー取得成功',
      users: usersArray,
      lastVisible,
      hasMore,
      totalCount,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'ユーザー取得に失敗しました' }, { status: 500 })
  }
})

// 検索条件を付け足す
function _buildQuery(usersQuery: Query, params: UserSearchParams): Query {
  const conditions: QueryCondition[] = []

  // 名前検索
  if (params.query) {
    conditions.push({
      field: 'name',
      operator: '>=',
      value: params.query,
    })
    conditions.push({
      field: 'name',
      operator: '<=',
      value: params.query + '\uf8ff',
    })
  }

  // カテゴリ検索
  if (params.category) {
    const numCate = Number(params.category)
    conditions.push({
      field: 'categories',
      operator: 'array-contains',
      value: numCate,
    })
  }

  // 申請状態検索
  if (params.isApply) {
    const isApply = params.isApply === '1' ? true : false
    conditions.push({
      field: 'isApproved',
      operator: '==',
      value: isApply,
    })
  }

  // クエリに条件を適用
  conditions.forEach((condition) => {
    usersQuery = usersQuery.where(condition.field, condition.operator, condition.value)
  })

  switch (params.sort) {
    case 'created_asc':
      usersQuery = usersQuery.orderBy('createdAt', 'asc')
      break
    case 'created_desc':
      usersQuery = usersQuery.orderBy('createdAt', 'desc')
      break
    // 他のソートオプションをここに追加できます
    default:
      // デフォルトは登録順（降順）
      usersQuery = usersQuery.orderBy('createdAt', 'desc')
  }

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
