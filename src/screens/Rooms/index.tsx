import { JSX, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRooms, Room } from '../../services/rooms'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import RoomImage from '../../components/common/RoomImage'

const RoomsScreen = (): JSX.Element => {
  const navigate = useNavigate()

  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterCapacity, setFilterCapacity] = useState<string>('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true)
        const roomsData = await getRooms()
        setRooms(roomsData)
      } catch (err) {
        setError('Error al cargar las salas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      searchQuery === '' ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCapacity = filterCapacity === '' || room.capacity >= parseInt(filterCapacity)

    return matchesSearch && matchesCapacity
  })

  console.log('Filtered Rooms:', filteredRooms)

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Salas Disponibles</h1>

      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre o descripción"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
            />
          </div>
          <div className="md:w-1/4">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad mínima
            </label>
            <select
              id="capacity"
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
            >
              <option value="">Todos</option>
              <option value="1">1 persona</option>
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="8">8 personas</option>
              <option value="12">12 personas</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (            <Card
              key={room.id}
              title={room.name}
              subtitle={`Capacidad: ${room.capacity} personas${room.price ? ` • €${room.price}/hora` : ''}`}
              description={room.description || 'Sin descripción disponible'}
              imageComponent={
                <RoomImage
                  roomId={room.id}
                  isBanner={true}
                  readonly={true}
                  height="160px"
                />
              }
              onClick={() => handleRoomClick(room.id)}
              actionText="Ver disponibilidad"
              onAction={() => handleRoomClick(room.id)}
              className={room.status !== 'available' ? 'opacity-60' : ''}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron salas"
          description="No hay salas que coincidan con los criterios de búsqueda"
          icon="🔍"
          actionText="Limpiar filtros"
          onAction={() => {
            setSearchQuery('')
            setFilterCapacity('')
          }}
        />
      )}
    </div>
  )
}

export default RoomsScreen
