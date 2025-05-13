import { JSX } from 'react'
import LoginForm from './components/LoginForm'

const Login = (): JSX.Element => {
  const handleLogin = (email: string, password: string) => {
    // Implement login logic here
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]">
      {/* Left Panel with Logo and Text */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 text-white">
        <h1 className="text-5xl font-bold mb-6">GreenWork</h1>
        <h2 className="text-3xl font-light mb-4">Reserva tu sala</h2>
        <h3 className="text-2xl font-light">coworking en</h3>
        <h3 className="text-2xl font-light">Gran Canaria</h3>
      </div>

      {/* Right Panel with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium mb-4">Accede</h2>
            <div className="flex justify-center space-x-4 text-sm">
              {' '}
              <span className="text-gray-500">Accede</span>
              <span className="text-[#1a472a] border-b-2 border-[#1a472a]">Registrate</span>
            </div>
          </div>

          <LoginForm onSubmit={handleLogin} />

          <div className="mt-4 text-center">
            {' '}
            <a href="#" className="text-sm text-gray-600 hover:text-[#1a472a]">
              ¿Olvidaste la contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
