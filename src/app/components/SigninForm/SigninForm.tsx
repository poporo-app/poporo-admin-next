'use client'

import { useForm, useFormState } from 'react-hook-form'
import { useRouter } from 'next/navigation' // useRouterフックをインポート
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import SubmitButton from '../Button/SubmitButton'

export default function SignIn() {
  const router = useRouter()
  // react-hook-form の useForm を使用してフォームを管理
  const { register, handleSubmit, control } = useForm<Login>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // useFormState を使ってフォームの状態を管理
  const { errors, isSubmitting } = useFormState({ control })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // onSubmitハンドラ
  const onSubmit = async (data: Login) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 成功時にリダイレクトしない設定
      })

      if (result?.error) {
        setErrorMessage('メールアドレスまたはパスワードが違います')
      } else {
        // 成功した場合の処理（例えばリダイレクトなど）
        router.push('/')
      }
    } catch (error) {
      console.error('Sign in error', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="w-full flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="block mt-1 py-1.5 px-2  rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
            {...register('email', {
              required: 'メールアドレスを入力して下さい',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'メールアドレスの形式が違います',
              },
            })}
          />
          <div className="mt-2 text-red-500 text-sm">
            {errors.email && <p>{errors.email.message}</p>}
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            className="block mt-1 py-1.5 px-2 rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300"
            {...register('password', {
              required: 'パスワードを入力して下さい',
            })}
          />
          <div className="mt-2 text-red-500 text-sm">
            {errors.password && <p>{errors.password.message}</p>}
          </div>
        </div>
        <div className="mt-2 text-red-500 text-sm">{errorMessage && <p>{errorMessage}</p>}</div>
        <SubmitButton isSubmitting={isSubmitting} label="ログイン" />
      </form>
    </div>
  )
}
