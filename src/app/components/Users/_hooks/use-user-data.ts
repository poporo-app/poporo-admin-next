import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/lib/store/user/UserSlice'
import { getUserById } from '@/actions/findUserAction'

export const useUserData = (isOpen: boolean, userId: string | undefined) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (isOpen && userId) {
        try {
          const response = await getUserById(userId)
          console.log(response)
          if (response.user !== undefined) {
            dispatch(setUser(response.user))
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchLatestUserData()
  }, [isOpen, userId, dispatch])
}
