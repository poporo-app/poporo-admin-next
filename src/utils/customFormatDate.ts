import { Timestamp as FirebaseTimestamp } from 'firebase/firestore'

export type CustomTimestamp = FirebaseTimestamp | { _seconds: number; _nanoseconds: number }

function formatDate(timestamp: CustomTimestamp | null | undefined): string {
  if (!timestamp) {
    return 'N/A'
  }
  let date: Date
  if (timestamp instanceof FirebaseTimestamp) {
    date = timestamp.toDate()
  } else if (
    typeof timestamp === 'object' &&
    '_seconds' in timestamp &&
    '_nanoseconds' in timestamp
  ) {
    date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
  } else {
    return 'Invalid Date'
  }
  return date.toISOString().split('T')[0] // 'xxxx-xx-xx' 形式に変換
}

export default formatDate
