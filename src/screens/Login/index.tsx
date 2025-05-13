import { JSX, useState } from 'react'
import LoginForm from './components/LoginForm'
import { login, register } from '../../services/auth'

const Login = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await login({ email, password })
      console.log('Login exitoso:', response)
      // Aquí puedes manejar el token y la información del usuario
      // Por ejemplo, guardarlo en el localStorage y/o en un estado global
      localStorage.setItem('token', response.token)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el inicio de sesión')
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
      const response = await register({ first_name, last_name, email, password })
      console.log('Registro exitoso:', response)
      // Aquí puedes manejar el token y la información del usuario
      localStorage.setItem('token', response.token)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el registro')
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 text-white">
        <h1 className="text-8xl font-normal mb-12">GreenWork</h1>
        <div className="text-5xl font-light space-y-2 text-[#C5D3CA]">
          <h2>Reserva tu sala</h2>
          <h3>coworking en</h3>
          <h3>Gran Canaria</h3>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 rounded-3xl shadow-[0_0_50px_0_rgba(0,0,0,0.1)]">
          <div className="text-center mb-12">
            <div className="flex justify-evenly text-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`pb-2 cursor-pointer ${
                  activeTab === 'login'
                    ? 'text-[#1a472a] border-b-2 border-[#1a472a]'
                    : 'text-gray-500'
                }`}
              >
                Accede
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`pb-2 cursor-pointer ${
                  activeTab === 'register'
                    ? 'text-[#1a472a] border-b-2 border-[#1a472a]'
                    : 'text-gray-500'
                }`}
              >
                Registrate
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 text-red-500 bg-red-50 rounded-lg text-center">{error}</div>
          )}

          <LoginForm activeTab={activeTab} onLogin={handleLogin} onRegister={handleRegister} />

          {activeTab === 'login' && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-[#1a472a] underline">
                ¿Olvidaste la contraseña?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
