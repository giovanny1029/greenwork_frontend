import { JSX, useState, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useTheme } from '../../../contexts/ThemeContext'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()

  // Comprobar si la ruta actual coincide con la ruta del enlace
  const isCurrentPath = (path: string) => {
    return location.pathname === path
  }

  // Opciones del menú
  const menuItems = [
    {
      label: 'Panel',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      )
    },
    {
      label: 'Usuarios',
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )
    },
    {
      label: 'Compañías',
      path: '/admin/companies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      )
    },
    {
      label: 'Salas',
      path: '/admin/rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      )
    },
    {
      label: 'Reservas',
      path: '/admin/reservations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    }
  ]

  if (!user || user.role !== 'admin') {
    return <div className="text-center p-10">No tienes permisos para ver esta página</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar para móvil */}
      <div
        className={`fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'} shadow-lg transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex items-center justify-between h-16 px-6 border-b ${isDark ? 'border-gray-800' : ''}`}>
          <div className={`text-xl font-bold ${isDark ? 'text-[#66BB6A]' : 'text-[#1a472a]'}`}>Panel Admin</div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>        <nav className="mt-5 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isCurrentPath(item.path)
                  ? isDark ? 'bg-[#1C6E41] text-white' : 'bg-[#1a472a] text-white'
                  : isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-[#66BB6A]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#1a472a]'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#1a472a]"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver a la app
          </Link>
        </div>
      </div>      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barra superior */}
        <header className={`flex items-center justify-between h-16 px-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b`}>
          <button className={`${isDark ? 'text-gray-300' : 'text-gray-500'} lg:hidden`} onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {user.first_name} {user.last_name}
            </span>
            <div className="ml-3 relative">
              <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-[#1C6E41] text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center`}>
                {user.first_name.charAt(0).toUpperCase()}
                {user.last_name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>        {/* Contenido principal */}
        <main className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
