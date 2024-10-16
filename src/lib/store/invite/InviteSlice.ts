import { db } from '@/lib/firebase'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface InviteState {
  inviteUser: InviteUsers
  inviteUsers: InviteUsers[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: InviteState = {
  inviteUser: {
    id: '',
    uid: '',
    invitationCode: '',
    isInvite: undefined,
    targetUser: {
      id: '',
      name: '',
      cityName: '',
      categories: [],
    },
    inviteUser: {
      id: '',
      name: '',
      cityName: '',
      categories: [],
    },
  },
  inviteUsers: [],
  status: 'idle',
  error: null,
}

// ユーザーデータをFirebaseから取得する非同期アクション
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (searchTerm: string) => {
  const q = query(collection(db, 'users'), where('name', '>=', searchTerm)) // Firebaseで名前で検索
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as InviteUsers[]
})

const inviteSlice = createSlice({
  name: 'invite',
  initialState: initialState,
  reducers: {
    unsetInvite: (state) => {
      state.inviteUser = {
        id: '',
        uid: '',
        invitationCode: '',
        isInvite: undefined,
        targetUser: {
          id: '',
          name: '',
          cityName: '',
          categories: [],
        },
        inviteUser: {
          id: '',
          name: '',
          cityName: '',
          categories: [],
        },
      }
    },
    setInvite: (state, action: PayloadAction<InviteUsers>) => {
      state.inviteUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.inviteUsers = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const { unsetInvite, setInvite } = inviteSlice.actions
export default inviteSlice.reducer
