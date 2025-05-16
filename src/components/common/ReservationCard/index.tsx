export interface ReservationCardProps {
  reservation?: ReservationType
  onClick?: () => void
  id?: string
  roomName?: string
  capacity?: string
  date?: string
  start_time?: string
  end_time?: string
  status?: 'confirmed' | 'pending' | 'cancelled'
  onCancel?: (id: string) => void
} 'react'
import Button from '../Button'
import Card from '../Card'
import { Reservation as ReservationType } from '../../../services/reservations'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { JSX } from 'react'
import { Link } from 'react-router-dom'

export interface ReservationCardProps {
  reservation?: ReservationType
  onClick?: () => void
  id?: string
  roomName?: string
  capacity?: string
  date?: string
  start_time?: string
  end_time?: string
  reservation_status?: 'upcoming' | 'cancelled' | 'past'
  onCancel?: (id: string) => void
}

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "EEEE d 'de' MMMM", { locale: es })
}

// Formatear hora (convertir de "HH:MM:SS" a "HH:MM")
const formatTime = (timeString: string) => {
  return timeString ? timeString.substring(0, 5) : ''
}

const ReservationCard = (props: ReservationCardProps): JSX.Element => {
  // Si se pasa el objeto reservation, usamos ese
  if (props.reservation) {
    const { reservation, onClick } = props

    return (
      <div
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">{reservation.room?.name || 'Sala'}</h3>
            <p className="text-sm text-gray-600 capitalize">{formatDate(reservation.date)}</p>
          </div>
          <div
            className="px-2 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: reservation.status === 'confirmed' ? '#e6f4ea' : '#fef7e0',
              color: reservation.status === 'confirmed' ? '#34a853' : '#f9a825'
            }}
          >
            {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
          </div>
        </div>

        <div className="flex items-center text-gray-700 text-sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
        </div>
      </div>
    )
  }

  // Si no hay objeto reservation, usamos los props individuales (compatibilidad hacia atrás)
  const {
    id = '',
    roomName = '',
    capacity = '',
    date = '',
    start_time = '',
    end_time = '',
    reservation_status = 'upcoming',
    room_id = '',
    status = '',
    onCancel
  } = props

  console.log(props)

  return (
    <Card className="flex justify-between items-start mb-2 bg-white shadow-sm">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{roomName}</h3>
        <div className="space-y-0.5 text-gray-600 mt-1">
          <h4 className="text-sm font-medium">
            <Link to={`/room/${room_id}`} className="text-blue-600 hover:underline">
              Ver sala
            </Link>
          </h4>
          <p className="text-sm">Fecha: {date}</p>
          <p className="text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {start_time} - {end_time}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        {
          reservation_status === 'upcoming' && (
            <div
              className={`px-2 py-1 text-xs font-medium rounded-full mb-2
                ${status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              `}
            >
              {status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
            </div>
          )
        }
        {reservation_status === 'upcoming' && onCancel && (
          <Button onClick={() => onCancel(id)} className="text-red-500 hover:text-red-700 text-sm">
            Cancelar
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ReservationCard
