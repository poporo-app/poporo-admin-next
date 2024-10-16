import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PointModalState {
  isOpen: boolean
  type: 'plus' | 'minus' | ''
  point: number
  message: string
}

const initialState: PointModalState = {
  isOpen: false,
  type: '',
  point: 0,
  message: '',
}

const pointModalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    openPointModal: (state, action: PayloadAction<'plus' | 'minus'>) => {
      state.isOpen = true
      state.type = action.payload
    },
    closePointModal: (state) => {
      state.isOpen = false
      state.message = ''
    },
    setPointModalMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
  },
})

export const { openPointModal, closePointModal, setPointModalMessage } = pointModalSlice.actions
export default pointModalSlice.reducer
