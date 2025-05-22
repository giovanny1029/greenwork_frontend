import { JSX, ReactNode } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string | ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  actionText?: string
  onAction?: () => void
}

const EmptyState = ({
  title,
  description,
  icon = '🤔',
  action,
  actionText,
  onAction
}: EmptyStateProps): JSX.Element => {
  const { isDark } = useTheme();
  const handleAction = action?.onClick || onAction
  const actionLabel = action?.label || actionText

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {typeof icon === 'string' ? (
        <span className="text-5xl mb-4">{icon}</span>
      ) : (
        <div className="mb-4">{icon}</div>
      )}      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>{title}</h3>
      {description && <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>}
      {handleAction && actionLabel && (
        <button
          onClick={handleAction}
          className={`px-4 py-2 text-white rounded transition-colors cursor-pointer ${
            isDark 
              ? 'bg-[#66BB6A] hover:bg-[#81C784] shadow-lg shadow-[#66BB6A]/10' 
              : 'bg-[#1a472a] hover:bg-[#2d5a3c]'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
