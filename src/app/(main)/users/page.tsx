import { searchAction } from '@/actions/searchAction'
import PageTitle from '@/app/components/PageTitle/PageTitle'
import UserListCard from '@/app/components/Users/UserListCard'

const UsersPage = async () => {
  // 初回データ取得
  const initialState = await searchAction({ results: [] }, new FormData())
  return (
    <div className="h-screen overflow-auto bg-gray-200 pt-4">
      <PageTitle title="サロン情報一覧" />
      <UserListCard initialState={initialState} />
    </div>
  )
}

export default UsersPage
