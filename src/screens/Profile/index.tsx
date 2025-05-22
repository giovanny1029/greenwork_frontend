import { JSX, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import ProfileImage from './components/ProfileImage'
import FormInput from '../../components/common/FormInput'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Profile = (): JSX.Element => {
  const { user, updateProfile, changePassword, deleteAccount, profileImage } = useAuth()
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [firstName, setFirstName] = useState<string>(user?.first_name || '')
  const [lastName, setLastName] = useState<string>(user?.last_name || '')
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')

  // Validation state
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    currentPassword?: string
    newPassword?: string
  }>({})

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deletePassword, setDeletePassword] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name)
      setLastName(user.last_name)
    } else {
      // If user is null, navigate to login
      navigate('/login')
    }
  }, [user, navigate])

  // Handle profile data update
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset error and message state
    setErrors({})
    setMessage(null)

    // Validate form inputs
    const formErrors: {
      firstName?: string
      lastName?: string
    } = {}

    if (firstName.trim().length < 2) {
      formErrors.firstName = 'El nombre debe tener al menos 2 caracteres'
    }

    if (lastName.trim().length < 2) {
      formErrors.lastName = 'Los apellidos deben tener al menos 2 caracteres'
    }

    // If there are errors, don't proceed
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsUpdating(true)

    try {
      // Actualizar los datos del perfil
      if (user && (firstName !== user.first_name || lastName !== user.last_name)) {
        await updateProfile(firstName, lastName)
      }

      setMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al actualizar el perfil'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset error and message state
    setErrors({})
    setMessage(null)

    // Validate password fields
    const formErrors: {
      currentPassword?: string
      newPassword?: string
    } = {}

    if (!currentPassword) {
      formErrors.currentPassword = 'Debes introducir tu contraseña actual'
    }

    if (!newPassword) {
      formErrors.newPassword = 'Debes introducir una nueva contraseña'
    } else if (newPassword.length < 8) {
      formErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    }

    // If there are errors, don't proceed
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsUpdating(true)

    try {
      await changePassword(currentPassword, newPassword)

      setMessage({
        type: 'success',
        text: 'Contraseña actualizada correctamente'
      })

      // Limpiar campos de contraseña
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al cambiar la contraseña'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({
        type: 'error',
        text: 'Debes introducir tu contraseña para confirmar la eliminación de tu cuenta'
      })
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      await deleteAccount(deletePassword)
      // No need to redirect, the auth context will clear user data and redirect automatically
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar la cuenta'
      })
      setIsDeleting(false)
      // Keep the modal open in case of error
    }
  }

  return (
        <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Mi Perfil</h1>          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? isDark ? 'bg-green-900 bg-opacity-20 text-green-300' : 'bg-green-50 text-green-700'
                  : isDark ? 'bg-red-900 bg-opacity-20 text-red-300' : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <Card className="shadow-md">
            <div className="flex justify-center mb-8">
              <ProfileImage initialImage={profileImage} />
            </div>            {isUpdating && (
              <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-white'} bg-opacity-75 flex items-center justify-center rounded-xl`}>
                <LoadingSpinner />
              </div>
            )}

            {/* Form for profile data */}
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nombre"
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                />
                <FormInput
                  label="Apellidos"
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : 'Actualizar perfil'}
                </Button>
              </div>
            </form>

            {/* Form for password change */}
            <form
              onSubmit={handlePasswordChange}              className={`space-y-5 mt-8 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <h3 className={`font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cambiar contraseña</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Contraseña actual"
                  type="password"
                  id="password"
                  name="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors.currentPassword}
                />
                <FormInput
                  label="Contraseña nueva"
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="secondary" disabled={isUpdating}>
                  {isUpdating ? 'Actualizando...' : 'Cambiar contraseña'}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-4 border-t border-gray-200 text-right">              <button
                className={`text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm`}
                onClick={() => setShowDeleteModal(true)}
              >
                Darme de baja
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Eliminar cuenta</h3>

            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. Esta
              operación no se puede deshacer.
            </p>

            <div className="mb-4">
              <label
                htmlFor="delete-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Introduce tu contraseña para confirmar
              </label>
              <input
                type="password"
                id="delete-password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
