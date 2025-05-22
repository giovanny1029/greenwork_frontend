import { JSX, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import {
  getReservations,
  cancelReservation,
  Reservation
} from '../../services/reservations'
import ReservationCard from '../../components/common/ReservationCard'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Header from '../../components/Header'

const Reservations = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userReservations = await getReservations({ userId: user.id })

        // Ordenar todas las reservas por fecha
        const sortedReservations = userReservations.sort((a, b) => {
          return (
            new Date(a.date + 'T' + a.start_time).getTime() -
            new Date(b.date + 'T' + b.start_time).getTime()
          )
        })

        setReservations(sortedReservations)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [user])

  const handleCancelReservation = async (id: string) => {
    try {
      const goCancel = window.confirm(
        '¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.'
      )

      if (!goCancel) return

      setError(null)
      
      // Mostrar indicador de carga (en una implementación real)
      await cancelReservation(id)

      // Update local state
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      )

      setSuccessMessage('Reserva cancelada correctamente')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError('Error al cancelar la reserva')
      console.error(err)
    }
  }

  const getReservationsByStatus = (status: 'upcoming' | 'cancelled' | 'past') => {
    const today = new Date().toISOString().split('T')[0]

    return reservations.filter((res) => {
      const isBeforeToday = res.date < today

      switch (status) {
        case 'upcoming':
          return !isBeforeToday && res.status !== 'cancelled'
        case 'cancelled':
          return res.status === 'cancelled'
        case 'past':
          return isBeforeToday && res.status !== 'cancelled'
        default:
          return false
      }
    })
  }
  const ReservationSection = ({
    title,
    reservations,
    status
  }: {
    title: string
    reservations: Reservation[]
    status: 'upcoming' | 'cancelled' | 'past'
  }) => {
    return (
      <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg ${isDark ? 'shadow-lg shadow-black/20' : 'shadow-sm'} p-6 mb-6 transition-all duration-300`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h2>
        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                {...reservation}
                status={reservation.status as 'confirmed' | 'pending' | 'cancelled'}
                onCancel={handleCancelReservation}
                reservation_status={status}
              />
            ))}
          </div>
        ) : (
          <div className="py-6">
            <EmptyState
              title={`No tienes reservas ${status === 'upcoming' ? 'próximas' : status === 'cancelled' ? 'canceladas' : 'anteriores'}`}
              description={status === 'upcoming' ? "Reserva una sala para tus próximas actividades" : undefined}
              icon="🗓️"
              actionText={status === 'upcoming' ? "Reservar sala" : undefined}
              onAction={status === 'upcoming' ? () => navigate('/rooms') : undefined}
            />
          </div>
        )}
      </div>
    )
  }

  console.log('Reservations:', reservations)
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />

      <div className="container mx-auto p-4 pt-8">
        {/* Success message */}
        {successMessage && (
          <div className={`${isDark ? 'bg-green-900 bg-opacity-20 border-green-800 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'} p-4 rounded-lg mb-6 flex items-start`}>
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className={`${isDark ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'} p-4 rounded-lg mb-6 flex items-start`}>
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>Mis Reservas</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : reservations.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <EmptyState
              title="No tienes reservas"
              description="Aún no has realizado ninguna reserva. ¡Reserva una sala para empezar!"
              icon="📅"
              actionText="Reservar sala"
              onAction={() => navigate('/rooms')}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ReservationSection title="Próximas" status={'upcoming'} reservations={getReservationsByStatus('upcoming')} />
            <ReservationSection title="Canceladas" status={'cancelled'} reservations={getReservationsByStatus('cancelled')} />
            <ReservationSection title="Anteriores" status={'past'} reservations={getReservationsByStatus('past')} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations