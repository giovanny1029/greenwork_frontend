import { JSX, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white'
}

const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps): JSX.Element => {
  const baseStyles =
    'font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105'
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white',
    white: 'bg-white hover:bg-gray-100 text-gray-900'
  }

  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
}

export default Button
