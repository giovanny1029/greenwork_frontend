import { JSX, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import CustomerServiceModal from '../common/CustomerServiceModal'
import ThemeToggle from '../ThemeToggle'

const Header = (): JSX.Element => {  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, profileImage } = useAuth()
  const { isDark } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const isActiveRoute = (path: string): boolean => {    // Verifica si la ruta actual comienza con el path del enlace
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path))
  }
  
  const ActiveIndicator = () => (
    <div className={`absolute -bottom-3 left-0 right-0 h-0.5 ${isDark ? 'bg-[#66BB6A]' : 'bg-[#1a472a]'} rounded-full`}></div>
  )

  return (    <header className={`fixed top-0 left-0 right-0 z-50 shadow-sm ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}        <Link to="/" className="flex items-center">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-[#66BB6A]' : 'text-[#1a472a]'}`}>GreenWork</h1>
        </Link>{/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link            to="/dashboard"
            className={`transition-colors flex items-center relative ${              isActiveRoute('/dashboard')
                ? isDark ? 'text-[#66BB6A] font-medium' : 'text-[#1a472a] font-medium'
                : isDark ? 'text-gray-100 hover:text-[#A5D6A7]' : 'text-gray-700 hover:text-[#1a472a]'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
            {isActiveRoute('/dashboard') && <ActiveIndicator />}
          </Link>
          <Link            to="/rooms"
            className={`transition-colors flex items-center relative ${              isActiveRoute('/rooms')
                ? isDark ? 'text-[#66BB6A] font-medium' : 'text-[#1a472a] font-medium'
                : isDark ? 'text-gray-100 hover:text-[#A5D6A7]' : 'text-gray-700 hover:text-[#1a472a]'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Salas
            {isActiveRoute('/rooms') && <ActiveIndicator />}
          </Link>
          <Link            to="/reservations"
            className={`transition-colors flex items-center relative ${              isActiveRoute('/reservations')
                ? isDark ? 'text-[#66BB6A] font-medium' : 'text-[#1a472a] font-medium'
                : isDark ? 'text-gray-100 hover:text-[#A5D6A7]' : 'text-gray-700 hover:text-[#1a472a]'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Mis Reservas
            {isActiveRoute('/reservations') && <ActiveIndicator />}
          </Link>
          {user?.role === 'admin' ? (
            <Link              to="/admin"
              className={`transition-colors flex items-center relative ${                isActiveRoute('/admin')
                  ? isDark ? 'text-[#66BB6A] font-medium' : 'text-[#1a472a] font-medium'
                  : isDark ? 'text-gray-100 hover:text-[#A5D6A7]' : 'text-gray-700 hover:text-[#1a472a]'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Administración
              {isActiveRoute('/admin') && <ActiveIndicator />}
            </Link>
          ) : (
            <button
              onClick={() => setIsCustomerServiceModalOpen(true)}
              className={`transition-colors flex items-center ${isDark ? 'text-gray-100 hover:text-[#A5D6A7]' : 'text-gray-700 hover:text-[#1a472a]'}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              contacto
            </button>
          )}
        </nav>        {/* Menú de usuario de escritorio */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <div className="relative group">
            <button
              className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
              onClick={() => navigate('/profile')}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={user?.first_name || 'Usuario'} 
                  className="w-8 h-8 rounded-full object-cover shadow-sm border-2 border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white uppercase bg-[#1a472a] shadow-sm">
                  {user?.first_name ? user.first_name.charAt(0) : 'U'}
                </div>
              )}              <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.first_name || 'Usuario'}</span>              <svg
                className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className={`absolute right-0 w-48 mt-2 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
              <Link
                to="/profile"
                className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-100 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-100 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Botón de menú móvil */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 focus:outline-none"
            aria-label="Abrir menú"
          >
            {!mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>      {/* Menú móvil */}      {mobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
          <div className="container mx-auto py-3 px-4">
            <nav className="flex flex-col space-y-4 mb-4">
              <Link
                to="/dashboard"                className={`py-2 px-3 rounded-md ${
                  isActiveRoute('/dashboard')
                    ? isDark
                      ? 'bg-[#66BB6A] bg-opacity-15 text-[#A5D6A7] font-medium'
                      : 'bg-[#1a472a] bg-opacity-10 text-[#1a472a] font-medium'
                    : isDark
                      ? 'text-gray-100 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/rooms"                className={`py-2 px-3 rounded-md ${
                  isActiveRoute('/rooms')
                    ? isDark
                      ? 'bg-[#66BB6A] bg-opacity-15 text-[#A5D6A7] font-medium'
                      : 'bg-[#1a472a] bg-opacity-10 text-[#1a472a] font-medium'
                    : isDark
                      ? 'text-gray-100 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Salas
              </Link>
              <Link
                to="/reservations"                className={`py-2 px-3 rounded-md ${
                  isActiveRoute('/reservations')
                    ? isDark
                      ? 'bg-[#66BB6A] bg-opacity-15 text-[#A5D6A7] font-medium'
                      : 'bg-[#1a472a] bg-opacity-10 text-[#1a472a] font-medium'
                    : isDark
                      ? 'text-gray-100 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis Reservas
              </Link>
              {user?.role === 'admin' ? (
                <Link
                  to="/admin"                  className={`py-2 px-3 rounded-md ${
                    isActiveRoute('/admin')
                      ? isDark
                        ? 'bg-[#66BB6A] bg-opacity-15 text-[#A5D6A7] font-medium'
                        : 'bg-[#1a472a] bg-opacity-10 text-[#1a472a] font-medium'
                      : isDark
                        ? 'text-gray-100 hover:bg-gray-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Administración
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsCustomerServiceModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className={`py-2 px-3 rounded-md text-left ${isDark ? 'text-gray-100 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Servicio al Cliente
                </button>
              )}
            </nav>            <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-4 flex flex-col space-y-3`}>
              <div className="flex items-center justify-between px-3 py-2">
                <span className={isDark ? 'text-gray-100' : 'text-gray-700'}>Cambiar tema</span>
                <ThemeToggle />
              </div>
              <Link
                to="/profile"                className={`flex items-center space-x-3 py-2 px-3 rounded-md ${
                  isActiveRoute('/profile')
                    ? isDark
                      ? 'bg-[#66BB6A] bg-opacity-15 text-[#A5D6A7] font-medium'
                      : 'bg-[#1a472a] bg-opacity-10 text-[#1a472a] font-medium'
                    : isDark
                      ? 'text-gray-100 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={user?.first_name || 'Usuario'} 
                    className="w-8 h-8 rounded-full object-cover shadow-sm border-2 border-white"
                  />
                ) : (                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white uppercase ${isDark ? 'bg-[#66BB6A]' : 'bg-[#1a472a]'}`}>
                    {user?.first_name ? user.first_name.charAt(0) : 'U'}
                  </div>
                )}
                <span>Mi Perfil</span>
              </Link>
              <button
                className={`text-left py-2 px-3 rounded-md ${isDark ? 'text-gray-100 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>      )}

      {/* Modal de Atención al Cliente */}
      <CustomerServiceModal
        isOpen={isCustomerServiceModalOpen}
        onClose={() => setIsCustomerServiceModalOpen(false)}
      />
    </header>
  )
}

export default Header
