import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = (): JSX.Element => {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implementar actualización de perfil
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      {/* Header */}
      <header className="flex justify-between items-center p-4 text-white">
        <div className="flex gap-4">
          <button onClick={() => navigate('/user')} className="hover:text-gray-200">
            Ver salas
          </button>
          <button onClick={() => navigate('/reservations')} className="hover:text-gray-200">
            Mis reservas
          </button>
        </div>
        <div className="flex gap-4">
          <button className="hover:text-gray-200">User</button>
          <button className="hover:text-gray-200">→</button>
        </div>
      </header>

      {/* Profile Form */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Contraseña nueva
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2d5a3c] text-white py-2 px-4 rounded-md hover:bg-[#1a472a] transition-colors"
            >
              Guardar cambios
            </button>
          </form>

          <div className="mt-6 text-right">
            <button className="text-red-600 hover:text-red-800 text-sm">Darme de baja</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
