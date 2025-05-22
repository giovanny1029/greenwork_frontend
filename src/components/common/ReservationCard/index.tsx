import Button from '../Button'
import Card from '../Card'
import { Reservation as ReservationType } from '../../../services/reservations'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { JSX } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
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
  status?: string
  room_id?: string
  onCancel?: (id: string) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "EEEE d 'de' MMMM", { locale: es })
}

const formatTime = (timeString: string) => {
  return timeString ? timeString.substring(0, 5) : ''
}

const formatPrice = (price?: string) => {
  if (!price) return ''
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(parseFloat(price))
}

const ReservationCard = (props: ReservationCardProps): JSX.Element => {
  const { isDark } = useTheme();
  
  if (props.reservation) {
    const { reservation, onClick } = props

    return (
      <div
        className={`p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
          isDark 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-100'
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div>            <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>{reservation.room?.name}</h3>
            <p className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(reservation.date)}</p>
          </div>          <div
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              reservation.status === 'confirmed' 
                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                : isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
          </div>
        </div>        <div className={`flex items-center text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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

        {/* Mostrar información de pago si existe */}
        {reservation.total_price && (          <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Precio total:</span>
              <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{formatPrice(reservation.total_price)}</span>
            </div>
            
            {reservation.payment_status && (              <div className="flex justify-between items-center text-sm mt-1">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Estado de pago:</span>
                <span className={`font-medium ${
                  reservation.payment_status === 'completed' 
                    ? isDark ? 'text-green-400' : 'text-green-600' 
                    : reservation.payment_status === 'failed' 
                      ? isDark ? 'text-red-400' : 'text-red-600' 
                      : isDark ? 'text-yellow-400' : 'text-orange-500'
                }`}>
                  {reservation.payment_status === 'completed' ? 'Completado' : 
                   reservation.payment_status === 'failed' ? 'Fallido' : 'Pendiente'}
                </span>
              </div>
            )}
            
            {reservation.payment_method && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Método de pago:</span>
                <span className="text-gray-800">
                  {reservation.payment_method}
                  {reservation.card_last_digits && ` (**** ${reservation.card_last_digits})`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  const {
    id = '',
    roomName = '',
    date = '',
    start_time = '',
    end_time = '',
    reservation_status = 'upcoming',
    status = '',
    room_id = '',
    onCancel
  } = props

  console.log(props)
  return (
    <Card className={`flex justify-between items-start mb-2 ${isDark ? 'bg-gray-800 shadow-lg shadow-black/20' : 'bg-white shadow-sm'}`}>
      <div className="flex-grow">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{roomName}</h3>
        <div className={`space-y-0.5 ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
          <h4 className="text-sm font-medium">
            <Link to={`/room/${room_id}`} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
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
              className={`px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                status === 'confirmed' 
                  ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800' 
                  : isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
              }`}
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
