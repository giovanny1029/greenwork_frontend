import { JSX, useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import PrivacyModal from '../../components/common/PrivacyModal'
import ThemeToggle from '../../components/ThemeToggle'

const Login = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const navigate = useNavigate()
  const { login, register, user } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogin = async (email: string, password: string) => {
    try {
      // Resetear cualquier error previo
      setError(null)

      // Validación básica en el cliente
      if (!email || !password) {
        setError('El email y la contraseña son obligatorios')
        return
      }

      console.log('Intentando login con:', { email })
      console.log('Iniciando proceso de login...')

      // Llamar a la función de login de AuthContext
      await login(email, password)

      // Si llegamos aquí sin error, el login fue exitoso
      console.log('Login completado sin errores')

      // No necesitamos hacer nada más, el AuthContext actualiza el estado
      // y el useEffect se encargará de la redirección
    } catch (err) {
      // Capturar el error de login y mostrarlo
      console.error('Error en login:', err)
      setError(err instanceof Error ? err.message : 'Error en el inicio de sesión')
    }
  }

  const handleRegister = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null)
      await register(first_name, last_name, email, password)
      // La redirección se hará automáticamente cuando se actualice el estado del usuario
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el registro')
    }
  }
  return (
    <div className="relative">
      <div className={`min-h-screen flex ${
        isDark 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]'
      }`}>
        <div className="absolute top-0 right-16 mt-8 z-[9999]">
          <ThemeToggle />
        </div>
        <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 ${
          isDark ? 'text-green-400' : 'text-white'
        }`}>
          <h1 className="text-8xl font-normal mb-12">GreenWork</h1>
          <div className={`text-5xl font-light space-y-2 ${
            isDark ? 'text-gray-400' : 'text-[#C5D3CA]'
          }`}>
            <h2>Reserva tu sala</h2>
            <h3>coworking en</h3>
            <h3>Gran Canaria</h3>
          </div>
        </div>

        <div className={`w-full lg:w-1/2 flex items-center justify-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`w-full max-w-md p-8 rounded-3xl ${
            isDark 
              ? 'bg-gray-800 shadow-[0_0_50px_0_rgba(0,255,0,0.1)]' 
              : 'bg-white shadow-[0_0_50px_0_rgba(0,0,0,0.1)]'
          }`}>
            <div className="text-center mb-12">
              <div className="flex justify-evenly text-lg">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`pb-2 cursor-pointer ${
                    activeTab === 'login'
                      ? isDark
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-[#1a472a] border-b-2 border-[#1a472a]'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  }`}
                >
                  Accede
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`pb-2 cursor-pointer ${
                    activeTab === 'register'
                      ? isDark
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-[#1a472a] border-b-2 border-[#1a472a]'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  }`}
                >
                  Registrate
                </button>
              </div>
            </div>

            <LoginForm
              activeTab={activeTab}
              onLogin={handleLogin}
              onRegister={handleRegister}
              errorLogin={error}
            />
            {activeTab === 'login' && (
              <div className="mt-6 text-center space-y-4">
                <div>
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className={`text-sm ${
                      isDark
                        ? 'text-gray-400 hover:text-green-400'
                        : 'text-gray-600 hover:text-[#1a472a]'
                    } underline`}
                  >
                    ¿Olvidaste la contraseña?
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className={`text-sm ${
                      isDark
                        ? 'text-gray-400 hover:text-green-400'
                        : 'text-gray-600 hover:text-[#1a472a]'
                    } underline`}
                  >
                    Políticas de privacidad
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <PrivacyModal 
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>
      <PrivacyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  )
}

export default Login
