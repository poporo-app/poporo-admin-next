import { useEffect } from 'react'

const Dashbord = () => {
  useEffect(() => {
    console.log('Application started')
    console.log('Environment:', process.env.NODE_ENV)
    console.log(
      'NEXT_PUBLIC_FIREBASE_API_KEY:',
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substr(0, 5) + '...'
        : 'Not set'
    )
    console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
    console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  }, [])
  return <div>Dashbord</div>
}

export default Dashbord
