import { JSX } from 'react'

interface GradientTextProps {
  text: string
  from?: string
  via?: string
  to?: string
  direction?: 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl'
  className?: string
}

const GradientText = ({
  text,
  from = 'blue-400',
  via,
  to = 'purple-600',
  direction = 'r',
  className = ''
}: GradientTextProps): JSX.Element => {
  const gradientClass = `bg-gradient-to-${direction}`
  const colorClass = via ? `from-${from} via-${via} to-${to}` : `from-${from} to-${to}`

  return (
    <span className={`bg-clip-text text-transparent ${gradientClass} ${colorClass} ${className}`}>
      {text}
    </span>
  )
}

export default GradientText
