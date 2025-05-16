import { JSX, useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import AdminTable from '../../../components/admin/common/AdminTable'
import AdminModal from '../../../components/admin/common/AdminModal'
import Button from '../../../components/common/Button'
import { adminUserService, User } from '../../../services/adminUserService'
import { toast } from 'react-hot-toast'

const AdminUsers = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await adminUserService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Validar formulario
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!currentUser?.first_name) {
      errors.first_name = 'El nombre es obligatorio'
    }

    if (!currentUser?.last_name) {
      errors.last_name = 'El apellido es obligatorio'
    }

    if (!currentUser?.email) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
      errors.email = 'El email no es válido'
    }

    if (!currentUser?.id && !currentUser?.password) {
      errors.password = 'La contraseña es obligatoria para nuevos usuarios'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  } // Guardar usuario
  const handleSaveUser = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      console.log('Guardando usuario:', currentUser)

      // Obtener el rol actual del usuario que está haciendo la edición
      const currentLoggedUserStr = localStorage.getItem('user')
      const currentLoggedUser = currentLoggedUserStr ? JSON.parse(currentLoggedUserStr) : null

      console.log(
        'Usuario actual logueado:',
        currentLoggedUser
          ? `${currentLoggedUser.first_name} (${currentLoggedUser.role})`
          : 'No hay usuario logueado'
      )

      if (currentUser?.id) {
        // Actualizar usuario existente
        console.log(`Intentando actualizar usuario con ID ${currentUser.id}`)

        // Crear una copia limpia de los datos a actualizar
        const userDataToUpdate: Partial<User> = {}

        // Siempre incluir estos campos básicos
        userDataToUpdate.first_name = currentUser.first_name
        userDataToUpdate.last_name = currentUser.last_name
        userDataToUpdate.email = currentUser.email

        // Solo incluir la contraseña si se proporcionó una nueva
        if (currentUser.password && currentUser.password.trim() !== '') {
          userDataToUpdate.password = currentUser.password
        }

        // Solo incluir el rol si el usuario actual es administrador
        // Esto evita que un administrador pierda accidentalmente sus privilegios
        if (currentLoggedUser?.role === 'admin') {
          userDataToUpdate.role = currentUser.role
        }

        console.log('Datos a actualizar:', userDataToUpdate)

        try {
          const updatedUser = await adminUserService.updateUser(currentUser.id, userDataToUpdate)
          console.log('Usuario actualizado exitosamente:', updatedUser)
          toast.success('Usuario actualizado correctamente')
          setIsModalOpen(false)
          fetchUsers()
        } catch (error: any) {
          console.error('Error en actualización:', error)
          // Mostrar mensaje de error específico al usuario
          toast.error(`Error al actualizar: ${error.message || 'Error desconocido'}`)
        }
      } else {
        // Crear nuevo usuario
        console.log('Intentando crear nuevo usuario')
        try {
          const newUser = await adminUserService.createUser(currentUser as Omit<User, 'id'>)
          console.log('Usuario creado exitosamente:', newUser)
          toast.success('Usuario creado correctamente')
          setIsModalOpen(false)
          fetchUsers()
        } catch (error: any) {
          console.error('Error en creación:', error)
          toast.error(`Error al crear: ${error.message || 'Error desconocido'}`)
        }
      }
    } catch (error) {
      console.error('Error general al guardar usuario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsSubmitting(true)
      await adminUserService.deleteUser(userToDelete.id)
      toast.success('Usuario eliminado correctamente')
      setIsDeleteModalOpen(false)
      fetchUsers()
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error)
      toast.error(`Error al eliminar: ${error.message || 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  // Columnas para la tabla
  const columns = [
    {
      header: 'Nombre',
      accessor: (user: User) => `${user.first_name} ${user.last_name}`
    },
    {
      header: 'Email',
      accessor: (user: User) => user.email
    },
    {
      header: 'Rol',
      accessor: (user: User) => {
        switch (user.role) {
          case 'admin':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Administrador
              </span>
            )
          case 'user':
            return (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Usuario
              </span>
            )
          default:
            return user.role
        }
      }
    }
  ] as { header: string; accessor: (item: User) => React.ReactNode; width?: string }[]

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Usuarios</h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de todos los usuarios del sistema. Puedes crear, editar y eliminar usuarios.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentUser({
                  first_name: '',
                  last_name: '',
                  email: '',
                  role: 'user',
                  password: ''
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
              Añadir Usuario
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <AdminTable
            data={users}
            columns={columns}
            keyExtractor={(user) => user.id}
            isLoading={isLoading}
            onEdit={(user) => {
              setCurrentUser({
                ...user,
                password: '' // No mostrar contraseña actual
              })
              setFormErrors({})
              setIsModalOpen(true)
            }}
            onDelete={(user) => {
              setUserToDelete(user)
              setIsDeleteModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      <AdminModal
        isOpen={isModalOpen}
        title={currentUser?.id ? 'Editar Usuario' : 'Crear Usuario'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        isSubmitting={isSubmitting}
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={currentUser?.first_name || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.first_name ? 'border-red-300' : ''
              }`}
            />
            {formErrors.first_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={currentUser?.last_name || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.last_name ? 'border-red-300' : ''
              }`}
            />
            {formErrors.last_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={currentUser?.email || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.email ? 'border-red-300' : ''
              }`}
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>{' '}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={currentUser?.role || 'user'}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Nota: Solo los administradores pueden cambiar los roles de usuario.
            </p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {currentUser?.id
                ? 'Nueva Contraseña (dejar en blanco para mantener la actual)'
                : 'Contraseña'}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={currentUser?.password || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a472a] focus:ring-[#1a472a] sm:text-sm ${
                formErrors.password ? 'border-red-300' : ''
              }`}
              placeholder={currentUser?.id ? '••••••••' : ''}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
        </form>
      </AdminModal>

      {/* Modal de confirmación para eliminar */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Usuario"
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteUser}
        submitLabel="Eliminar"
        isSubmitting={isSubmitting}
      >
        <p className="text-sm text-gray-500">
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <span className="font-medium">
            {userToDelete?.first_name} {userToDelete?.last_name}
          </span>
          ? Esta acción no se puede deshacer.
        </p>
      </AdminModal>
    </AdminLayout>
  )
}

export default AdminUsers
