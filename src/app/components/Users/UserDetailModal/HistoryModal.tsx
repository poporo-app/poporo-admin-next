import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { closeHistoryModal } from '@/lib/store/modal/HistoryModalSlice'
import { FaArrowLeft } from 'react-icons/fa'
import { MdOutlineMenuBook, MdCreditScore } from 'react-icons/md'
import { AiOutlineShop } from 'react-icons/ai'

import formatDate, { CustomTimestamp } from '@/utils/customFormatDate'
import { RootState } from '@/lib/store/store'
import { useHistory } from '@/hooks/usePointHistory'

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

interface HistoryModalProps {
  user: SalonUser
}

const HistoryModal = ({ user }: HistoryModalProps) => {
  const isOpen = useSelector((state: RootState) => state.historyModal.isOpen)
  const dispatch = useDispatch()
  const { histories, totalCount, loading } = useHistory(user.id)
  return (
    <Modal isOpen={isOpen} style={modalStyle} onRequestClose={() => dispatch(closeHistoryModal())}>
      <div className="fixed w-100">
        <FaArrowLeft
          size={25}
          onClick={() => dispatch(closeHistoryModal())}
          className="cursor-pointer"
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-[90%] mx-auto mt-6">
          <div className="flex items-end gap-16 pb-1 border-b border-b-[#3f4c42]">
            <h1 className="font-bold">施術履歴</h1>
            <h2 className="font-bold">リラクゼーションサロンTOTORO</h2>
            <div className="ml-auto mr-8 ">
              施術回数<span className="ml-4 text-3xl font-bold">{totalCount}</span>回
            </div>
          </div>
          {histories.map((history: PointHistory) => (
            <div className="w-[90%] mx-auto mt-10" key={history.id}>
              <div className="w-[70%] text-sm font-bold mt-10 border-b border-b-[#92D5AB]">
                {formatDate(history.createdAt as CustomTimestamp)}
              </div>
              <div className="w-[70%] mt-4 pb-1 flex items-center">
                <div className="flex gap-1 items-center font-bold">
                  <MdOutlineMenuBook size={20} />
                  施術メニュー
                </div>
                <div className="ml-auto items-center font-bold">{history.menu?.menuTitle}</div>
              </div>
              <div className="w-[70%] mt-4 mb-2 pb-1 flex items-center">
                <div className="flex gap-1 items-center font-bold">
                  <AiOutlineShop size={20} />
                  利用サロン
                </div>
                <div className="ml-auto items-center font-bold">{history.user?.name}</div>
              </div>
              <div className="w-[70%] mt-4 pb-1 flex items-center">
                <div className="flex gap-1 items-center font-bold">
                  <MdCreditScore size={20} />
                  利用ポイント
                </div>
                <div className="ml-auto items-center font-bold">{history.point}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default HistoryModal
