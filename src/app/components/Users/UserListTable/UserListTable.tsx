'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toJapanese } from '@/constants/appInfo'
import { openModal } from '@/lib/store/modal/ModalSlice'
import { setUser, setUserList } from '@/lib/store/user/UserSlice'
import { SearchState } from '@/actions/searchAction'
import { RootState } from '@/lib/store/store'

import UserDetailModal from '../UserDetailModal/UserDetailModal'

interface UserListTableProps {
  // searchState: SearchState
  state: SearchState
  formAction: (formData: FormData) => void
}

const tableTh = ['ID', 'サロン名', 'サロン種別', 'ポイント', '県名町名']

const UserListTable = ({ state, formAction }: UserListTableProps) => {
  const dispatch = useDispatch()
  const userList = useSelector((state: RootState) => state.user.userList)

  useEffect(() => {
    dispatch(setUserList(state.results))
  }, [dispatch, state.results])

  const handleRowClick = (user: SalonUser) => {
    dispatch(setUser(user))
    dispatch(openModal())
  }

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

        {userList.map((user) => (
          <tbody
            key={user.id}
            className="cursor-pointer hover:bg-gray-200"
            onClick={() => handleRowClick(user)}
          >
            <tr>
              <td className="p-4 text-xs border-b border-blue-gray-50">{user.id}</td>
              <td className="p-4 text-sm border-b border-blue-gray-50">{user.name}</td>
              <td className="p-4 text-sm border-b border-blue-gray-50">
                {user.categories !== null &&
                  user.categories.map((cat: number, i, row) => {
                    if (row.length - 1 !== i) {
                      return `${toJapanese(cat)},`
                    }
                    return toJapanese(cat)
                  })}
              </td>
              <td className="p-4 border-b border-blue-gray-50">{user.point}</td>
              <td className="p-4 border-b border-blue-gray-50">{user.cityName}</td>
            </tr>
          </tbody>
        ))}
      </table>
      <div>
        {state.hasMore && (
          <form onSubmit={loadMore}>
            <input type="hidden" name="query" value={state.query || ''} />
            <input type="hidden" name="category" value={state.category || ''} />
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
      <UserDetailModal />
    </div>
  )
}

export default UserListTable
