import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800 text-[#A5D6A7] hover:bg-gray-700 border border-[#66BB6A]' 
          : 'bg-white text-[#1a472a] hover:bg-gray-100 border border-gray-200'
      }`}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
