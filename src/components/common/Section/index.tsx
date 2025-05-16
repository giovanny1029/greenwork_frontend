import { JSX, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  title?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const Section = ({ children, className = '', title, action }: SectionProps): JSX.Element => {
  // Si tiene título, renderizar con el estilo de tarjeta
  if (title) {
    return (
      <section className={`bg-white rounded-xl shadow-sm p-6 mb-8 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-[#1a472a] pl-3">
            {title}
          </h2>

          {action && (
            <button
              onClick={action.onClick}
              className="px-3 py-1 text-sm text-[#1a472a] border border-[#1a472a] rounded-md hover:bg-[#f0f7f3] transition-colors focus:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>

        <div>{children}</div>
      </section>
    )
  }

  // Renderizado original sin título
  return <section className={`mb-16 ${className}`}>{children}</section>
}

export default Section
