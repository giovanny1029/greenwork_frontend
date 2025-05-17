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
import RoomImage from '../../components/common/RoomImage'

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
    // Reset messages
    setError(null)
    setSuccessMessage(null)

    // Validation checks
    if (!selectedDate) {
      setError('Por favor seleccione una fecha para la reserva')
      return
    }

    if (!startTime) {
      setError('Por favor seleccione una hora de inicio')
      return
    }

    if (!endTime) {
      setError('Por favor seleccione una hora de finalización')
      return
    }

    if (!roomId) {
      setError('No se pudo identificar la sala seleccionada')
      return
    }

    if (!user) {
      setError('Debe iniciar sesión para realizar una reserva')
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
      // Format date and times to match backend expectations
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedStartTime = `${startTime}:00`;
      const formattedEndTime = `${endTime}:00`;

      const reservationData = {
        room_id: roomId,
        user_id: user.id,
        date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        status: 'pending'
      }

      await createReservation(reservationData)

      setSuccessMessage(`Reserva creada correctamente para el día ${formattedDate} de ${formattedStartTime} a ${formattedEndTime}`)
      // Resetear valores después de reserva exitosa
      setSelectedDate(new Date())
      setStartTime('00:00')
      setEndTime('00:30')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="container mx-auto p-4 bg-gray-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Room Details */}
              <div className="space-y-2 mb-8">
                {room && (
                  <>
                    {/* Banner image for the room */}
                    <div className="mb-6 overflow-hidden rounded-xl shadow-md" style={{ height: '300px' }}>
                      <RoomImage
                        roomId={room.id}
                        isBanner={true}
                        height="100%"
                        readonly={true}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <h1 className="text-2xl font-semibold">{room.name}</h1>
                    <div className="space-y-1 text-gray-600">
                      <p>Capacidad: {room.capacity} personas</p>
                      {room.description && <p>Descripción: {room.description}</p>}
                      <p className="mt-2 text-sm text-gray-500">Complete el formulario a continuación para reservar esta sala</p>
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
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{startTime}</span>
                          </div>
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
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${time === startTime ? 'bg-gray-100' : ''
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
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{endTime}</span>
                          </div>
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
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${time === endTime ? 'bg-gray-100' : ''
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

              {/* Reservation Summary */}
              {selectedDate && startTime && endTime && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Resumen de la reserva</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><span className="font-medium">Sala:</span> {room?.name}</p>
                    <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    <p><span className="font-medium">Horario:</span> {startTime} - {endTime}</p>
                  </div>
                </div>
              )}

              {/* Success message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-8 flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <div>
                    <p className="font-medium">{successMessage}</p>
                    <p className="text-sm mt-1">Puede ver sus reservas en la sección "Mis Reservas".</p>
                    <button
                      onClick={() => navigate('/reservations')}
                      className="mt-2 text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Ver mis reservas
                    </button>
                  </div>
                </div>
              )}
              {
                error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <p className="font-medium">Error al procesar la reserva</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )
              }

              {/* Reserve Button */}
              <div className="mt-6">
                <button
                  onClick={handleReservation}
                  disabled={!selectedDate || !startTime || !endTime || isSubmitting}
                  className={`w-full py-3 rounded-lg transition-colors ${selectedDate && startTime && endTime && !isSubmitting
                    ? 'bg-[#1a472a] text-white hover:bg-[#2d5a3c]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner className="h-5 w-5 mr-2" />
                      Creando reserva...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      Confirmar reserva
                    </div>
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
