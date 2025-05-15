import { JSX, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

const Card = ({ children, className = '', onClick }: CardProps): JSX.Element => {
  const baseStyles = 'p-6 rounded-xl'
  const clickStyles = onClick ? 'cursor-pointer' : ''

  return (
    <div className={`${baseStyles} ${clickStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
