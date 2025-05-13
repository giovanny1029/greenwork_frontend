import { JSX, useState } from 'react'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
}

const LoginForm = ({ onSubmit }: LoginFormProps): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#1a472a] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#2d5a3c] transition duration-300"
      >
        Acceder
      </button>
    </form>
  )
}

export default LoginForm
