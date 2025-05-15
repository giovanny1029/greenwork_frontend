import { JSX } from 'react'

interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

const Tab = ({ label, isActive, onClick, className = '' }: TabProps): JSX.Element => {
  const baseStyles = 'pb-2 cursor-pointer transition-colors duration-200'
  const activeStyles = isActive
    ? 'text-[#1a472a] border-b-2 border-[#1a472a]'
    : 'text-gray-500 hover:text-[#1a472a]'

  return (
    <button onClick={onClick} className={`${baseStyles} ${activeStyles} ${className}`}>
      {label}
    </button>
  )
}

interface TabGroupProps {
  tabs: {
    label: string
    value: string
  }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const TabGroup = ({ tabs, value, onChange, className = '' }: TabGroupProps): JSX.Element => {
  return (
    <div className={`flex justify-evenly ${className}`}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          isActive={value === tab.value}
          onClick={() => onChange(tab.value)}
        />
      ))}
    </div>
  )
}

export { Tab, TabGroup }
export type { TabProps, TabGroupProps }
