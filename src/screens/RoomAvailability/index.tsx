import { JSX, useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuth } from '../../contexts/AuthContext'
import { getRoomById, Room } from '../../services/rooms'
import { createReservation } from '../../services/reservations'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './styles.css'

const RoomAvailability = (): JSX.Element => {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>()
  const { user } = useAuth()

  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('00:30')
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Cargar datos de la sala
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return

      setIsLoading(true)
      setError(null)

      try {
        const roomData = await getRoomById(roomId)
        setRoom(roomData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la sala')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomData()
  }, [roomId])

  // Cerrar los dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(event.target as Node)) {
        setIsStartOpen(false)
      }
      if (endRef.current && !endRef.current.contains(event.target as Node)) {
        setIsEndOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calendar navigation
  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1))

  // Get days of current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get empty days at start of month for padding
  const startDayOfWeek = getDay(monthStart)

  // Generate all hours in 30-minute increments
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minutes}`)
      }
    }
    return slots
  }

  // Generate end times based on start time
  const generateEndTimes = (start: string) => {
    const [startHour, startMinutes] = start.split(':').map(Number)
    const startTotalMinutes = startHour * 60 + startMinutes
    const times = []

    // Generate 48 slots of 30 minutes (24 hours)
    for (let i = 1; i <= 48; i++) {
      const totalMinutes = (startTotalMinutes + i * 30) % (24 * 60)
      const hour = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      times.push(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
    }
    return times
  }

  // Update end time when start time changes
  useEffect(() => {
    const endTimes = generateEndTimes(startTime)
    if (!endTimes.includes(endTime)) {
      setEndTime(endTimes[0])
    }
  }, [startTime, endTime])

  // Handle reservation
  const handleReservation = async () => {
    if (!selectedDate || !startTime || !endTime || !roomId || !user) {
      setError('No se pudo procesar la reserva. Faltan datos requeridos.')
      return
    }

    const startDateTime = new Date(selectedDate)
    const [startHour, startMinutes] = startTime.split(':').map(Number)
    startDateTime.setHours(startHour, startMinutes, 0)

    const endDateTime = new Date(selectedDate)
    const [endHour, endMinutes] = endTime.split(':').map(Number)
    if (endHour * 60 + endMinutes < startHour * 60 + startMinutes) {
      endDateTime.setDate(endDateTime.getDate() + 1)
    }
    endDateTime.setHours(endHour, endMinutes, 0)

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const reservationData = {
        room_id: roomId,
        user_id: user.id,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        status: 'pending'
      }

      await createReservation(reservationData)

      setSuccessMessage('Reserva creada correctamente')
      // Resetear valores después de reserva exitosa
      setStartTime('00:00')
      setEndTime('00:30')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]">
      {/* Header */}
      <header className="flex justify-between items-center p-4 text-white">
        <div>
          <button onClick={() => navigate('/user')} className="hover:text-gray-200">
            Ver salas
          </button>
        </div>
        <div className="flex gap-4">
          <button className="hover:text-gray-200">Mis reservas</button>
          <button onClick={() => navigate('/profile')} className="hover:text-gray-200">
            {user?.first_name || 'Usuario'}
          </button>
          <button className="hover:text-gray-200">→</button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-4">
        <div className="bg-[#e7efe9] rounded-lg p-8 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
              {error}
            </div>
          ) : (
            <>
              {/* Room Image */}
              <div className="w-full h-64 bg-gray-900 mb-8"></div>

              {/* Success message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-8">
                  {successMessage}
                </div>
              )}

              {/* Room Details */}
              <div className="space-y-2 mb-8">
                {room && (
                  <>
                    <h1 className="text-2xl font-semibold">{room.name}</h1>
                    <div className="space-y-1 text-gray-600">
                      <p>Capacidad: {room.capacity}</p>
                      <p>Equipamiento: {room.equipment || 'No especificado'}</p>
                      <p>Ubicación: {room.location || 'No especificada'}</p>
                      <p>Precio: {room.price || 'No especificado'}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <span className="text-gray-600">←</span>
                    </button>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                      <span className="text-gray-600">→</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Days of week */}
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-sm text-gray-500 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for padding */}
                  {Array.from({ length: startDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2" />
                  ))}

                  {/* Calendar days */}
                  {daysInMonth.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                    const isDayToday = isToday(day)

                    return (
                      <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 rounded-full w-10 h-10 mx-auto flex items-center justify-center
                          ${isSelected ? 'bg-[#1a472a] text-white' : ''}
                          ${isDayToday ? 'text-[#1a472a] font-bold' : ''}
                          hover:bg-[#e7efe9]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${day < new Date() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={day < new Date()}
                      >
                        {format(day, 'd')}
                      </button>
                    )
                  })}
                </div>

                {/* Time selection */}
                {selectedDate && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Hora de inicio</span>
                      <div className="relative" ref={startRef}>
                        <button
                          onClick={() => {
                            setIsStartOpen(!isStartOpen)
                            setIsEndOpen(false)
                          }}
                          className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm cursor-pointer relative min-w-[120px] text-left focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] flex items-center justify-between"
                        >
                          <span>{startTime}</span>
                          <svg
                            className={`h-4 w-4 text-gray-400 transition-transform ${isStartOpen ? 'rotate-0' : 'rotate-180'}`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {isStartOpen && (
                          <div className="absolute bottom-full left-0 z-50 max-h-[200px] w-full overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                            {generateTimeSlots().map((time) => (
                              <div
                                key={time}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                  time === startTime ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => {
                                  setStartTime(time)
                                  setIsStartOpen(false)
                                }}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Hora de fin</span>
                      <div className="relative" ref={endRef}>
                        <button
                          onClick={() => {
                            setIsEndOpen(!isEndOpen)
                            setIsStartOpen(false)
                          }}
                          className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm cursor-pointer relative min-w-[120px] text-left focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] flex items-center justify-between"
                        >
                          <span>{endTime}</span>
                          <svg
                            className={`h-4 w-4 text-gray-400 transition-transform ${isEndOpen ? 'rotate-0' : 'rotate-180'}`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {isEndOpen && (
                          <div className="absolute bottom-full left-0 z-50 max-h-[200px] w-full overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                            {generateEndTimes(startTime).map((time) => (
                              <div
                                key={time}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                  time === endTime ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => {
                                  setEndTime(time)
                                  setIsEndOpen(false)
                                }}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {startTime > endTime && (
                      <p className="text-xs text-gray-500">La reserva terminará al día siguiente</p>
                    )}
                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <div className="mt-6">
                <button
                  onClick={handleReservation}
                  disabled={!selectedDate || !startTime || !endTime || isSubmitting}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    selectedDate && startTime && endTime && !isSubmitting
                      ? 'bg-[#1a472a] text-white hover:bg-[#2d5a3c]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner className="h-5 w-5 mr-2" />
                      Procesando...
                    </div>
                  ) : (
                    'Reservar sala'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomAvailability
