import { configureStore } from '@reduxjs/toolkit'
import ModalSlice from './modal/ModalSlice'
import PointModalSlice from './modal/PointModalSlice'
import UserSlice from './user/UserSlice'
import InviteSlice from './invite/InviteSlice'

export const store = configureStore({
  reducer: {
    // これによりcartSliceで定義したすべてのreducersが、ストアに登録される
    modal: ModalSlice,
    pointModal: PointModalSlice,
    user: UserSlice,
    invite: InviteSlice,
  },
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
