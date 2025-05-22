import { api } from './api'
import imageService, { ImageType, ImageResponse } from './image'

export interface Company {
  id: string
  user_id: string
  name: string
  address: string
  city: string
  country: string
  postal_code: string
  phone: string
  email: string
  website: string
  logo?: string
}

// Obtener todas las compañías
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data } = await api.get<Company[]>('/api/companies')
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener las compañías')
  }
}

// Obtener compañías por user_id
export const getCompaniesByUserId = async (userId: string): Promise<Company[]> => {
  try {
    const { data } = await api.get<Company[]>(`/api/users/${userId}/companies`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener las compañías del usuario')
  }
}

// Obtener una compañía por ID
export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const { data } = await api.get<Company>(`/api/companies/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener la compañía')
  }
}

// Crear una nueva compañía
export const createCompany = async (companyData: Omit<Company, 'id'>): Promise<Company> => {
  try {
    const { data } = await api.post<Company>('/api/companies', companyData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al crear la compañía')
  }
}

// Actualizar una compañía
export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<Company> => {
  try {
    const { data } = await api.put<Company>(`/api/companies/${id}`, companyData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al actualizar la compañía')
  }
}

// Eliminar una compañía
export const deleteCompany = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/api/companies/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar la compañía')
  }
}

// Funciones para manejar imágenes de compañía

/**
 * Sube una imagen para una compañía
 * @param companyId ID de la compañía
 * @param file Archivo de imagen
 * @returns Respuesta con datos de la imagen
 */
export const uploadCompanyImage = async (companyId: string, file: File): Promise<ImageResponse> => {
  return imageService.uploadImage(companyId, file, ImageType.COMPANY)
}

/**
 * Obtiene la imagen de una compañía
 * @param companyId ID de la compañía
 * @returns Respuesta con datos de la imagen
 */
export const getCompanyImage = async (companyId: string): Promise<ImageResponse> => {
  return imageService.getImage(companyId, ImageType.COMPANY)
}

/**
 * Actualiza la imagen de una compañía
 * @param companyId ID de la compañía
 * @param file Archivo de imagen
 * @returns Respuesta con datos de la imagen
 */
export const updateCompanyImage = async (companyId: string, file: File): Promise<ImageResponse> => {
  return imageService.updateImage(companyId, file, ImageType.COMPANY)
}
