import { JSX, useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import AdminTable from '../../../components/admin/common/AdminTable'
import AdminModal from '../../../components/admin/common/AdminModal'
import Button from '../../../components/common/Button'
import {
  adminReservationServices,
  adminUserServices,
  adminRoomServices,
  Reservation,
  User,
  Room
} from '../../../services/admin'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES')
}

const formatTime = (timeStr: string) => {
  // Formato esperado: HH:MM:SS
  return timeStr.substring(0, 5) // Solo HH:MM
}

// Función para añadir segundos a la hora cuando sea necesario
const formatTimeForServer = (timeStr: string): string => {
  if (!timeStr) return ''
  // Si ya tiene segundos (HH:MM:SS), retornamos el valor tal cual
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr
  }
  // Si solo tiene HH:MM, añadimos :00 para los segundos
  return `${timeStr}:00`
}

const AdminReservations = (): JSX.Element => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentReservation, setCurrentReservation] = useState<Partial<Reservation> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Cargar reservas, usuarios y salas
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [reservationsData, usersData, roomsData] = await Promise.all([
        adminReservationServices.getReservations(),
        adminUserServices.getUsers(),
        adminRoomServices.getRooms()
      ])
      setReservations(reservationsData)
      setUsers(usersData)
      setRooms(roomsData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentReservation((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  // Validar formulario
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!currentReservation?.user_id) {
      errors.user_id = 'El usuario es obligatorio'
    }

    if (!currentReservation?.room_id) {
      errors.room_id = 'La sala es obligatoria'
    }

    if (!currentReservation?.date) {
      errors.date = 'La fecha es obligatoria'
    }

    if (!currentReservation?.start_time) {
      errors.start_time = 'La hora de inicio es obligatoria'
    }

    if (!currentReservation?.end_time) {
      errors.end_time = 'La hora de fin es obligatoria'
    } else if (
      currentReservation.start_time &&
      currentReservation.end_time &&
      formatTimeForServer(currentReservation.start_time) >= formatTimeForServer(currentReservation.end_time)
    ) {
      errors.end_time = 'La hora de fin debe ser posterior a la hora de inicio'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  // Guardar reserva
  const handleSaveReservation = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // Formatear los tiempos para incluir segundos antes de enviarlos al servidor
      const formattedReservation = {
        ...currentReservation,
        start_time: formatTimeForServer(currentReservation!.start_time!),
        end_time: formatTimeForServer(currentReservation!.end_time!)
      };

      if (currentReservation?.id) {
        // Actualizar reserva existente
        await adminReservationServices.updateReservation(currentReservation.id, formattedReservation)
      } else {
        // Crear nueva reserva
        await adminReservationServices.createReservation(
          formattedReservation as Omit<Reservation, 'id'>
        )
      }

      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al guardar reserva:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar reserva
  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return

    try {
      setIsSubmitting(true)
      await adminReservationServices.deleteReservation(reservationToDelete.id)
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al eliminar reserva:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener nombre de usuario por ID
  const getUserNameById = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.first_name} ${user.last_name}` : 'Usuario desconocido'
  }

  // Obtener nombre de sala por ID
  const getRoomNameById = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.name : 'Sala desconocida'
  }

  // Columnas para la tabla
  const columns = [
    {
      header: 'Usuario',
      accessor: (reservation: Reservation) => getUserNameById(reservation.user_id)
    },
    {
      header: 'Sala',
      accessor: (reservation: Reservation) => getRoomNameById(reservation.room_id)
    },
    {
      header: 'Fecha',
      accessor: (reservation: Reservation) => formatDate(reservation.date)
    },
    {
      header: 'Hora inicio',
      accessor: (reservation: Reservation) => formatTime(reservation.start_time)
    },
    {
      header: 'Hora fin',
      accessor: (reservation: Reservation) => formatTime(reservation.end_time)
    },
    {
      header: 'Estado',
      accessor: (reservation: Reservation) => {
        switch (reservation.status) {
          case 'confirmed':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Confirmada
              </span>
            )
          case 'pending':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pendiente
              </span>
            )
          case 'cancelled':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Cancelada
              </span>
            )
          default:
            return reservation.status
        }
      }
    }
  ]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Reservas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de todas las reservas del sistema. Puedes crear, editar y eliminar reservas.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentReservation({
                  user_id: '',
                  room_id: '',
                  date: new Date().toISOString().split('T')[0],
                  start_time: '',
                  end_time: '',
                  status: 'confirmed'
                })
                setFormErrors({})
                setIsModalOpen(true)
              }}
              className="inline-flex items-center"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Añadir Reserva
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <AdminTable
            data={reservations}
            columns={columns}
            keyExtractor={(reservation) => reservation.id}
            isLoading={isLoading}
            onEdit={(reservation) => {
              setCurrentReservation(reservation)
              setFormErrors({})
              setIsModalOpen(true)
            }}
            onDelete={(reservation) => {
              setReservationToDelete(reservation)
              setIsDeleteModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* Modal para crear/editar reserva */}
      <AdminModal
        isOpen={isModalOpen}
        title={currentReservation?.id ? 'Editar Reserva' : 'Crear Reserva'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveReservation}
        isSubmitting={isSubmitting}
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <select
              id="user_id"
              name="user_id"
              value={currentReservation?.user_id || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.user_id ? 'border-red-300' : ''
              }`}
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
            {formErrors.user_id && (
              <p className="mt-1 text-sm text-red-600">{formErrors.user_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="room_id" className="block text-sm font-medium text-gray-700">
              Sala
            </label>
            <select
              id="room_id"
              name="room_id"
              value={currentReservation?.room_id || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.room_id ? 'border-red-300' : ''
              }`}
            >
              <option value="">Selecciona una sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacidad: {room.capacity})
                </option>
              ))}
            </select>
            {formErrors.room_id && (
              <p className="mt-1 text-sm text-red-600">{formErrors.room_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={currentReservation?.date || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.date ? 'border-red-300' : ''
              }`}
            />
            {formErrors.date && <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Hora inicio
              </label>
              <input
                type="time"
                name="start_time"
                id="start_time"
                value={currentReservation?.start_time || ''}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                  formErrors.start_time ? 'border-red-300' : ''
                }`}
              />
              {formErrors.start_time && (
                <p className="mt-1 text-sm text-red-600">{formErrors.start_time}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                Hora fin
              </label>
              <input
                type="time"
                name="end_time"
                id="end_time"
                value={currentReservation?.end_time || ''}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                  formErrors.end_time ? 'border-red-300' : ''
                }`}
              />
              {formErrors.end_time && (
                <p className="mt-1 text-sm text-red-600">{formErrors.end_time}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={currentReservation?.status || 'confirmed'}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
            >
              <option value="confirmed">Confirmada</option>
              <option value="pending">Pendiente</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </form>
      </AdminModal>

      {/* Modal de confirmación para eliminar */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Reserva"
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteReservation}
        submitLabel="Eliminar"
        isSubmitting={isSubmitting}
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar la reserva para{' '}
          <span className="font-medium">
            {reservationToDelete && getRoomNameById(reservationToDelete.room_id)}
          </span>{' '}
          el día{' '}
          <span className="font-medium">
            {reservationToDelete && formatDate(reservationToDelete.date)}
          </span>
          ? Esta acción no se puede deshacer.
        </p>
      </AdminModal>
    </AdminLayout>
  )
}

export default AdminReservations
