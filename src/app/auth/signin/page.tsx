import SigninForm from '@/app/components/SigninForm/SigninForm'

export default function SignIn() {
  return (
    <div className="bg-appBaseColor h-screen grid place-items-center">
      <div className="bg-white p-6 min-w-[600px]">
        <h2 className="text-center text-gray-600 text-2xl font-bold">POPORO管理ログイン</h2>
        <SigninForm />
      </div>
    </div>
  )
}
