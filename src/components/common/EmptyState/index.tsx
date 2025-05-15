import { JSX } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = ({ title, description, icon = '🤔', action }: EmptyStateProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
