import { api } from './api'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  preferred_language?: string
  password?: string
}

interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
  user?: T
  error?: boolean
}

export const adminUserService = {
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Obteniendo usuarios...')
      const response = await api.get<User[]>('/api/users')
      console.log('Usuarios obtenidos:', response.data)
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw error
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      console.log(`Obteniendo usuario con ID ${id}...`)
      const response = await api.get<User>(`/api/users/${id}`)
      console.log('Usuario obtenido:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo usuario con ID ${id}:`, error)
      throw error
    }
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      console.log('Creando usuario con datos:', userData)
      const response = await api.post<ApiResponse<User>>('/api/users', userData)
      console.log('Respuesta de creación de usuario:', response.data)
      return response.data.user || (response.data.data as User)
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  },
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // Asegurémonos de que solo enviamos los campos que realmente queremos actualizar
    const updateData: Record<string, any> = {}

    if (userData.first_name !== undefined) updateData.first_name = userData.first_name
    if (userData.last_name !== undefined) updateData.last_name = userData.last_name
    if (userData.email !== undefined) updateData.email = userData.email
    if (userData.role !== undefined) updateData.role = userData.role
    if (userData.password !== undefined && userData.password !== '')
      updateData.password = userData.password

    console.log(`Actualizando usuario con ID ${id}. Datos a actualizar:`, updateData)

    try {
      const token = localStorage.getItem('token')
      console.log('Token actual:', token ? token.substring(0, 15) + '...' : 'No existe')

      // Verificar si hay un usuario logueado en localStorage
      const currentUserStr = localStorage.getItem('user')
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        console.log('Usuario actual:', currentUser.role, 'ID:', currentUser.id)
        console.log('¿Intentando editar a sí mismo?', currentUser.id === id ? 'Sí' : 'No')
      }

      const response = await api.put<ApiResponse<User>>(`/api/users/${id}`, updateData)
      console.log('Estado de respuesta:', response.status)
      console.log('Respuesta del servidor:', response.data)

      if (response.data.error) {
        console.error('Error en respuesta:', response.data.message)
        throw new Error(response.data.message)
      }

      const user = response.data.user || (response.data.data as User)
      console.log('Usuario actualizado:', user)
      return user
    } catch (error: any) {
      console.error(`Error actualizando usuario con ID ${id}:`, error)

      // Capturar y mostrar información específica del error
      if (error.response) {
        console.error('Estado de respuesta:', error.response.status)
        console.error('Datos del error:', error.response.data)
        throw new Error(error.response.data?.message || 'Error en la actualización del usuario')
      }

      throw error
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      console.log(`Eliminando usuario con ID ${id}...`)
      await api.delete(`/api/users/${id}`)
      console.log(`Usuario con ID ${id} eliminado correctamente`)
    } catch (error) {
      console.error(`Error eliminando usuario con ID ${id}:`, error)
      throw error
    }
  }
}
