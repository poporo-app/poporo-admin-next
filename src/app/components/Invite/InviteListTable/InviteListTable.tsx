'use client'
import { openModal } from '@/lib/store/modal/ModalSlice'

import { useDispatch } from 'react-redux'
import { InviteSearchState } from '@/actions/inviteAction'
import formatDate from '@/utils/customFormatDate'
import { setInvite } from '@/lib/store/invite/InviteSlice'
import InviteDetailModal from '../InviteDetailModal/InviteDetailModal'

interface InviteListTableProps {
  state: InviteSearchState
  formAction: (formData: FormData) => void
}

const tableTh = ['ID', 'サロン名', '紹介したサロン名', '登録日時']

const InviteListTable = ({ state, formAction }: InviteListTableProps) => {
  const dispatch = useDispatch()

  const loadMore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('lastVisible', state.lastVisible || '')
    formAction(formData)
  }
  return (
    <div className="App">
      <div className="mt-4 ml-6 mb-2">総件数: {state.totalCount}</div>
      <table className="table-auto w-[96%] ml-5 text-left">
        <thead>
          <tr>
            {tableTh.map((th) => (
              <th key={th} className="border-b border-[#cfd8dc] bg-[#eceff1] p-4">
                {th}
              </th>
            ))}
          </tr>
        </thead>

        {state.results.map((inviteUser) => (
          <tbody
            key={inviteUser.id}
            className="cursor-pointer hover:bg-gray-200"
            onClick={() => {
              dispatch(setInvite(inviteUser))
              return dispatch(openModal())
            }}
          >
            <tr>
              <td className="p-4 text-xs border-b border-blue-gray-50">{inviteUser.id}</td>
              <td className="p-4 text-sm border-b border-blue-gray-50">
                {inviteUser?.targetUser?.name}
              </td>
              <td className="p-4 text-sm border-b border-blue-gray-50">
                {inviteUser?.inviteUser?.name}
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                {formatDate(inviteUser?.createdAt)}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <div>
        {state.hasMore && (
          <form onSubmit={loadMore}>
            <input type="hidden" name="query" value={state.query || ''} />
            <input type="hidden" name="isApply" value={state.isApply || ''} />
            <input type="hidden" name="sort" value={state.sort || ''} />
            <button
              type="submit"
              className="mt-5 ml-6 p-2 rounded-md bg-gray-700 text-white font-bold"
            >
              さらに読み込む
            </button>
          </form>
        )}
      </div>
      <InviteDetailModal />
    </div>
  )
}

export default InviteListTable
