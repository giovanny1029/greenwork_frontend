import { JSX } from 'react'

interface GradientTextProps {
  text: string
  from?: string
  via?: string
  to?: string
  direction?: 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl'
  className?: string
}

// Función auxiliar para convertir nombres de colores de Tailwind a códigos hexadecimales
const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'green-100': 'dcfce7',
    'green-200': 'bbf7d0',
    'green-300': '86efac',
    'green-400': '4ade80',
    'green-500': '22c55e',
    'green-600': '16a34a',
    'green-700': '15803d',
    'green-800': '166534',
    'green-900': '14532d'
  };
  
  return colorMap[colorName] || '3b82f6'; // Color azul por defecto si no se encuentra
}

const GradientText = ({
  text,
  from = 'green-200',
  via,
  to = 'green-600',
  direction = 'r',
  className = ''
}: GradientTextProps): JSX.Element => {
  return (
    <span 
      className={`relative inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(to ${direction === 'r' ? 'right' : 
                                        direction === 'l' ? 'left' : 
                                        direction === 't' ? 'top' : 
                                        direction === 'b' ? 'bottom' : 
                                        direction === 'tr' ? 'top right' : 
                                        direction === 'tl' ? 'top left' : 
                                        direction === 'br' ? 'bottom right' : 
                                        'bottom left'}, 
                                        var(--tw-gradient-stops))`,
        '--tw-gradient-from': `#${getColorCode(from)}`,
        '--tw-gradient-to': `#${getColorCode(to)}`,
        '--tw-gradient-stops': via ? 
          `var(--tw-gradient-from), #${getColorCode(via)}, var(--tw-gradient-to)` : 
          `var(--tw-gradient-from), var(--tw-gradient-to)`
      } as any}
    >
      {text}
    </span>
  )
}

export default GradientText
