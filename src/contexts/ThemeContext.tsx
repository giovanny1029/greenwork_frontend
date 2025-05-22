import React, { createContext, useState, useContext, ReactNode } from 'react'

// Tema claro por defecto
const lightTheme = {
  colors: {
    primary: '#1a472a',
    secondary: '#333333',
    accent: '#5c9b7d',
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

// Tema oscuro
const darkTheme = {
  colors: {
    primary: '#66BB6A',
    secondary: '#1F1F1F',
    accent: '#A5D6A7',
    background: '#1E1E1E',
    text: '#F5F5F5',
    lightGray: '#3A3A3A',
    mediumGray: '#505050',
    dangerRed: '#FF6B6B',
    warningYellow: '#FFD76E',
    successGreen: '#7DFFA7',
    white: '#FFFFFF'
  },
  fonts: lightTheme.fonts,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    small: '0 1px 3px rgba(0,255,0,0.12), 0 1px 2px rgba(0,255,0,0.24)',
    medium: '0 4px 6px rgba(0,255,0,0.1)',
    large: '0 10px 15px rgba(0,255,0,0.1)',
    xl: '0 20px 25px rgba(0,255,0,0.1)'
  },
  spacing: lightTheme.spacing
}

type Theme = typeof lightTheme

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  toggleTheme: () => void
}

// Crear el contexto
export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  setTheme: () => {},
  isDark: false,
  toggleTheme: () => {}
})

interface ThemeProviderProps {
  children: ReactNode
}

// Proveedor del contexto
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false); // Siempre comenzar en modo claro

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
