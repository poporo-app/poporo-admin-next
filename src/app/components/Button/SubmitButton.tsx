import React from 'react'

interface SubmitButtonProps {
  isSubmitting: boolean
  label: string
  width?: string | number
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label, width = '70%' }) => {
  return (
    <div className={`w-[${width}] text-center`}>
      <button
        type="submit"
        className={`w-[${width}] py-2 px-4 rounded-md text-white bg-orange-800 hover:bg-orange-300 text-sm font-semibold shadow-sm disabled:bg-gray-400`}
        disabled={isSubmitting}
      >
        {label}
      </button>
    </div>
  )
}

export default SubmitButton
