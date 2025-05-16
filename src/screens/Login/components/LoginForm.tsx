import { JSX, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

interface LoginFormProps {
  activeTab: 'login' | 'register'
  onLogin: (email: string, password: string) => void
  onRegister: (first_name: string, last_name: string, email: string, password: string) => void
  errorLogin?: string | null
}

const LoginForm = ({ activeTab, onLogin, onRegister, errorLogin }: LoginFormProps): JSX.Element => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const { error } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    // Evitar el comportamiento predeterminado de enviar el formulario y recargar la página
    e.preventDefault()

    // Solo intentar login si tenemos email y password
    if (loginEmail && loginPassword) {
      // No usamos try/catch aquí porque queremos que el error se propague al componente padre
      // que es quien maneja los errores y actualiza el estado global
      onLogin(loginEmail, loginPassword)
    } else {
      alert('Por favor, introduce tanto el email como la contraseña')
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(firstName, lastName, registerEmail, registerPassword)
  }

  if (activeTab === 'login') {
    return (
      <form onSubmit={handleLoginSubmit} className="w-full max-w-md">
        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg text-center border border-red-200">
            <p className="font-medium">{error}</p>
          </div>
        )}
        <div className="mb-6">
          <input
            type="email"
            id="login-email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
            required
          />
        </div>
        <div className="mb-8">
          <input
            type="password"
            id="login-password"
            placeholder="Contraseña"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#1a472a] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#2d5a3c] transition duration-300"
        >
          Acceder
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRegisterSubmit} className="w-full max-w-md">
      {error && (
        <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg text-center border border-red-200">
          <p className="font-medium">{error}</p>
        </div>
      )}
      {errorLogin && (
        <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg text-center border border-red-200">
          <p className="font-medium">{errorLogin}</p>
        </div>
      )}
      <div className="mb-6">
        <input
          type="text"
          id="register-first-name"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
          required
        />
      </div>
      <div className="mb-6">
        <input
          type="text"
          id="register-last-name"
          placeholder="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
          required
        />
      </div>
      <div className="mb-6">
        <input
          type="email"
          id="register-email"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
          required
        />
      </div>
      <div className="mb-8">
        <input
          type="password"
          id="register-password"
          placeholder="Contraseña"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#1a472a] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#2d5a3c] transition duration-300"
      >
        Registrarse
      </button>
    </form>
  )
}

export default LoginForm
