'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'

const Header = () => {
  const router = useRouter()
  // ログアウト処理
  const handleLogout = async () => {
    await signOut({ redirect: false }) // redirectしない設定
    router.push('/auth/signin') // サインインページにリダイレクト
  }
  return (
    <header className="flex justify-between py-4 pr-4 bg-appBaseColor">
      <div className="ml-4">
        <Link href="/">
          <img alt="logo" className="w-1/3" src="/img/logo.png" />
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="w-[150px] flex items-center gap-1 font-semibold border px-4 py-2 rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-700"
      >
        <AiOutlineLogout size={20} />
        <div>ログアウト</div>
      </button>
    </header>
  )
}

export default Header
