import { INVITE_POINT } from '@/constants/appInfo'
import admin from '@/lib/firebaseAdmin'
import { withAuth } from '@/lib/withAuth'
import { firestore } from 'firebase-admin'
import { Query, CollectionReference, WhereFilterOp } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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
    const inviteUsersCollection = db.collection('invite_users') as CollectionReference

    let inviteUsersQuery: Query = inviteUsersCollection

    // クエリパラメーターが存在する場合、フィルタリングを適用
    inviteUsersQuery = _buildQuery(inviteUsersQuery, params)
    const totalCount = await getTotalCount(inviteUsersQuery)

    const limit = Number(params.limit) || 10
    inviteUsersQuery = inviteUsersQuery.limit(limit + 1) // 1つ多く取得して次ページの有無を確認

    if (params.lastVisible) {
      const lastVisibleDoc = await inviteUsersCollection.doc(params.lastVisible).get()
      if (lastVisibleDoc.exists) {
        inviteUsersQuery = inviteUsersQuery.startAfter(lastVisibleDoc)
      }
    }

    const snapshot = await inviteUsersQuery.where('isInvite', '==', true).get()
    let inviteUsersArray = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const inviteUserData = doc.data() as InviteUsers
        inviteUserData.id = doc.id

        // uidに紐付く招待したユーザー（inviteUser）を取得
        const inviteUserDoc = await usersCollection.doc(inviteUserData.uid).get()
        if (inviteUserDoc.exists) {
          inviteUserData.inviteUser = { id: inviteUserDoc.id, ...inviteUserDoc.data() } as SalonUser
        }

        // invitationCodeに紐付く招待されたユーザー（targetUser）を取得
        if (inviteUserData.invitationCode) {
          const targetUserSnapshot = await usersCollection
            .where('invitationCode', '==', inviteUserData.invitationCode)
            .limit(1)
            .get()
          if (!targetUserSnapshot.empty) {
            const targetUserDoc = targetUserSnapshot.docs[0]
            inviteUserData.targetUser = {
              id: targetUserDoc.id,
              ...targetUserDoc.data(),
            } as SalonUser
          }
        }

        return inviteUserData
      })
    )

    const hasMore = inviteUsersArray.length > limit
    if (hasMore) {
      inviteUsersArray = inviteUsersArray.slice(0, limit) // 余分に取得した1件を削除
    }

    const lastVisible =
      inviteUsersArray.length > 0 ? inviteUsersArray[inviteUsersArray.length - 1].id : null

    return NextResponse.json({
      message: 'ユーザー取得成功',
      inviteUsers: inviteUsersArray,
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
  // 小規模なコレクションの場合
  const snapshot = await usersQuery.get()
  return snapshot.size

  // 大規模なコレクションの場合（非推奨だが、他に選択肢がない場合）
  // return (await usersQuery.count().get()).data().count
}

// 審査処理 point+30000 isApproved: true ポイント履歴更新
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { targetUid, inviteUid } = body

    const db = admin.firestore()
    const userRef = db.collection('user').doc(inviteUid)
    const targetUserRef = db.collection('user').doc(targetUid)

    // トランザクションを使用してポイントを更新
    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef)
      const targetUserDoc = await transaction.get(targetUserRef)

      if (!userDoc.exists) {
        throw new Error('ユーザーが見つかりません')
      }
      if (!targetUserDoc.exists) {
        throw new Error('対象ユーザーが見つかりません')
      }

      const userData = userDoc.data() as SalonUser
      const targetUserData = targetUserDoc.data() as SalonUser

      const currentPoints = userData.point || 0
      const newPoints = currentPoints + INVITE_POINT

      const pointHistoryId = uuidv4()
      const pointHistoryData: PointHistory = {
        id: pointHistoryId,
        point: 30000,
        type: 'invite',
        createdAt: firestore.Timestamp.now(),
      }

      transaction.update(userRef, { point: newPoints })

      // targetUserのisApproved更新
      transaction.update(targetUserRef, { isApproved: true })

      const pointHistoryRef = userRef.collection('point_history').doc(pointHistoryId)
      transaction.set(pointHistoryRef, pointHistoryData)

      // invite_usersドキュメントの削除
      // transaction.delete(inviteUserRef)

      return {
        oldPoints: currentPoints,
        newPoints: newPoints,
        pointHistoryAdded: true,
        targetUserUpdated: true,
        pointHistoryId: pointHistoryId,
        fcmToken: targetUserData.fcmToken,
      }
    })

    return NextResponse.json({
      message: '更新成功',
      success: 'ok',
      updatedPoints: result.newPoints,
      pointHistoryAdded: result.pointHistoryAdded,
      targetUserApproved: result.targetUserUpdated,
      fcmToken: result.fcmToken,
    })
  } catch (error) {
    console.error('更新中にエラーが発生しました:', error)
    return NextResponse.json(
      {
        message: '更新に失敗しました',
        success: 'ng',
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    )
  }
})
