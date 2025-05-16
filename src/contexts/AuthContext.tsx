import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { login, register } from '../services/auth'

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
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateProfile: (firstName: string, lastName: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: async () => {},
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

  // Verificar el token al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          // Aquí podríamos hacer una solicitud para validar el token y obtener los datos del usuario
          // Por ahora, solo verificamos si hay un token almacenado
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
          setToken(storedToken)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    console.log('agskuyafskuavcksjavsja')
    try {
      const response = await login({ email, password })
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setToken(response.access_token)
      setUser(response.user)
      setIsLoading(false)
    } catch (err: any) {
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
      setIsLoading(false)
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
    setToken(null)
    setUser(null)
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
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil')
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
      await changePassword(user.id, currentPassword, newPassword)
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
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError,
        updateProfile: handleUpdateProfile,
        changePassword: handleChangePassword,
        deleteAccount: handleDeleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
