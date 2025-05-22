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
        setIsLoadingReservations(true)
        const today = new Date().toISOString().split('T')[0]
        const userReservations = await getReservations({ userId: user.id })

        const upcoming = userReservations
          .filter((res: any) => {
            return res?.date >= today && (res.status === 'confirmed' || res.status === 'pending')
          })
          .sort((a, b) => {
            return (
              new Date(a.date + 'T' + a.start_time).getTime() -
              new Date(b.date + 'T' + b.start_time).getTime()
            )
          })
          .slice(0, 5)

        setUpcomingReservations(upcoming)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setIsLoadingReservations(false)
      }

      try {
        setIsLoadingRooms(true)
        const rooms = await getRooms()

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
    navigate(`/room/${reservationId}`)
  }

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }
  const { isDark } = useTheme();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>

      {error && <div className={`mb-6 p-4 ${isDark ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-500'} rounded-lg`}>{error}</div>}

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
                  onClick={() => handleReservationClick(reservation.room_id)}
                />
              ))}

              <button
                onClick={() => navigate('/reservations')}                className={`mt-4 px-4 py-2 text-sm text-center text-white rounded-md cursor-pointer hover:opacity-90 ${isDark ? 'shadow-lg shadow-[#66BB6A]/10' : ''}`}
                style={{ backgroundColor: isDark ? '#66BB6A' : theme.colors.primary }}
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
              {availableRooms.map((room) => (                <Card
                  key={room.id}
                  title={room.name}
                  subtitle={`Capacidad: ${room.capacity} personas${room.price ? ` • €${room.price}/hora` : ''}`}
                  description={room.description}
                  onClick={() => handleRoomClick(room.id)}
                />
              ))}

              <button
                onClick={() => navigate('/rooms')}
                className="mt-4 col-span-full px-4 py-2 text-sm text-center text-white rounded-md cursor-pointer"
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
      </div>      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`rounded-xl p-6 ${isDark ? 'shadow-lg shadow-emerald-900/30 transform-gpu hover:translate-y-[-2px]' : 'shadow-md hover:shadow-lg'} transition-all duration-300`}
          style={{ 
            backgroundColor: isDark ? '#1C6E41' : theme.colors.accent, 
            color: 'white',
            borderLeft: isDark ? '1px solid rgba(165, 214, 167, 0.2)' : 'none'
          }}
        >
          <h3 className="text-xl font-semibold mb-2">Reserva Rápida</h3>
          <p className={`mb-4 ${isDark ? 'text-emerald-100' : ''}`}>Reserva una sala para hoy o mañana en pocos clics.</p>
          <button
            onClick={() => navigate('/rooms')}
            className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer hover:opacity-90 ${isDark ? 'hover:bg-opacity-40' : ''}`}
            style={{ 
              backgroundColor: isDark ? 'rgba(165, 214, 167, 0.2)' : 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(4px)',
              boxShadow: isDark ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            Reservar ahora
          </button>
        </div>

        <div 
          className={`rounded-xl p-6 ${isDark ? 'bg-gray-800 shadow-lg shadow-gray-900/30 transform-gpu hover:translate-y-[-2px]' : 'bg-white shadow-md hover:shadow-lg'} transition-all duration-300`}
          style={{
            borderLeft: isDark ? '1px solid rgba(80, 80, 80, 0.3)' : 'none'
          }}
        >
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-100' : ''}`} style={{ color: isDark ? undefined : theme.colors.secondary }}>
            Mi Perfil
          </h3>
          <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Actualiza tus datos personales y preferencias.</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer hover:opacity-90"
            style={{ 
              backgroundColor: isDark ? '#3A3A3A' : theme.colors.lightGray, 
              color: isDark ? '#E0E0E0' : theme.colors.secondary,
              boxShadow: isDark ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            Ver perfil
          </button>
        </div>

        <div
          className={`rounded-xl p-6 ${isDark ? 'shadow-lg shadow-gray-900/30 transform-gpu hover:translate-y-[-2px]' : 'shadow-md hover:shadow-lg'} transition-all duration-300`}
          style={{ 
            backgroundColor: isDark ? '#2A2A2A' : theme.colors.secondary, 
            color: 'white',
            borderLeft: isDark ? '1px solid rgba(80, 80, 80, 0.3)' : 'none'
          }}
        >
          <h3 className="text-xl font-semibold mb-2">Ayuda</h3>
          <p className={`mb-4 ${isDark ? 'text-gray-300' : ''}`}>¿Necesitas ayuda con tus reservas?</p>
          <a
            href="/src/assets/Manual de usuario.pdf"
            download="Manual de usuario.pdf"
            className="w-full py-2 rounded-md text-sm font-medium transition-all duration-300 inline-block text-center hover:opacity-90"
            style={{ 
              backgroundColor: isDark ? 'rgba(165, 214, 167, 0.15)' : 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(4px)',
              boxShadow: isDark ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            Centro de ayuda
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
