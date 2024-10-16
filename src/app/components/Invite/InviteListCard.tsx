'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import Modal from 'react-modal'

import { InviteSearchState, inviteAction } from '@/actions/inviteAction'
import InviteListTable from './InviteListTable/InviteListTable'
import InviteListForms from './InviteListForms/InviteListForms'

interface InviteListCardProps {
  initialState: InviteSearchState
}

const InviteListCard = ({ initialState }: InviteListCardProps) => {
  useEffect(() => {
    Modal.setAppElement('.App')
  }, [])

  const [state, formAction] = useFormState(inviteAction, initialState)
  return (
    <div className="w-[95%] bg-white h-screen overflow-auto mx-auto rounded-md drop-shadow-md pb-10">
      <InviteListForms state={state} formAction={formAction} />
      <InviteListTable state={state} formAction={formAction} />
    </div>
  )
}

export default InviteListCard
