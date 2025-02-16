import React from 'react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  isSubmitting: boolean
  label: string
  width?: string | number
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label, width = '70%' }) => {
  const { pending } = useFormStatus()
  console.log(isSubmitting)
  return (
    <div className={`w-[${width}] text-center`}>
      <button
        type="submit"
        className={`w-[${width}] py-2 px-4 rounded-md text-white bg-orange-800 hover:bg-orange-300 text-sm font-semibold shadow-sm disabled:bg-gray-400`}
        disabled={isSubmitting || pending}
      >
        {pending ? '更新中' : label}
      </button>
    </div>
  )
}

export default SubmitButton
