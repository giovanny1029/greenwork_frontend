import { JSX } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

const LoadingSpinner = ({
  size = 'medium',
  color,
  className = ''
}: LoadingSpinnerProps): JSX.Element => {
  const { isDark } = useTheme();
  const spinnerColor = color || (isDark ? '#66BB6A' : '#1a472a');
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`${sizeMap[size]} animate-spin ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          style={{ color: spinnerColor }}
        />
        <path
          className="opacity-75"
          fill="currentColor"
          style={{ color: spinnerColor }}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export default LoadingSpinner
