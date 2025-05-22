import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { login, register } from '../services/auth'
import imageService from '../services/image'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  profileImage: string | undefined
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateProfile: (firstName: string, lastName: string) => Promise<void>
  updateProfileImage: (file: File) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  profileImage: undefined,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: async () => {},
  updateProfileImage: async () => {},
  changePassword: async () => {},
  deleteAccount: async () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | undefined>(
    imageService.getProfileImageFromLocalStorage()
  )

  // Verificar el token al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          // Intentamos parsear el usuario almacenado
          const parsedUser = JSON.parse(storedUser)

          // Verificamos que el usuario tenga la estructura correcta
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser)
            setToken(storedToken)
            
            // Intentar cargar la imagen de perfil
            try {
              await loadProfileImage(parsedUser.id)
            } catch (imgErr) {
              console.error('Error cargando imagen de perfil:', imgErr)
            }
          } else {
            // Si el usuario no tiene la estructura correcta, limpiamos el storage
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('profileImage')
            setToken(null)
            setUser(null)
            setProfileImage(undefined)
          }
        } catch (err) {
          // Si hay un error al parsear, limpiamos el storage
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          localStorage.removeItem('profileImage')
          setToken(null)
          setUser(null)
          setProfileImage(undefined)
        }
      }
    }

    checkAuth()
  }, [])

  // Función para cargar la imagen de perfil
  const loadProfileImage = async (userId: string) => {
    try {
      // Primero intentamos obtener del localStorage
      const cachedImage = imageService.getProfileImageFromLocalStorage()
      if (cachedImage) {
        setProfileImage(cachedImage)
        return
      }
      
      // Si no hay en localStorage, la buscamos en el backend
      const imageData = await imageService.getProfileImage(userId)
      if (imageData && imageData.imagescol) {
        const imageUrl = `data:image/jpeg;base64,${imageData.imagescol}`
        setProfileImage(imageUrl)
        localStorage.setItem('profileImage', imageUrl)
      }
    } catch (error) {
      console.error('No se pudo cargar la imagen del perfil:', error)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await login({ email, password })

      // Asegurarse de que tenemos todos los datos necesarios antes de considerarlo un login exitoso
      if (!response || !response.access_token || !response.refresh_token || !response.user) {
        throw new Error('Respuesta de login incompleta')
      }

      // Guardar datos en localStorage
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Actualizar estado
      setToken(response.access_token)
      setUser(response.user)
      
      // Cargar imagen del perfil
      try {
        await loadProfileImage(response.user.id)
      } catch (imgErr) {
        console.error('Error al cargar imagen después del login:', imgErr)
      }
    } catch (err: any) {
      console.error('Error durante el login:', err)
      setError(err.message || 'Error en el inicio de sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      })
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setToken(response.access_token)
      setUser(response.user)
    } catch (err: any) {
      setError(err.message || 'Error en el registro')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('profileImage')
    setToken(null)
    setUser(null)
    setProfileImage(undefined)
  }

  const clearError = () => {
    setError(null)
  }

  const handleUpdateProfile = async (firstName: string, lastName: string) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const { updateProfile } = await import('../services/auth')
      const response = await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName
      })

      // Update user in state and localStorage
      const updatedUser = response.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Actualizar el token si viene en la respuesta
      if (response.access_token) {
        localStorage.setItem('token', response.access_token)
        setToken(response.access_token)
      }

      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token)
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfileImage = async (file: File) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('AuthContext: Iniciando actualización de imagen de perfil para el usuario:', user.id)
      
      // Verificar el objeto File
      console.log('AuthContext: Información del archivo:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      })
      
      // Subir/actualizar la imagen de perfil
      // imageService.updateProfileImage ya maneja la lógica para decidir entre POST/PUT
      const imageResponse = await imageService.updateProfileImage(user.id, file)
      console.log('AuthContext: Respuesta de actualización de imagen recibida:', imageResponse)
      
      if (imageResponse && imageResponse.imagescol) {
        const imageBase64 = `data:image/jpeg;base64,${imageResponse.imagescol}`
        console.log('AuthContext: Actualizando estado y localStorage con la nueva imagen')
        setProfileImage(imageBase64)
        localStorage.setItem('profileImage', imageBase64)
        
        // Verificar tamaño de la imagen en el localStorage 
        const storedImage = localStorage.getItem('profileImage')
        console.log('AuthContext: Imagen guardada en localStorage', {
          length: storedImage?.length || 0,
          firstChars: storedImage?.substring(0, 50) || 'no-image'
        })
      } else {
        // También mantener la actualización basada en el archivo local como respaldo
        console.log('AuthContext: La respuesta no incluye imagen, usando el archivo local')
        const reader = new FileReader()
        reader.onloadend = () => {
          const imageUrl = reader.result as string
          setProfileImage(imageUrl)
          localStorage.setItem('profileImage', imageUrl)
          console.log('AuthContext: Imagen actualizada desde archivo local')
        }
        reader.readAsDataURL(file)
      }
    } catch (err: any) {
      console.error('AuthContext: Error al actualizar la imagen de perfil:', err)
      setError(err.message || 'Error al actualizar la imagen de perfil')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const { changePassword } = await import('../services/auth')
      // Aquí sólo esperamos un mensaje del backend
      await changePassword(user.id, currentPassword, newPassword)

      // No podemos actualizar tokens aquí porque el backend no los devuelve
      // Podríamos implementar una función para obtener tokens nuevos si es necesario
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (password: string) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const { deleteAccount } = await import('../services/auth')
      await deleteAccount(user.id, password)
      // After successful deletion, log the user out
      handleLogout()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la cuenta')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        profileImage,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError,
        updateProfile: handleUpdateProfile,
        updateProfileImage: handleUpdateProfileImage,
        changePassword: handleChangePassword,
        deleteAccount: handleDeleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
