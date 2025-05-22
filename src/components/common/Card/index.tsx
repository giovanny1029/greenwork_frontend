import { JSX, ReactNode } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

interface CardProps {
  children?: ReactNode
  className?: string
  onClick?: () => void
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  imageComponent?: ReactNode
  actionText?: string
  onAction?: () => void
}

const Card = ({
  children,
  className = '',
  onClick,
  title,
  subtitle,
  description,
  imageUrl,
  imageComponent,
  actionText,
  onAction
}: CardProps): JSX.Element => {  const { isDark } = useTheme();
  
  const baseStyles = `p-6 rounded-xl ${isDark ? 'bg-gray-900 shadow-lg border border-gray-800' : 'bg-white shadow-sm'} relative`
  const clickStyles = onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-300' : ''

  // Si tenemos datos estructurados, mostrar una tarjeta estructurada
  if (title || subtitle || description) {
    return (
      <div
        className={`${baseStyles} ${clickStyles} ${className} overflow-hidden`}
        onClick={onClick}
      >
        {imageComponent ? (
          <div className="h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
            {imageComponent}
          </div>
        ) : imageUrl ? (
          <div
            className="h-40 -mx-6 -mt-6 mb-4 bg-center bg-cover"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : null}        {title && <h3 className={`text-lg font-semibold ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'} mb-1`}>{title}</h3>}
        {subtitle && <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'} mb-3`}>{subtitle}</p>}
        {description && <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} mb-4`}>{description}</p>}

        {actionText && onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction()
            }}
            className="mt-2 px-4 py-2 bg-[#1a472a] text-white text-sm rounded-md hover:bg-[#2d5a3c] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a472a]"
          >
            {actionText}
          </button>
        )}
      </div>
    )
  }

  // Si no hay datos estructurados, mostrar los hijos
  return (
    <div className={`${baseStyles} ${clickStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
