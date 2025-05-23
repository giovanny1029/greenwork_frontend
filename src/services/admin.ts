import { api } from './api'

// Tipos de datos
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  preferred_language?: string
  password?: string
}

export interface Company {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Room {
  id: string
  company_id: string
  name: string
  capacity: number
  status: string
  description: string
  price?: string
  address?: string
}

export interface Reservation {
  id: string
  user_id: string
  room_id: string
  date: string
  start_time: string
  end_time: string
  status: string
  user?: User
  room?: Room
}

// Servicios de Admin para Usuarios
export const adminUserServices = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/users')
    return response.data
  },
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/api/users/${id}`)
    return response.data
  },
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/api/users', userData)
    return response.data
  },
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const updateData: Record<string, any> = {}
    if (userData.first_name !== undefined) updateData.first_name = userData.first_name
    if (userData.last_name !== undefined) updateData.last_name = userData.last_name
    if (userData.email !== undefined) updateData.email = userData.email
    if (userData.role !== undefined) updateData.role = userData.role
    if (userData.password !== undefined && userData.password !== '')
      updateData.password = userData.password

    console.log('Datos a actualizar:', updateData, 'user ID:', id)
    try {
      const response = await api.put(`/api/users/${id}`, updateData)
      console.log('Respuesta del servidor:', response.data)
      const user = response.data.user || response.data
      return user
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`)
  }
}

export const adminCompanyServices = {
  getCompanies: async (): Promise<Company[]> => {
    const response = await api.get('/api/companies')
    return response.data
  },
  getCompanyById: async (id: string): Promise<Company> => {
    const response = await api.get(`/api/companies/${id}`)
    return response.data
  },
  createCompany: async (companyData: Omit<Company, 'id'>): Promise<Company> => {
    const response = await api.post('/api/companies', companyData)
    return response.data
  },
  updateCompany: async (id: string, companyData: Partial<Company>): Promise<Company> => {
    const response = await api.put(`/api/companies/${id}`, companyData)
    return response.data
  },
  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/api/companies/${id}`)
  }
}

export const adminRoomServices = {
  getRooms: async (): Promise<Room[]> => {
    const response = await api.get('/api/rooms')
    return response.data
  },
  getRoomById: async (id: string): Promise<Room> => {
    const response = await api.get(`/api/rooms/${id}`)
    return response.data
  },
  createRoom: async (roomData: Omit<Room, 'id'>): Promise<Room> => {
    const response = await api.post('/api/rooms', roomData)
    return response.data
  },
  updateRoom: async (id: string, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/api/rooms/${id}`, roomData)
    return response.data
  },
  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/api/rooms/${id}`)
  }
}

export const adminReservationServices = {
  getReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/api/reservations')
    return response.data
  },
  getReservationById: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/api/reservations/${id}`)
    return response.data
  },
  createReservation: async (reservationData: Omit<Reservation, 'id'>): Promise<Reservation> => {
    const response = await api.post('/api/reservations', reservationData)
    return response.data
  },
  updateReservation: async (
    id: string,
    reservationData: Partial<Reservation>
  ): Promise<Reservation> => {
    const response = await api.put(`/api/reservations/${id}`, reservationData)
    return response.data
  },
  deleteReservation: async (id: string): Promise<void> => {
    await api.delete(`/api/reservations/${id}`)
  }
}
