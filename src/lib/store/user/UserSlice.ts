import { db } from '@/lib/firebase'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface UserState {
  user: SalonUser
  userList: SalonUser[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    cityName: '',
    point: undefined,
    categories: [],
  },
  userList: [],
  status: 'idle',
  error: null,
}

// ユーザーデータをFirebaseから取得する非同期アクション
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (searchTerm: string) => {
  const q = query(collection(db, 'users'), where('name', '>=', searchTerm)) // Firebaseで名前で検索
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SalonUser[]
})

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = {
        id: '',
        name: '',
        cityName: '',
        categories: [],
      }
    },
    setUserList: (state, action: PayloadAction<SalonUser[]>) => {
      state.userList = action.payload
    },
    setUser: (state, action: PayloadAction<SalonUser>) => {
      state.user = action.payload
    },
    updateUserPoint: (state, action: PayloadAction<{ id: string; point: number }>) => {
      const { id, point } = action.payload
      if (state.user) {
        state.user.point = point
      }
      state.userList = state.userList.map((user) => (user.id === id ? { ...user, point } : user))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.userList = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const { unsetUser, setUserList, setUser, updateUserPoint } = userSlice.actions
export default userSlice.reducer
