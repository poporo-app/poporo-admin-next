import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/lib/store/modal/ModalSlice'
import { IoCloseSharp } from 'react-icons/io5'

import { toJapanese } from '@/constants/appInfo'
import { pref } from '@/constants/pref'
import { RootState } from '@/lib/store/store'
import Link from 'next/link'
import formatDate from '@/utils/customFormatDate'
import SubmitButton from '../../Button/SubmitButton'
import { doApproved } from '@/actions/inviteAction'
import { useFormState } from 'react-dom'

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

const InviteDetailModal = () => {
  const invite = useSelector((state: RootState) => state.invite.inviteUser)
  const isOpen = useSelector((state: RootState) => state.modal.isOpen)
  const dispatch = useDispatch()
  const [state, formAction] = useFormState(doApproved, { results: false, message: '' })
  return (
    <Modal isOpen={isOpen} style={modalStyle} onRequestClose={() => dispatch(closeModal())}>
      <div className="fixed w-100">
        <IoCloseSharp size={25} onClick={() => dispatch(closeModal())} className="cursor-pointer" />
      </div>
      <div className="w-[90%] mx-auto mt-6">
        <div className="w-[80%]">
          <div className="grid grid-cols-3">
            <div className="font-bold">サロン名</div>
            <div className="text-md">{invite?.targetUser?.name}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">都道府県・町名</div>
            <div className="text-md">
              {invite.targetUser?.prefCode !== undefined && pref[invite.targetUser.prefCode]}
              {invite.targetUser?.cityName}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">サロン種別</div>
            <div className="text-md">
              {invite.targetUser?.categories?.map((c, i, r) => {
                if (r.length - 1 !== i) {
                  return `${toJapanese(c)},`
                }
                return toJapanese(c)
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">ポイント</div>
            <div className="text-md">{invite.targetUser?.point}</div>
            <div>+ -</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">住所</div>
            <div className="text-md">
              {invite.targetUser?.prefCode !== undefined && pref[invite.targetUser?.prefCode]}
              {invite.targetUser?.cityName}
              {invite.targetUser?.address}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">URL</div>
            <div className="text-md text-blue-400 underline">
              {invite.targetUser?.refUrl !== undefined && invite.targetUser?.refUrl !== null && (
                <Link href={invite.targetUser?.refUrl}>{invite.targetUser?.refUrl}</Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">招待コード</div>
            <div className="text-md">{invite.targetUser?.invitationCode}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">アクセス</div>
            <div className="text-md">{invite.targetUser?.access}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">電話番号</div>
            <div className="text-md">{invite.targetUser?.phone}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">代表者名</div>
            <div className="text-md">{invite.targetUser?.representativeName}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">サロンの説明</div>
            <div className="text-md">{invite.targetUser?.salonDiscription}</div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">審査可否</div>
            <div className="text-md">{invite.targetUser?.isApproved ? '承認済み' : '未承認'}</div>
            <div>
              <form action={formAction}>
                <input name="targetUid" type="hidden" value={invite.targetUser?.id} />
                <input name="fromUid" type="hidden" value={invite.inviteUser?.id} />
                <input name="inviteId" type="hidden" value={invite.id} />
                <SubmitButton isSubmitting={false} label="承認する" />
              </form>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <div className="font-bold">登録日時</div>
            <div className="text-md">{formatDate(invite.targetUser?.createdAt as any)}</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InviteDetailModal
