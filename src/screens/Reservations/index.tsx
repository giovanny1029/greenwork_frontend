import { JSX, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  getReservations,
  cancelReservation,
  Reservation as ApiReservation
} from '../../services/reservations'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import ReservationCard from '../../components/common/ReservationCard'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Section from '../../components/common/Section'

// Para mantener compatibilidad con el mock existente
type Reservation = {
  id: string
  roomName: string
  capacity: string
  date: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'cancelled' | 'past'
}

// Usar datos mock mientras se implementa la integración con la API
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

const Reservations = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [reservations, setReservations] = useState<ApiReservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<ApiReservation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')
  const [isCancelling, setIsCancelling] = useState<boolean>(false)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const reservationsData = await getReservations({ userId: user.id })
        setReservations(reservationsData)
        setFilteredReservations(reservationsData)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    // Comentar esta línea para usar datos mock
    // fetchReservations();

    // Descomentar esta línea para usar datos reales
    // setIsLoading(false); // Usar datos mock por ahora
  }, [user])

  // Función para filtrar por estado
  const getReservationsByStatus = (status: 'upcoming' | 'cancelled' | 'past') => {
    return mockReservations.filter((res) => res.status === status)
  }

  const handleCancelReservation = (id: string) => {
    console.log('Cancelling reservation:', id)
    // Implementar la cancelación real cuando se integre con la API
  }

  const FolderTab = ({ title, reservations }: { title: string; reservations: Reservation[] }) => (
    <Section>
      <div className="folder-tab">
        <div className="folder-tab-header">{title}</div>
        <div className="folder-content">
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                {...reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      <Header showBackButton />
      <div className="mt-8 space-y-8 flex flex-col items-center w-full">
        <FolderTab title="Próximas" reservations={getReservationsByStatus('upcoming')} />
        <FolderTab title="Canceladas" reservations={getReservationsByStatus('cancelled')} />
        <FolderTab title="Anteriores" reservations={getReservationsByStatus('past')} />
      </div>
    </div>
  )
}

export default Reservations
