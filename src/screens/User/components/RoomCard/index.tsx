import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/common/Button'

interface Room {
  id: number
  name: string
  capacity: string
  equipment: string[]
  location: string
  price: number
}

interface RoomCardProps {
  room: Room
}

const RoomCard = ({ room }: RoomCardProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg p-6 flex justify-between items-center w-3/4">
      <div className="flex-grow">
        <h3 className="text-xl font-semibold">{room.name}</h3>
        <div className="space-y-1 text-gray-600 mt-2">
          <p>Capacidad: {room.capacity}</p>
          <p>Equipamiento: {room.equipment.join(', ')}</p>
          <p>Ubicación: {room.location}</p>
          <p>Precio: {room.price}€/hora</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/room/${room.id}`)} className="mt-3">
          Ver disponibilidad
        </Button>
      </div>
      <div className="w-48 h-32 bg-gray-900 ml-6" />
    </div>
  )
}

export type { Room }
export default RoomCard
