import { JSX, ReactNode } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

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
  const { isDark } = useTheme();
    if (title) {
    return (
      <section className={`${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-8 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'} border-l-4 ${isDark ? 'border-[#66BB6A]' : 'border-[#1a472a]'} pl-3`}>
            {title}
          </h2>

          {action && (
            <button
              onClick={action.onClick}              className={`px-3 py-1 text-sm ${isDark 
                ? 'text-[#A5D6A7] border-[#66BB6A] hover:bg-gray-800' 
                : 'text-[#1a472a] border-[#1a472a] hover:bg-[#f0f7f3]'
              } border rounded-md transition-colors focus:outline-none`}
            >
              {action.label}
            </button>
          )}
        </div>

        <div>{children}</div>
      </section>
    )
  }

  return <section className={`mb-16 ${className}`}>{children}</section>
}

export default Section
