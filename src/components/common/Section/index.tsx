import { JSX, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
}

const Section = ({ children, className = '' }: SectionProps): JSX.Element => {
  return <section className={`mb-16 ${className}`}>{children}</section>
}

export default Section
