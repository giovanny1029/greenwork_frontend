import { JSX } from 'react'
import Button from '../Button'
import Card from '../Card'

interface ReservationCardProps {
  id: string
  roomName: string
  capacity: string
  date: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'cancelled' | 'past'
  onCancel?: (id: string) => void
}

const ReservationCard = ({
  id,
  roomName,
  capacity,
  date,
  startTime,
  endTime,
  status,
  onCancel
}: ReservationCardProps): JSX.Element => {
  return (
    <Card className="w-11/12 flex justify-between items-start mb-2">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{roomName}</h3>
        <div className="space-y-0.5 text-gray-600 mt-1">
          <p>Capacidad: {capacity}</p>
          <p>Fecha: {date}</p>
          <p>
            Hora: {startTime} - {endTime}
          </p>
        </div>
        {status === 'upcoming' && onCancel && (
          <Button
            variant="secondary"
            onClick={() => onCancel(id)}
            className="mt-3 bg-[#c94b4b] hover:bg-[#923737]"
          >
            Solicitar cancelación
          </Button>
        )}
      </div>
      <div className="w-48 h-32 bg-gray-900 ml-6"></div>
    </Card>
  )
}

export default ReservationCard
