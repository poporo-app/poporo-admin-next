'use client'
import { useFormState } from 'react-dom'

import Modal from 'react-modal'
import UserListForms from './UserListForms/UserListForms'
import { searchAction, SearchState } from '@/actions/searchAction'
import UserListTable from './UserListTable/UserListTable'
import { useEffect } from 'react'

interface UserListCardProps {
  initialState: SearchState
}

const UserListCard = ({ initialState }: UserListCardProps) => {
  // レンダリング時のエラー回避
  useEffect(() => {
    Modal.setAppElement('.App')
  }, [])
  const [state, formAction] = useFormState(searchAction, initialState)
  return (
    <div className="w-[95%] bg-white h-screen overflow-auto mx-auto rounded-md drop-shadow-md pb-10">
      <UserListForms state={state} formAction={formAction} />
      <UserListTable state={state} formAction={formAction} />
    </div>
  )
}

export default UserListCard
