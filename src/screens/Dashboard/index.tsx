import { JSX, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { getReservations, Reservation } from '../../services/reservations'
import { getRooms, Room } from '../../services/rooms'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ReservationCard from '../../components/common/ReservationCard'
import EmptyState from '../../components/common/EmptyState'
import Section from '../../components/common/Section'
import Card from '../../components/common/Card'

const Dashboard = (): JSX.Element => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [isLoadingReservations, setIsLoadingReservations] = useState<boolean>(true)
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        // Cargar reservas del usuario
        setIsLoadingReservations(true)
        const today = new Date().toISOString().split('T')[0]
        const userReservations = await getReservations({ userId: user.id })

        // Filtrar para obtener solo las reservas futuras
        const upcoming = userReservations
          .filter((res) => {
            return res.date >= today && res.status === 'confirmed'
          })
          .sort((a, b) => {
            // Ordenar por fecha y hora de inicio
            return (
              new Date(a.date + 'T' + a.start_time).getTime() -
              new Date(b.date + 'T' + b.start_time).getTime()
            )
          })
          .slice(0, 5) // Mostrar solo las próximas 5 reservas

        setUpcomingReservations(upcoming)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setIsLoadingReservations(false)
      }

      try {
        // Cargar salas disponibles
        setIsLoadingRooms(true)
        const rooms = await getRooms()

        // Mostrar salas con estado "available"
        const available = rooms.filter((room) => room.status === 'available').slice(0, 6)
        setAvailableRooms(available)
      } catch (err) {
        setError('Error al cargar las salas')
        console.error(err)
      } finally {
        setIsLoadingRooms(false)
      }
    }

    loadDashboardData()
  }, [user])

  const handleReservationClick = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`)
  }

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Control</h1>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Próximas Reservas">
          {isLoadingReservations ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : upcomingReservations.length > 0 ? (
            <div className="grid gap-4">
              {upcomingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onClick={() => handleReservationClick(reservation.id)}
                />
              ))}

              <button
                onClick={() => navigate('/reservations')}
                className="mt-4 px-4 py-2 text-sm text-center text-white rounded-md"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Ver todas mis reservas
              </button>
            </div>
          ) : (
            <EmptyState
              title="No tienes reservas próximas"
              description="Reserva una sala de coworking para empezar a trabajar"
              actionText="Reservar ahora"
              onAction={() => navigate('/rooms')}
            />
          )}
        </Section>

        <Section title="Salas Disponibles">
          {isLoadingRooms ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : availableRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableRooms.map((room) => (
                <Card
                  key={room.id}
                  title={room.name}
                  subtitle={`Capacidad: ${room.capacity} personas`}
                  description={room.description}
                  onClick={() => handleRoomClick(room.id)}
                />
              ))}

              <button
                onClick={() => navigate('/rooms')}
                className="mt-4 col-span-full px-4 py-2 text-sm text-center text-white rounded-md"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Ver todas las salas
              </button>
            </div>
          ) : (
            <EmptyState
              title="No hay salas disponibles"
              description="No hay salas disponibles en este momento"
              actionText="Actualizar"
              onAction={() => window.location.reload()}
            />
          )}
        </Section>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: theme.colors.accent, color: 'white' }}
        >
          <h3 className="text-xl font-semibold mb-2">Reserva Rápida</h3>
          <p className="mb-4">Reserva una sala para hoy o mañana en pocos clics.</p>
          <button
            onClick={() => navigate('/rooms')}
            className="w-full py-2 rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
          >
            Reservar ahora
          </button>
        </div>

        <div className="rounded-xl p-6 shadow-md bg-white">
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.secondary }}>
            Mi Perfil
          </h3>
          <p className="mb-4 text-gray-600">Actualiza tus datos personales y preferencias.</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2 rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: theme.colors.lightGray, color: theme.colors.secondary }}
          >
            Ver perfil
          </button>
        </div>

        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: theme.colors.secondary, color: 'white' }}
        >
          <h3 className="text-xl font-semibold mb-2">Ayuda</h3>
          <p className="mb-4">¿Necesitas ayuda con tus reservas?</p>
          <button
            onClick={() => navigate('/help')}
            className="w-full py-2 rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
          >
            Centro de ayuda
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
