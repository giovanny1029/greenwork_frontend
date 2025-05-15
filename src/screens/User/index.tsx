import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

const User = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      {/* Header */}
      <Header />

      {/* Salas Grid */}
      <div className="mt-8 space-y-4 flex flex-col items-center">
        {/* Sala 1 */}
        <div className="bg-white rounded-lg p-6 flex justify-between items-center w-3/4">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">Sala 1</h3>
            <div className="space-y-1 text-gray-600 mt-2">
              <p>Capacidad: 4-6 personas</p>
              <p>Equipamiento: Proyector, Pizarra</p>
              <p>Ubicación: Planta 1</p>
              <p>Precio: 25€/hora</p>
            </div>
            <button
              onClick={() => navigate('/room/1')}
              className="mt-3 px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors"
            >
              Ver disponibilidad
            </button>
          </div>
          <div className="w-48 h-32 bg-gray-900 ml-6"></div>
        </div>

        {/* Sala 2 */}
        <div className="bg-white rounded-lg p-6 flex justify-between items-center w-3/4">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">Sala 2</h3>
            <div className="space-y-1 text-gray-600 mt-2">
              <p>Capacidad: 8-10 personas</p>
              <p>Equipamiento: Proyector, Pizarra, TV</p>
              <p>Ubicación: Planta 1</p>
              <p>Precio: 35€/hora</p>
            </div>
            <button
              onClick={() => navigate('/room/2')}
              className="mt-3 px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors"
            >
              Ver disponibilidad
            </button>
          </div>
          <div className="w-48 h-32 bg-gray-900 ml-6"></div>
        </div>

        {/* Sala 3 */}
        <div className="bg-white rounded-lg p-6 flex justify-between items-center w-3/4">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">Sala 3</h3>
            <div className="space-y-1 text-gray-600 mt-2">
              <p>Capacidad: 12-15 personas</p>
              <p>Equipamiento: Proyector, Pizarra, TV, Videoconferencia</p>
              <p>Ubicación: Planta 2</p>
              <p>Precio: 45€/hora</p>
            </div>
            <button
              onClick={() => navigate('/room/3')}
              className="mt-3 px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors"
            >
              Ver disponibilidad
            </button>
          </div>
          <div className="w-48 h-32 bg-gray-900 ml-6"></div>
        </div>

        {/* Sala 4 */}
        <div className="bg-white rounded-lg p-6 flex justify-between items-center w-3/4">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">Sala 4</h3>
            <div className="space-y-1 text-gray-600 mt-2">
              <p>Capacidad: 20-25 personas</p>
              <p>Equipamiento: Proyector, Pizarra, TV, Videoconferencia, Sonido</p>
              <p>Ubicación: Planta 2</p>
              <p>Precio: 60€/hora</p>
            </div>
            <button
              onClick={() => navigate('/room/4')}
              className="mt-3 px-4 py-2 bg-[#1a472a] text-white rounded hover:bg-[#2d5a3c] transition-colors"
            >
              Ver disponibilidad
            </button>
          </div>
          <div className="w-48 h-32 bg-gray-900 ml-6"></div>
        </div>
      </div>
    </div>
  )
}

export default User
