import React, { createContext, useState, useContext, ReactNode } from 'react'

// Tema por defecto según los requisitos
const defaultTheme = {
  colors: {
    primary: '#1a472a', // Verde oscuro como color principal
    secondary: '#333333', // Gris oscuro como color secundario
    accent: '#5c9b7d', // Color adicional - verde medio que complementa el principal
    background: '#ffffff',
    text: '#333333',
    lightGray: '#f5f5f5',
    mediumGray: '#e0e0e0',
    dangerRed: '#d32f2f',
    warningYellow: '#f9a825',
    successGreen: '#388e3c',
    white: '#ffffff'
  },
  fonts: {
    main: "'Inter', 'system-ui', sans-serif",
    heading: "'Inter', 'system-ui', sans-serif"
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '16px',
    rounded: '9999px'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  }
}

type Theme = typeof defaultTheme

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Crear el contexto
export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {}
})

interface ThemeProviderProps {
  children: ReactNode
}

// Proveedor del contexto
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// Hook para usar el tema
export const useTheme = () => useContext(ThemeContext)
