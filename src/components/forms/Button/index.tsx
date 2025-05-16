import React from 'react'

interface ButtonProps {
  onClick?: () => void
  type?: 'submit' | 'button'
  className?: string
  text: string
  disabled?: boolean
}

function Button({ onClick, type = 'button', className = '', text, disabled = false }: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer w-full bg-[#2d5a3c] text-white py-2 px-4 rounded-md hover:bg-[#1a472a] transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button
