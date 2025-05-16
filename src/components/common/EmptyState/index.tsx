import { JSX, ReactNode } from 'react'

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
  // Compatibilidad con ambos enfoques para el botón de acción
  const handleAction = action?.onClick || onAction
  const actionLabel = action?.label || actionText

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {typeof icon === 'string' ? (
        <span className="text-5xl mb-4">{icon}</span>
      ) : (
        <div className="mb-4">{icon}</div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {handleAction && actionLabel && (
        <button
          onClick={handleAction}
          className="px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
