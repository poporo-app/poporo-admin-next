import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/lib/store/modal/ModalSlice'
import { IoCloseSharp } from 'react-icons/io5'
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'

import { toJapanese } from '@/constants/appInfo'
import { pref } from '@/constants/pref'
import { RootState } from '@/lib/store/store'
import Link from 'next/link'
import formatDate, { CustomTimestamp } from '@/utils/customFormatDate'
import { openPointModal } from '@/lib/store/modal/PointModalSlice'
import { openHistoryModal } from '@/lib/store/modal/HistoryModalSlice'
import UserPointModal from './UserPointModal'
import HistoryModal from './HistoryModal'
import { useFormState } from 'react-dom'
import { doApproved, InviteDoApprovedState } from '@/actions/inviteAction'
import SubmitButton from '../../Button/SubmitButton'
import { updateIsApproval } from '@/lib/store/user/UserSlice'
import { useEffect } from 'react'
import { useUserData } from '../_hooks/use-user-data'

const modalStyle = {
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    top: '5rem',
    left: '5rem',
    right: '5rem',
    bottom: '5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
}

const UserDetailModal = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const isOpen = useSelector((state: RootState) => state.modal.isOpen)
  const dispatch = useDispatch()
  // モーダルオープン時にデータを更新
  useUserData(isOpen, user.id)

  const handleSubmit = async (prevState: InviteDoApprovedState, formData: FormData) => {
    const res = await doApproved(prevState, formData)
    if (res.results) {
      dispatch(updateIsApproval({ id: user.id, approval: res.results }))
    }
    return res
  }
  const [, formAction] = useFormState(handleSubmit, { results: false, message: '' })
  return (
    <Modal isOpen={isOpen} style={modalStyle} onRequestClose={() => dispatch(closeModal())}>
      <div className="fixed w-100">
        <IoCloseSharp size={25} onClick={() => dispatch(closeModal())} className="cursor-pointer" />
      </div>
      <div className="w-[90%] mx-auto mt-6">
        <div className="w-[80%]">
          <div className="w-100 flex">
            <div className="ml-auto mr-2">
              <button
                onClick={() => dispatch(openHistoryModal())}
                className={`w-100 py-2 px-4 rounded-md text-white bg-orange-800 hover:bg-orange-300 text-sm font-semibold shadow-sm disabled:bg-gray-400`}
              >
                施術履歴
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-4">
            <div className="font-bold">サロン名</div>
            <div className="text-md">{user?.name}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">都道府県・町名</div>
            <div className="text-md">
              {user.prefCode !== undefined && pref[user.prefCode]}
              {user.cityName}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">サロン種別</div>
            <div className="text-md">
              {user.categories?.map((c, i, r) => {
                if (r.length - 1 !== i) {
                  return `${toJapanese(c)},`
                }
                return toJapanese(c)
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3 items-center">
            <div className="font-bold">ポイント</div>
            <div className="text-md">{user?.point}</div>
            <div className="flex items-center gap-2">
              <FaPlusCircle
                onClick={() => dispatch(openPointModal('plus'))}
                color="green"
                size={20}
                className="cursor-pointer"
              />
              <FaMinusCircle
                onClick={() => dispatch(openPointModal('minus'))}
                color="red"
                size={20}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">住所</div>
            <div className="text-md">
              {user.prefCode !== undefined && pref[user.prefCode]}
              {user.cityName}
              {user?.address}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">URL</div>
            <div className="text-md text-blue-400 underline">
              {user?.refUrl !== undefined && user.refUrl !== null && (
                <Link href={user?.refUrl}>{user?.refUrl}</Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">招待コード</div>
            <div className="text-md">{user?.invitationCode}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">アクセス</div>
            <div className="text-md">{user?.access}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">電話番号</div>
            <div className="text-md">{user?.phone}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">代表者名</div>
            <div className="text-md">{user?.representativeName}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">サロンの説明</div>
            <div className="text-md">{user?.salonDiscription}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">審査可否</div>
            <div className="text-md">{user?.isApproved ? '承認済み' : '未承認'}</div>
            {!user?.isApproved && (
              <div>
                <form action={formAction}>
                  <input name="targetUid" type="hidden" value={user.id} />
                  <input name="fromUid" type="hidden" value={user.id} />
                  <input name="inviteId" type="hidden" value={user.id} />
                  <SubmitButton isSubmitting={false} label="承認する" />
                </form>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">登録日時</div>
            <div className="text-md">{formatDate(user?.createdAt as CustomTimestamp)}</div>
          </div>
        </div>
      </div>
      <UserPointModal user={user} />
      <HistoryModal user={user} />
    </Modal>
  )
}

export default UserDetailModal
