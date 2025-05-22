import { api } from './api'

// Interfaces
export interface ImageResponse {
  id_image: number
  name: string
  imagescol: string // Base64 de la imagen
}

interface ApiSuccessResponse {
  success: boolean
  message: string
  image: ImageResponse
}

export enum ImageType {
  PROFILE = 'profile',
  COMPANY = 'company',
  ROOM = 'room'
}

// Servicio para imágenes
const imageService = {
  /**
   * Sube una imagen 
   * @param id ID del usuario o compañía
   * @param file Archivo de la imagen
   * @param type Tipo de imagen (perfil o compañía)
   * @returns Respuesta con datos de la imagen
   */
  uploadImage: async (id: string, file: File, type: ImageType): Promise<ImageResponse> => {
    const formData = new FormData()
    formData.append('image', file)
    
    // El nombre debe ser "id-type", por ejemplo: "1-profile" o "2-company"
    const name = `${id}-${type}`
    formData.append('name', name)
    
    try {
      console.log(`Creando nueva imagen de ${type} para el elemento ${id} con nombre ${name}`)
      const response = await api.post<ApiSuccessResponse>('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
      })
      
      console.log('Respuesta completa del POST:', response)
      
      console.log('Respuesta de creación de imagen:', response.data)
      
      // Guardar URL de la imagen en localStorage para tener acceso rápido si es una imagen de perfil
      if (type === ImageType.PROFILE && response.data.image && response.data.image.imagescol) {
        localStorage.setItem('profileImage', `data:image/jpeg;base64,${response.data.image.imagescol}`)
        console.log('Imagen de perfil guardada en localStorage')
      }
      
      return response.data.image
    } catch (error) {
      console.error(`Error al subir la imagen de ${type}:`, error)
      throw error
    }
  },
  
  /**
   * Obtiene una imagen
   * @param id ID del usuario o compañía
   * @param type Tipo de imagen (perfil o compañía)
   * @returns Respuesta con datos de la imagen
   */
  getImage: async (id: string, type: ImageType): Promise<ImageResponse> => {
    const name = `${id}-${type}`
    try {
      console.log(`Obteniendo imagen de ${type} para el elemento ${id} con nombre ${name}`)
      const response = await api.get<ImageResponse>(`/api/images/${name}`)
      
      // Guardar URL de la imagen en localStorage para tener acceso rápido si es una imagen de perfil
      if (type === ImageType.PROFILE && response.data && response.data.imagescol) {
        console.log('Imagen de perfil encontrada, guardando en localStorage')
        localStorage.setItem('profileImage', `data:image/jpeg;base64,${response.data.imagescol}`)
      }
      
      return response.data
    } catch (error: any) {
      // Si obtenemos un 404, es un error esperado que significa que no existe la imagen
      if (error.response && error.response.status === 404) {
        console.log(`Imagen de ${type} no encontrada para el elemento ${id}`)
      } else {
        console.error(`Error inesperado al obtener la imagen de ${type}:`, error)
      }
      throw error
    }
  },
  
  /**
   * Actualiza una imagen
   * @param id ID del usuario o compañía
   * @param file Archivo de la imagen
   * @param type Tipo de imagen (perfil o compañía)
   * @returns Respuesta con datos de la imagen
   */
  updateImage: async (id: string, file: File, type: ImageType): Promise<ImageResponse> => {
    console.log(`Preparando actualización de imagen de ${type} para elemento:`, id)
    
    try {
      // Primero verificamos si ya existe una imagen
      let existingImage: ImageResponse | null = null
      
      try {
        existingImage = await imageService.getImage(id, type)
        console.log('Imagen existente encontrada con ID:', existingImage.id_image)
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log(`No se encontró imagen de ${type} existente, se creará una nueva`)
          return imageService.uploadImage(id, file, type)
        } else {
          console.error('Error al verificar si existe imagen:', error)
          throw error
        }
      }
      
      // Si llegamos aquí, ya existe una imagen que debemos actualizar
      
      // Enfoque con JSON y base64 para evitar problemas con multipart/form-data en PUT
      console.log('Usando enfoque de actualización con JSON y base64')
      
      // Convertir archivo a base64
      const fileReader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        fileReader.onload = () => {
          try {
            // Extraer sólo la parte base64 (quitar "data:image/jpeg;base64,")
            const result = fileReader.result as string
            const base64 = result.split(',')[1]
            resolve(base64)
          } catch (err) {
            reject(err)
          }
        }
        fileReader.onerror = () => reject(fileReader.error)
        fileReader.readAsDataURL(file)
      })
      
      const base64Data = await base64Promise
      console.log('Imagen convertida a base64:', { length: base64Data.length })
      
      // Enviar como JSON
      const response = await api.put<ApiSuccessResponse>(`/api/images/${existingImage.id_image}`, {
        name: `${id}-${type}`,
        imageData: base64Data 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('Respuesta de actualización:', response.data)
      
      if (response.data.image && response.data.image.imagescol) {
        if (type === ImageType.PROFILE) {
          const imageUrl = `data:image/jpeg;base64,${response.data.image.imagescol}`
          localStorage.setItem('profileImage', imageUrl)
          console.log('Imagen de perfil actualizada y guardada en localStorage')
        }
        return response.data.image
      } else {
        console.warn('La respuesta no contiene la imagen actualizada:', response.data)
        throw new Error('La respuesta no contiene la imagen actualizada')
      }
    } catch (error) {
      console.error(`Error al actualizar la imagen de ${type}:`, error)
      throw error
    }
  },
  
  /**
   * Métodos específicos para imágenes de perfil (para mantener compatibilidad con el código existente)
   */
  uploadProfileImage: async (userId: string, file: File): Promise<ImageResponse> => {
    return imageService.uploadImage(userId, file, ImageType.PROFILE)
  },
    getProfileImage: async (userId: string): Promise<ImageResponse> => {
    return imageService.getImage(userId, ImageType.PROFILE)
  },
  
  updateProfileImage: async (userId: string, file: File): Promise<ImageResponse> => {
    return imageService.updateImage(userId, file, ImageType.PROFILE)
  },
  
  /**
   * Obtiene la URL de la imagen de perfil desde el localStorage o retorna undefined
   */
  getProfileImageFromLocalStorage: (): string | undefined => {
    return localStorage.getItem('profileImage') || undefined
  }
}

export default imageService
