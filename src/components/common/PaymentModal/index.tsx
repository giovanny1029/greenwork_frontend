import { JSX, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Room } from '../../../services/rooms'
import LoadingSpinner from '../LoadingSpinner'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (paymentData: PaymentData) => void
  isSubmitting: boolean
  room: Room | null
  selectedDate: Date
  startTime: string
  endTime: string
  totalPrice: number
}

export interface PaymentData {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

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

const PaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  room,
  selectedDate,
  startTime,
  endTime,
  totalPrice
}: PaymentModalProps): JSX.Element => {
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState<Partial<PaymentData>>({})

  if (!isOpen) {
    return <></>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Partial<PaymentData> = {}
    
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Introduce un número de tarjeta válido de 16 dígitos'
    }
    
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Introduce el nombre del titular'
    }
    
    if (!expiryDate.trim() || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Formato MM/YY requerido'
    }
    
    if (!cvv.trim() || cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'Introduce un CVV válido'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        cardNumber,
        cardHolder,
        expiryDate,
        cvv
      })
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`
    } else {
      return cleanValue
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-full p-4 text-center sm:block sm:p-0">
        {/* Dark overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirmar reserva y pago
                </h3>
                
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Resumen de la reserva</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><span className="font-medium">Sala:</span> {room?.name}</p>
                    <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    <p><span className="font-medium">Horario:</span> {startTime} - {endTime}</p>
                    {room?.price && (
                      <>
                        <p><span className="font-medium">Precio por hora:</span> €{room.price}</p>
                        <p><span className="font-medium">Duración:</span> {calculateHourDifference(startTime, endTime).toFixed(1)} horas</p>
                        <p className="text-lg font-bold text-blue-800 mt-2">Precio total: €{totalPrice.toFixed(2)}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                      Número de Tarjeta
                    </label>
                    <input
                      className={`shadow appearance-none border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs italic mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardHolder">
                      Titular de la Tarjeta
                    </label>
                    <input
                      className={`shadow appearance-none border ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                      id="cardHolder"
                      type="text"
                      placeholder="NOMBRE APELLIDO"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    />
                    {errors.cardHolder && <p className="text-red-500 text-xs italic mt-1">{errors.cardHolder}</p>}
                  </div>
                  
                  <div className="flex mb-4">
                    <div className="w-1/2 pr-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                        Fecha de Expiración
                      </label>
                      <input
                        className={`shadow appearance-none border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs italic mt-1">{errors.expiryDate}</p>}
                    </div>
                    
                    <div className="w-1/2 pl-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        className={`shadow appearance-none border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, '').substring(0, 4))}
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs italic mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      className="bg-white text-gray-700 font-bold py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:shadow-outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1a472a] hover:bg-[#2d5a3c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner className="h-4 w-4 mr-2" />
                          Procesando...
                        </>
                      ) : (
                        <>Reservar y Pagar</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
