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
import { useTheme } from '../../contexts/ThemeContext'
import { getRoomById, Room } from '../../services/rooms'
import { createReservation } from '../../services/reservations'
import { getReservations } from '../../services/reservations' // Import getReservations service
import LoadingSpinner from '../../components/common/LoadingSpinner'
import RoomImage from '../../components/common/RoomImage'
import PaymentModal, { PaymentData } from '../../components/common/PaymentModal'

const RoomAvailability = (): JSX.Element => {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>()
  const { user } = useAuth()
  const { isDark } = useTheme()

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (room?.price && startTime && endTime) {
      const hourDifference = calculateHourDifference(startTime, endTime)
      const price = parseFloat(room.price) * hourDifference
      setTotalPrice(price)
    } else {
      setTotalPrice(0)
    }
  }, [room, startTime, endTime])

  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)

  const calculateHourDifference = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)
    
    let hourDiff = endHour - startHour
    const minuteDiff = endMinute - startMinute
    
    if (hourDiff < 0) {
      hourDiff += 24
    }
    
    return hourDiff + (minuteDiff / 60)
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minutes}`)
      }
    }
    return slots
  }

  const generateEndTimes = (start: string) => {
    const [startHour, startMinutes] = start.split(':').map(Number)
    const startTotalMinutes = startHour * 60 + startMinutes
    const times = []

    for (let i = 1; i <= 48; i++) {
      const totalMinutes = (startTotalMinutes + i * 30) % (24 * 60)
      const hour = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      times.push(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
    }
    return times
  }

  useEffect(() => {
    const endTimes = generateEndTimes(startTime)
    if (!endTimes.includes(endTime)) {
      setEndTime(endTimes[0])
    }
  }, [startTime, endTime])

  const checkRoomAvailability = async () => {
    if (!roomId || !selectedDate || !startTime || !endTime) {
      return false;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedStartTime = `${startTime}:00`;
      const formattedEndTime = `${endTime}:00`;

      const roomReservations = await getReservations({ roomId });
      
      const conflicts = roomReservations.filter(reservation => {
        return reservation.date === formattedDate && 
               reservation.status !== 'cancelled' &&
               reservation.start_time < formattedEndTime &&
               reservation.end_time > formattedStartTime;
      });

      if (conflicts.length > 0) {
        const conflictTimes = conflicts.map(res => 
          `${res.start_time.slice(0, -3)} - ${res.end_time.slice(0, -3)}`
        ).join(', ');
        
        setError(`La sala ya está reservada en el horario seleccionado. Horarios ocupados: ${conflictTimes}`);
        return false;
      }

      return true;
    } catch (err) {
      setError('Error al verificar la disponibilidad de la sala');
      return false;
    }
  };

  const handleProceedToPayment = async () => {
    setError(null)
    setSuccessMessage(null)

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

    const isAvailable = await checkRoomAvailability();
    if (!isAvailable) {
      return;
    }

    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    if (!selectedDate || !startTime || !endTime || !roomId || !user) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedStartTime = `${startTime}:00`;
      const formattedEndTime = `${endTime}:00`;

      const cardLastDigits = paymentData.cardNumber.replace(/\s/g, '').slice(-4);

      const reservationData = {
        room_id: roomId,
        user_id: user.id,
        date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        status: 'pending',
        total_price: totalPrice.toFixed(2),
        payment_status: 'completed' as const,
        payment_method: 'credit_card',
        card_last_digits: cardLastDigits
      }

      await createReservation(reservationData)

      setSuccessMessage('¡Pago realizado! Su reserva está pendiente de ser aceptada. Le enviaremos un correo cuando esté confirmada. Gracias por confiar en nosotros.')
      
      setIsPaymentModalOpen(false)
      
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Content */}
      <div className={`container mx-auto p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-4xl mx-auto`}>
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
                    </div>                      <h1 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : ''}`}>{room.name}</h1>
                    <div className={`space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p>Capacidad: {room.capacity} personas</p>
                      {room.price && <p>Precio: <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>€{room.price}/hora</span></p>}
                      {room.description && <p>Descripción: {room.description}</p>}
                      <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Complete el formulario a continuación para reservar esta sala</p>
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
                  <div className="mt-6 space-y-4">                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Hora de inicio</span>
                      <div className="relative" ref={startRef}>
                        <button
                          onClick={() => {
                            setIsStartOpen(!isStartOpen)
                            setIsEndOpen(false)
                          }}
                          className={`appearance-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200'} border rounded-md py-2 pl-4 pr-8 text-sm cursor-pointer relative min-w-[120px] text-left focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-[#1C6E41] focus:border-[#1C6E41]' : 'focus:ring-[#1a472a] focus:border-[#1a472a]'} flex items-center justify-between`}
                        >                          <div className="flex items-center">
                            <svg className={`h-4 w-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{startTime}</span>
                          </div>
                          <svg
                            className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-400'} transition-transform ${isStartOpen ? 'rotate-0' : 'rotate-180'}`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>                        {isStartOpen && (
                          <div className={`absolute bottom-full left-0 z-50 max-h-[200px] w-full overflow-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg`}>
                            {generateTimeSlots().map((time) => (
                              <div
                                key={time}
                                className={`px-4 py-2 cursor-pointer ${isDark 
                                  ? `hover:bg-gray-700 ${time === startTime ? 'bg-gray-700 text-gray-100' : 'text-gray-200'}`
                                  : `hover:bg-gray-100 ${time === startTime ? 'bg-gray-100' : ''}`
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
                    <div className="flex justify-between items-center">                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Hora de fin</span>
                      <div className="relative" ref={endRef}>
                        <button
                          onClick={() => {
                            setIsEndOpen(!isEndOpen)
                            setIsStartOpen(false)
                          }}
                          className={`appearance-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200'} border rounded-md py-2 pl-4 pr-8 text-sm cursor-pointer relative min-w-[120px] text-left focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-[#1C6E41] focus:border-[#1C6E41]' : 'focus:ring-[#1a472a] focus:border-[#1a472a]'} flex items-center justify-between`}
                        >
                          <div className="flex items-center">
                            <svg className={`h-4 w-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{endTime}</span>
                          </div>
                          <svg
                            className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-400'} transition-transform ${isEndOpen ? 'rotate-0' : 'rotate-180'}`}
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
                          <div className={`absolute bottom-full left-0 z-50 max-h-[200px] w-full overflow-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg`}>
                            {generateEndTimes(startTime).map((time) => (
                              <div
                                key={time}
                                className={`px-4 py-2 cursor-pointer ${isDark 
                                  ? `hover:bg-gray-700 ${time === endTime ? 'bg-gray-700 text-gray-100' : 'text-gray-200'}`
                                  : `hover:bg-gray-100 ${time === endTime ? 'bg-gray-100' : ''}`
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
              </div>              {/* Reservation Summary */}
              {selectedDate && startTime && endTime && (
                <div className={`mt-6 ${isDark ? 'bg-blue-900 bg-opacity-20 border-blue-800' : 'bg-blue-50 border-blue-200'} p-4 rounded-lg border`}>
                  <h3 className={`text-lg font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'} mb-2`}>Resumen de la reserva</h3>                  

                  <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'} space-y-1`}>
                    <p><span className="font-medium">Sala:</span> {room?.name}</p>
                    <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    <p><span className="font-medium">Horario:</span> {startTime} - {endTime}</p>                    
                    {room?.price && (
                      <>
                        <p><span className="font-medium">Precio por hora:</span> €{room.price}</p>
                        <p><span className="font-medium">Duración:</span> {calculateHourDifference(startTime, endTime).toFixed(1)} horas</p>
                        <p className={`text-lg font-bold ${isDark ? 'text-blue-200' : 'text-blue-800'} mt-2`}>Precio total: €{totalPrice.toFixed(2)}</p>
                      </>
                    )}
                  </div>
                </div>
              )}              {/* Success message */}
              {successMessage && (
                <div className={`${isDark ? 'bg-green-900 bg-opacity-20 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'} border p-4 rounded-lg mb-8 flex items-start`}>
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <div>
                    <p className="font-medium">{successMessage}</p>
                    <p className="text-sm mt-1">Puede ver sus reservas en la sección "Mis Reservas".</p>
                    <button
                      onClick={() => navigate('/reservations')}
                      className={`mt-2 text-white ${isDark ? 'bg-[#1C6E41] hover:bg-[#2A7D4D]' : 'bg-green-600 hover:bg-green-700'} px-3 py-1 rounded text-sm`}
                    >
                      Ver mis reservas
                    </button>
                  </div>
                </div>
              )}              {
                error && (
                  <div className={`${isDark ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border p-4 rounded-lg mb-8 flex items-start`}>
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

              {/* Payment Modal */}
              <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSubmit={handlePaymentSubmit}
                isSubmitting={isSubmitting}
                room={room}
                selectedDate={selectedDate || new Date()}
                startTime={startTime}
                endTime={endTime}
                totalPrice={totalPrice}
              />

              {/* Reserve/Proceed to Payment Button */}
              <div className="mt-6">                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedDate || !startTime || !endTime || isSubmitting}
                  className={`w-full py-3 rounded-lg transition-colors ${selectedDate && startTime && endTime && !isSubmitting
                    ? isDark
                      ? 'bg-[#1C6E41] text-white hover:bg-[#2A7D4D]'
                      : 'bg-[#1a472a] text-white hover:bg-[#2d5a3c]'
                    : isDark
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner className="h-5 w-5 mr-2" />
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      Proceder al pago
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
