import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

type Reservation = {
  id: string
  roomName: string
  capacity: string
  date: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'cancelled' | 'past'
}

const Reservations = (): JSX.Element => {
  const navigate = useNavigate()

  // TODO: Replace with actual API call
  const mockReservations: Reservation[] = [
    {
      id: '1',
      roomName: 'Sala 1',
      capacity: '4-6 personas',
      date: '2025-05-15',
      startTime: '10:00',
      endTime: '11:00',
      status: 'upcoming'
    },
    {
      id: '4',
      roomName: 'Sala 4',
      capacity: '20-25 personas',
      date: '2025-05-16',
      startTime: '15:00',
      endTime: '16:00',
      status: 'upcoming'
    },
    {
      id: '2',
      roomName: 'Sala 2',
      capacity: '8-10 personas',
      date: '2025-05-14',
      startTime: '14:00',
      endTime: '15:00',
      status: 'cancelled'
    },
    {
      id: '5',
      roomName: 'Sala 1',
      capacity: '4-6 personas',
      date: '2025-05-13',
      startTime: '11:00',
      endTime: '12:00',
      status: 'cancelled'
    },
    {
      id: '3',
      roomName: 'Sala 3',
      capacity: '12-15 personas',
      date: '2025-05-13',
      startTime: '09:00',
      endTime: '10:00',
      status: 'past'
    },
    {
      id: '6',
      roomName: 'Sala 2',
      capacity: '8-10 personas',
      date: '2025-05-12',
      startTime: '16:00',
      endTime: '17:00',
      status: 'past'
    }
  ]

  const handleCancelReservation = (id: string) => {
    // TODO: Implement cancel reservation API call
    console.log('Cancelling reservation:', id)
  }

  const getReservationsByStatus = (status: 'upcoming' | 'cancelled' | 'past') => {
    return mockReservations.filter((res) => res.status === status)
  }

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <div className="bg-white rounded-lg p-3 w-11/12 flex justify-between items-start mb-2">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{reservation.roomName}</h3>
        <div className="space-y-0.5 text-gray-600 mt-1">
          <p>Capacidad: {reservation.capacity}</p>
          <p>Fecha: {reservation.date}</p>
          <p>
            Hora: {reservation.startTime} - {reservation.endTime}
          </p>
        </div>
        {reservation.status === 'upcoming' && (
          <button
            onClick={() => handleCancelReservation(reservation.id)}
            className="mt-3 px-4 py-2 bg-[#c94b4b] text-white rounded hover:bg-[#923737] transition-colors"
          >
            Solicitar cancelación
          </button>
        )}
      </div>
      <div className="w-48 h-32 bg-gray-900 ml-6"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      {/* Header */}
      <header className="flex justify-between items-center p-4 text-white">
        <div>
          <button onClick={() => navigate('/user')} className="hover:text-gray-200">
            ← Volver
          </button>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')} className="hover:text-gray-200">
            User
          </button>
          <button className="hover:text-gray-200">→</button>
        </div>
      </header>

      <div className="mt-8 space-y-8 flex flex-col items-center w-full">        {/* Próximas reservas */}
        <section className="relative mb-3 w-3/4 mx-auto">
          <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-1.5 rounded-t-lg inline-block font-bold text-xl relative z-10">
            Próximas
          </div>
          <div className="bg-[#e8f5e9] rounded-tr-lg rounded-b-lg p-2 -mt-px relative z-0 shadow-sm">
            <div className="space-y-4">
              {getReservationsByStatus('upcoming').map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        </section>

        {/* Reservas canceladas */}
        <section className="relative mb-3 w-3/4 mx-auto">
          <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-1.5 rounded-t-lg inline-block font-bold text-xl relative z-10">
            Canceladas
          </div>
          <div className="bg-[#e8f5e9] rounded-tr-lg rounded-b-lg p-2 -mt-px relative z-0 shadow-sm">
            <div className="space-y-4">
              {getReservationsByStatus('cancelled').map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        </section>

        {/* Reservas anteriores */}
        <section className="relative mb-3 w-3/4 mx-auto">
          <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-1.5 rounded-t-lg inline-block font-bold text-xl relative z-10">
            Anteriores
          </div>
          <div className="bg-[#e8f5e9] rounded-tr-lg rounded-b-lg p-2 -mt-px relative z-0 shadow-sm">
            <div className="space-y-4">
              {getReservationsByStatus('past').map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Reservations
