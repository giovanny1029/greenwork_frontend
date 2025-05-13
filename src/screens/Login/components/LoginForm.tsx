import { JSX, useState } from 'react'

interface LoginFormProps {
  activeTab: 'login' | 'register'
  onLogin: (email: string, password: string) => void
  onRegister: (first_name: string, last_name: string, email: string, password: string) => void
}

const LoginForm = ({ activeTab, onLogin, onRegister }: LoginFormProps): JSX.Element => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(loginEmail, loginPassword)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(firstName, lastName, registerEmail, registerPassword)
  }

  if (activeTab === 'login') {
    return (
      <form onSubmit={handleLoginSubmit} className="w-full max-w-md">
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
