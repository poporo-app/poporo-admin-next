import { pointHistoryAction } from '@/actions/pointHistoryAction'
import { useState, useEffect } from 'react'

export const useHistory = (userId: string) => {
  const [histories, setHistories] = useState<PointHistory[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (userId) {
        setLoading(true)
        pointHistoryAction(userId)
          .then((res) => {
            setHistories(res.results)
            setTotalCount(res.totalCount)
          })
          .catch((err) => {
            setError(err.message)
          })
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  return { histories, totalCount, loading, error }
}
