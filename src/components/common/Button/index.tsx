import { JSX, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white'
}

const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps): JSX.Element => {
  const baseStyles =
    'font-semibold py-2 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-[#333333] hover:bg-gray-700 text-white focus:ring-gray-500',
    secondary: 'bg-[#1a472a] hover:bg-[#2d5a3c] text-white focus:ring-[#1a472a]',
    white: 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 focus:ring-[#1a472a]'
  }

  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
}

export default Button
