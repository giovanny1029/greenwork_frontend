import { api } from './api'

export interface Reservation {
  id: string
  user_id: string
  room_id: string
  date: string
  start_time: string
  end_time: string
  status: string
  total_price?: string
  payment_status?: 'pending' | 'completed' | 'failed'
  payment_method?: string
  card_last_digits?: string
  room?: {
    name: string
    company_id: string
    capacity: number
    price?: string
    address?: string
  }
}

export interface ReservationQueryParams {
  userId?: string
  roomId?: string
  date?: string
  status?: string
}

// Obtener todas las reservas con filtros opcionales
export const getReservations = async (params?: ReservationQueryParams): Promise<Reservation[]> => {
  try {
    let endpoint = '/api/reservations'

    if (params?.userId) {
      endpoint = `/api/users/${params.userId}/reservations`
    } else if (params?.roomId) {
      endpoint = `/api/rooms/${params.roomId}/reservations`
    }

    const { data } = await api.get<Reservation[]>(endpoint)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener las reservas')
  }
}

// Obtener una reserva por ID
export const getReservationById = async (id: string): Promise<Reservation> => {
  try {
    const { data } = await api.get<Reservation>(`/api/reservations/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener la reserva')
  }
}

// Crear una nueva reserva
export const createReservation = async (
  reservationData: Omit<Reservation, 'id'>
): Promise<Reservation> => {
  try {
    const { data } = await api.post<Reservation>('/api/reservations', reservationData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al crear la reserva')
  }
}

// Actualizar una reserva
export const updateReservation = async (
  id: string,
  reservationData: Partial<Reservation>
): Promise<Reservation> => {
  try {
    const { data } = await api.put<Reservation>(`/api/reservations/${id}`, reservationData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al actualizar la reserva')
  }
}

// Cancelar una reserva
export const cancelReservation = async (id: string): Promise<Reservation> => {
  try {
    const { data } = await api.put<Reservation>(`/api/reservations/${id}/cancel`, {})
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al cancelar la reserva')
  }
}

// Eliminar una reserva
export const deleteReservation = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/api/reservations/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar la reserva')
  }
}
