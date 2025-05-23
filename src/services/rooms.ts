import { api } from './api'
import imageService, { ImageType, ImageResponse } from './image'

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
  address?: string
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

// Funciones para manejar imágenes de sala

/**
 * Sube una imagen para una sala
 * @param roomId ID de la sala
 * @param file Archivo de imagen
 * @returns Respuesta con datos de la imagen
 */
export const uploadRoomImage = async (roomId: string, file: File): Promise<ImageResponse> => {
  return imageService.uploadImage(roomId, file, ImageType.ROOM)
}

/**
 * Obtiene la imagen de una sala
 * @param roomId ID de la sala
 * @returns Respuesta con datos de la imagen
 */
export const getRoomImage = async (roomId: string): Promise<ImageResponse> => {
  return imageService.getImage(roomId, ImageType.ROOM)
}

/**
 * Actualiza la imagen de una sala
 * @param roomId ID de la sala
 * @param file Archivo de imagen
 * @returns Respuesta con datos de la imagen
 */
export const updateRoomImage = async (roomId: string, file: File): Promise<ImageResponse> => {
  return imageService.updateImage(roomId, file, ImageType.ROOM)
}
