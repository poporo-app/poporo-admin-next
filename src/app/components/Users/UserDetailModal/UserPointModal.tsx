import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { IoCloseSharp } from 'react-icons/io5'

import { RootState } from '@/lib/store/store'
import { closePointModal, setPointModalMessage } from '@/lib/store/modal/PointModalSlice'
import SubmitButton from '../../Button/SubmitButton'
import { useFormState } from 'react-dom'
import { pointAction, PointState } from '@/actions/pointAction'
import { updateUserPoint } from '@/lib/store/user/UserSlice'

type UserPointModalProps = {
  user: SalonUser
}

const modalStyle = {
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative' as const,
    width: '350px',
    height: 'auto',
    maxWidth: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
    outline: 'none',
  },
}

const UserPointModal = ({ user }: UserPointModalProps) => {
  const isOpen = useSelector((state: RootState) => state.pointModal.isOpen)
  const pointType = useSelector((state: RootState) => state.pointModal.type)
  const message = useSelector((state: RootState) => state.pointModal.message)

  const handleCloseModal = () => {
    dispatch(closePointModal())
    // The message will be cleared automatically by the closePointModal action
  }

  const handleFormAction = async (prevState: PointState, formData: FormData) => {
    const result = await pointAction(prevState, formData)
    if (result.message) {
      dispatch(setPointModalMessage(result.message))
    }
    if (result.point !== undefined) {
      dispatch(updateUserPoint({ id: user.id, point: result.point }))
    }
    return result
  }

  const [, formAction] = useFormState(handleFormAction, { point: 0, type: '', message: '' })
  const dispatch = useDispatch()
  return (
    <Modal isOpen={isOpen} style={modalStyle} onRequestClose={() => handleCloseModal()}>
      <div className="fixed w-100">
        <IoCloseSharp
          size={25}
          onClick={() => dispatch(closePointModal())}
          className="cursor-pointer"
        />
      </div>
      <div className="w-[50%] mx-auto mt-6">
        {pointType === 'plus' && <p className="text-center mt-4">ポイントを増やす</p>}
        {pointType === 'minus' && <p className="text-center mt-4">ポイントを減らす</p>}
        <div className="mt-4 text-xs text-red-500">{message}</div>
        <form action={formAction}>
          <div className="flex items-center mt-6">
            <div className="flex-1">
              <input
                type="text"
                defaultValue=""
                name="point"
                className="py-1.5 px-2 w-[90%] rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
              />
              <input type="hidden" name="uid" value={user.id} />
              <input type="hidden" name="type" value={pointType} />
            </div>
            <div className="flex-1">
              <SubmitButton isSubmitting={false} label="OK" width="100px" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UserPointModal
