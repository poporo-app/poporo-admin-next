import { inviteAction } from '@/actions/inviteAction'
import InviteListCard from '@/app/components/Invite/InviteListCard'
import PageTitle from '@/app/components/PageTitle/PageTitle'

const InvitePage = async () => {
  // 初回データ取得
  const initialState = await inviteAction({ results: [] }, new FormData())
  return (
    <div className="h-screen overflow-auto bg-gray-200 pt-4">
      <PageTitle title="招待情報一覧" />
      <InviteListCard initialState={initialState} />
    </div>
  )
}

export default InvitePage
