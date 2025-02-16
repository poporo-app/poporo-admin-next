import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HistoryModalState {
  isOpen: boolean
  message: string
}

const initialState: HistoryModalState = {
  isOpen: false,
  message: '',
}

const historyModalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    openHistoryModal: (state) => {
      state.isOpen = true
    },
    closeHistoryModal: (state) => {
      state.isOpen = false
      state.message = ''
    },
    setHistoryModalMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
  },
})

export const { openHistoryModal, closeHistoryModal, setHistoryModalMessage } =
  historyModalSlice.actions
export default historyModalSlice.reducer
