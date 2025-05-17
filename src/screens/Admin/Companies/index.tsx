import { JSX, useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import AdminTable from '../../../components/admin/common/AdminTable'
import AdminModal from '../../../components/admin/common/AdminModal'
import Button from '../../../components/common/Button'
import CompanyImage from '../../../components/common/CompanyImage'
import { adminCompanyServices, adminUserServices, Company, User } from '../../../services/admin'

const AdminCompanies = (): JSX.Element => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCompany, setCurrentCompany] = useState<Partial<Company> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Cargar compañías y usuarios
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [companiesData, usersData] = await Promise.all([
        adminCompanyServices.getCompanies(),
        adminUserServices.getUsers()
      ])
      setCompanies(companiesData)
      setUsers(usersData)
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
    setCurrentCompany((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Manejar cambios en la imagen
  const handleImageChange = (file: File) => {
    console.log('Imagen seleccionada para la compañía:', file.name)
    // No es necesario hacer nada más aquí porque CompanyImage maneja la actualización
    // La imagen se actualiza después de guardar la compañía
  }

  // Validar formulario
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!currentCompany?.name) {
      errors.name = 'El nombre es obligatorio'
    }

    if (!currentCompany?.email) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(currentCompany.email)) {
      errors.email = 'El email no es válido'
    }

    if (!currentCompany?.user_id) {
      errors.user_id = 'El usuario es obligatorio'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Guardar compañía
  const handleSaveCompany = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      let savedCompany: Company;
      
      if (currentCompany?.id) {
        // Actualizar compañía existente
        savedCompany = await adminCompanyServices.updateCompany(currentCompany.id, currentCompany)
      } else {
        // Crear nueva compañía
        savedCompany = await adminCompanyServices.createCompany(currentCompany as Omit<Company, 'id'>)
      }

      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al guardar compañía:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar compañía
  const handleDeleteCompany = async () => {
    if (!companyToDelete) return

    try {
      setIsSubmitting(true)
      await adminCompanyServices.deleteCompany(companyToDelete.id)
      setIsDeleteModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error al eliminar compañía:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener nombre de usuario por ID
  const getUserNameById = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.first_name} ${user.last_name}` : 'Usuario desconocido'
  }

  // Columnas para la tabla
  const columns = [
    {
      header: 'Logo',
      accessor: (company: Company) => (
        <CompanyImage companyId={company.id} size={40} readonly={true} />
      ),
      width: '80px'
    },
    {
      header: 'Nombre',
      accessor: 'name' as keyof Company
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Company
    },
    {
      header: 'Teléfono',
      accessor: 'phone' as keyof Company
    },
    {
      header: 'Propietario',
      accessor: (company: Company) => getUserNameById(company.user_id)
    }
  ]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Compañías</h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de todas las compañías del sistema. Puedes crear, editar y eliminar compañías.
            </p>
          </div>
          {
            !isLoading && companies?.length === 0 && (
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setCurrentCompany({
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      user_id: ''
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
                  Añadir Compañía
                </Button>
              </div>
            )
          }
        </div>

        <div className="mt-8">
          <AdminTable
            data={companies}
            columns={columns}
            keyExtractor={(company) => company.id}
            isLoading={isLoading}
            onEdit={(company) => {
              setCurrentCompany(company)
              setFormErrors({})
              setIsModalOpen(true)
            }}
            onDelete={(company) => {
              setCompanyToDelete(company)
              setIsDeleteModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* Modal para crear/editar compañía */}
      <AdminModal
        isOpen={isModalOpen}
        title={currentCompany?.id ? 'Editar Compañía' : 'Crear Compañía'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCompany}
        isSubmitting={isSubmitting}
      >
        <form className="space-y-4">
          <div className="flex justify-center mb-4">
            {currentCompany?.id && (
              <CompanyImage 
                companyId={currentCompany.id} 
                size={120} 
                onImageChange={handleImageChange}
              />
            )}
            {!currentCompany?.id && (
              <div className="text-center text-gray-500 text-sm">
                Podrás añadir un logo después de crear la compañía
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
              value={currentCompany?.name || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.name ? 'border-red-300' : ''
              }`}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={currentCompany?.email || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.email ? 'border-red-300' : ''
              }`}
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={currentCompany?.phone || ''}
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
              value={currentCompany?.address || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
              Propietario
            </label>
            <select
              id="user_id"
              name="user_id"
              value={currentCompany?.user_id || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.user_id ? 'border-red-300' : ''
              }`}
            >
              <option value="">Selecciona un usuario</option>
              {users.filter((user) => user.role === 'admin').map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
            {formErrors.user_id && (
              <p className="mt-1 text-sm text-red-600">{formErrors.user_id}</p>
            )}
          </div>
        </form>
      </AdminModal>

      {/* Modal de confirmación para eliminar */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Compañía"
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteCompany}
        submitLabel="Eliminar"
        isSubmitting={isSubmitting}
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar la compañía{' '}
          <span className="font-medium">{companyToDelete?.name}</span>? Esta acción no se puede
          deshacer.
        </p>
      </AdminModal>
    </AdminLayout>
  )
}

export default AdminCompanies
