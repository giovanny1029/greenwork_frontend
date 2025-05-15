import { JSX } from 'react'
import Header from '../../components/Header'
import RoomCard, { Room } from './components/RoomCard'

const rooms: Room[] = [
  {
    id: 1,
    name: 'Sala 1',
    capacity: '4-6 personas',
    equipment: ['Proyector', 'Pizarra'],
    location: 'Planta 1',
    price: 25
  },
  {
    id: 2,
    name: 'Sala 2',
    capacity: '8-10 personas',
    equipment: ['Proyector', 'Pizarra', 'TV'],
    location: 'Planta 1',
    price: 35
  },
  {
    id: 3,
    name: 'Sala 3',
    capacity: '12-15 personas',
    equipment: ['Proyector', 'Pizarra', 'TV', 'Videoconferencia'],
    location: 'Planta 2',
    price: 45
  },
  {
    id: 4,
    name: 'Sala 4',
    capacity: '20-25 personas',
    equipment: ['Proyector', 'Pizarra', 'TV', 'Videoconferencia', 'Sonido'],
    location: 'Planta 2',
    price: 60
  }
]

const User = (): JSX.Element => (
  <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
    <Header />
    <div className="mt-8 space-y-4 flex flex-col items-center">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  </div>
)

export default User
