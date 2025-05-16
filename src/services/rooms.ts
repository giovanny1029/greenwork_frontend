import axios from 'axios'
import { api } from './api'

export interface Room {
  id: string
  company_id: string
  name: string
  capacity: number
  status: string
  description: string
  equipment?: string
  location?: string
  price?: string
}

export interface RoomQueryParams {
  companyId?: string
  status?: string
}

// Obtener todas las salas
export const getRooms = async (params?: RoomQueryParams): Promise<Room[]> => {
  try {
    let endpoint = '/api/rooms'

    if (params?.companyId) {
      endpoint = `/api/companies/${params.companyId}/rooms`
    }

    const { data } = await api.get<Room[]>(endpoint)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener las salas')
  }
}

// Obtener una sala por ID
export const getRoomById = async (id: string): Promise<Room> => {
  try {
    const { data } = await api.get<Room>(`/api/rooms/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener la sala')
  }
}

// Crear una nueva sala
export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => {
  try {
    const { data } = await api.post<Room>('/api/rooms', roomData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al crear la sala')
  }
}

// Actualizar una sala
export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
  try {
    const { data } = await api.put<Room>(`/api/rooms/${id}`, roomData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al actualizar la sala')
  }
}

// Eliminar una sala
export const deleteRoom = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/api/rooms/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar la sala')
  }
}
