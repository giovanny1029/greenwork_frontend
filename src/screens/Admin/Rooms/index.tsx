import { JSX, useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import AdminTable from '../../../components/admin/common/AdminTable'
import AdminModal from '../../../components/admin/common/AdminModal'
import Button from '../../../components/common/Button'
import RoomImage from '../../../components/common/RoomImage'
import { adminRoomServices, adminCompanyServices, Room, Company } from '../../../services/admin'
import { decodeUtf8Text } from '../../../utils/encoding'

const AdminRooms = (): JSX.Element => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentRoom, setCurrentRoom] = useState<Partial<Room> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [roomsData, companiesData] = await Promise.all([
        adminRoomServices.getRooms(),
        adminCompanyServices.getCompanies()
      ])
      setRooms(roomsData)
      setCompanies(companiesData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    if (name === 'company_id') {
      const selectedCompany = companies.find(company => company.id === value)
      
      setCurrentRoom((prev) => ({
        ...prev,
        company_id: value,
        address: decodeUtf8Text(selectedCompany?.address) || ''
      }))
    } else {
      setCurrentRoom((prev) => ({
        ...prev,
        [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value
      }))
    }
  }

  useEffect(() => {
    if (isModalOpen && !currentRoom?.id && companies.length > 0) {
      const defaultCompany = companies[0]
      setCurrentRoom(prev => ({
        ...prev,
        company_id: defaultCompany.id,
        address: decodeUtf8Text(defaultCompany?.address) || ''
      }))
    }
  }, [isModalOpen, companies])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!currentRoom?.name) {
      errors.name = 'El nombre es obligatorio'
    }

    if (!currentRoom?.company_id) {
      errors.company_id = 'La compañía es obligatoria'
    }

    if (!currentRoom?.capacity || currentRoom.capacity <= 0) {
      errors.capacity = 'La capacidad debe ser mayor que 0'
    }

    if (currentRoom?.price && !/^\d+(\.\d{1,2})?$/.test(currentRoom.price)) {
      errors.price = 'El precio debe ser un número válido (ej: 100 o 100.50)'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveRoom = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      if (currentRoom?.id) {
        await adminRoomServices.updateRoom(currentRoom.id, currentRoom)
      } else {
        await adminRoomServices.createRoom(currentRoom as Omit<Room, 'id'>)
      }

      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al guardar sala:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return

    try {
      setIsSubmitting(true)
      await adminRoomServices.deleteRoom(roomToDelete.id)
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al eliminar sala:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCompanyNameById = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    return company ? company.name : 'Compañía desconocida'
  }

  const columns = [
    {
      header: 'Imagen',
      accessor: (room: Room) => (
        <RoomImage roomId={room.id} size={40} readonly={true} />
      ),
      width: '80px'
    },
    {
      header: 'Nombre',
      accessor: 'name' as keyof Room
    },
    {
      header: 'Compañía',
      accessor: (room: Room) => getCompanyNameById(room.company_id)
    },    {
      header: 'Capacidad',
      accessor: 'capacity' as keyof Room
    },    {
      header: 'Precio',
      accessor: (room: Room) => room.price ? `€${room.price} / hora` : 'No establecido'
    },
    {
      header: 'Estado',
      accessor: (room: Room) => {
        switch (room.status) {
          case 'available':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Disponible
              </span>
            )
          case 'maintenance':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Mantenimiento
              </span>
            )
          case 'unavailable':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                No disponible
              </span>
            )
          default:
            return room.status
        }
      }
    }
  ]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Salas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de todas las salas disponibles. Puedes crear, editar y eliminar salas.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentRoom({
                  name: '',
                  company_id: companies.length > 0 ? companies[0].id : '',
                  capacity: 0,
                  status: 'available',
                  description: '',
                  price: ''
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
              Añadir Sala
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <AdminTable
            data={rooms}
            columns={columns}
            keyExtractor={(room) => room?.id}
            isLoading={isLoading}
            onEdit={(room) => {
              setCurrentRoom(room)
              setFormErrors({})
              setIsModalOpen(true)
            }}
            onDelete={(room) => {
              setRoomToDelete(room)
              setIsDeleteModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* Modal para crear/editar sala */}
      <AdminModal
        isOpen={isModalOpen}
        title={currentRoom?.id ? 'Editar Sala' : 'Crear Sala'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveRoom}
        isSubmitting={isSubmitting}
      >
        <form className="space-y-4">
          <div className="flex justify-center mb-4">
            {currentRoom?.id && (
              <RoomImage
                roomId={currentRoom.id}
                size={120}
                isBanner={false}
              />
            )}
            {!currentRoom?.id && (
              <div className="text-center text-gray-500 text-sm">
                Podrás añadir una imagen después de crear la sala
              </div>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={currentRoom?.name || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${formErrors.name ? 'border-red-300' : ''
                }`}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          {
            companies?.length > 0 && (
              <div>
                <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">
                  Compañía
                </label>
                <select
                  id="company_id"
                  name="company_id"
                  value={currentRoom?.company_id || companies[0]?.id || ''}                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${formErrors.company_id ? 'border-red-300' : ''
                    }`}
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {formErrors.company_id && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.company_id}</p>
                )}
              </div>
            )
          }


          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacidad
            </label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              min="1"
              value={currentRoom?.capacity || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${formErrors.capacity ? 'border-red-300' : ''
                }`}
            />
            {formErrors.capacity && (
              <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={currentRoom?.status || 'available'}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
            >
              <option value="available">Disponible</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="unavailable">No disponible</option>
            </select>          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={currentRoom?.description || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={currentRoom?.address || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
              placeholder="Ej: Calle Principal 123, Ciudad"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio por hora
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                value={currentRoom?.price || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                className="mt-1 block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">EUR</span>
              </div>
            </div>
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>
        </form>
      </AdminModal>

      {/* Modal de confirmación para eliminar */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Sala"
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteRoom}
        submitLabel="Eliminar"
        isSubmitting={isSubmitting}
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar la sala{' '}
          <span className="font-medium">{roomToDelete?.name}</span>? Esta acción no se puede
          deshacer.
        </p>
      </AdminModal>
    </AdminLayout>
  )
}

export default AdminRooms
