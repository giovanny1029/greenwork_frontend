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

// Servicio para imágenes
const imageService = {
  /**
   * Sube una imagen de perfil
   * @param userId ID del usuario
   * @param file Archivo de la imagen
   * @returns Respuesta con datos de la imagen
   */
  uploadProfileImage: async (userId: string, file: File): Promise<ImageResponse> => {
    const formData = new FormData()
    formData.append('image', file)
    
    // El nombre debe ser "userId-profile"
    const name = `${userId}-profile`
    formData.append('name', name)
    
    try {
      console.log(`Creando nueva imagen para el usuario ${userId} con nombre ${name}`)
      const response = await api.post<ApiSuccessResponse>('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
      })
      
      console.log('Respuesta completa del POST:', response)
      
      console.log('Respuesta de creación de imagen:', response.data)
      
      // Guardar URL de la imagen en localStorage para tener acceso rápido
      if (response.data.image && response.data.image.imagescol) {
        localStorage.setItem('profileImage', `data:image/jpeg;base64,${response.data.image.imagescol}`)
        console.log('Imagen guardada en localStorage')
      } else {
        console.warn('La respuesta no contiene la imagen esperada:', response.data)
      }
      
      return response.data.image
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error)
      throw error
    }
  },
  
  /**
   * Obtiene la imagen de perfil de un usuario
   * @param userId ID del usuario
   * @returns Respuesta con datos de la imagen
   */
  getProfileImage: async (userId: string): Promise<ImageResponse> => {
    const name = `${userId}-profile`
    try {
      console.log(`Obteniendo imagen de perfil para el usuario ${userId} con nombre ${name}`)
      const response = await api.get<ImageResponse>(`/api/images/${name}`)
      
      // Guardar URL de la imagen en localStorage para tener acceso rápido
      if (response.data && response.data.imagescol) {
        console.log('Imagen encontrada, guardando en localStorage')
        localStorage.setItem('profileImage', `data:image/jpeg;base64,${response.data.imagescol}`)
      } else {
        console.warn('La respuesta no contiene datos de imagen:', response.data)
      }
      
      return response.data
    } catch (error: any) {
      // Si obtenemos un 404, es un error esperado que significa que el usuario no tiene imagen
      if (error.response && error.response.status === 404) {
        console.log(`Imagen de perfil no encontrada para el usuario ${userId}`)
      } else {
        console.error('Error inesperado al obtener la imagen de perfil:', error)
      }
      throw error
    }
  },
  
  /**
   * Obtiene la URL de la imagen de perfil desde el localStorage o retorna undefined
   */
  getProfileImageFromLocalStorage: (): string | undefined => {
    return localStorage.getItem('profileImage') || undefined
  },
  
  /**
   * Actualiza la imagen de perfil de un usuario
   * @param userId ID del usuario
   * @param file Archivo de la imagen
   * @returns Respuesta con datos de la imagen
   */
  updateProfileImage: async (userId: string, file: File): Promise<ImageResponse> => {
    console.log('Preparando actualización de imagen para usuario:', userId)
    
    try {
      // Primero verificamos si el usuario ya tiene una imagen de perfil
      let existingImage: ImageResponse | null = null
      
      try {
        existingImage = await imageService.getProfileImage(userId)
        console.log('Imagen existente encontrada con ID:', existingImage.id_image)
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log('No se encontró imagen existente para el usuario, se creará una nueva')
          return imageService.uploadProfileImage(userId, file)
        } else {
          console.error('Error al verificar si existe imagen:', error)
          throw error
        }
      }
      
      // Si llegamos aquí, el usuario tiene una imagen existente que debemos actualizar
      
      // Enfoque alternativo: convertir a base64 y enviar como JSON
      // Este método debería funcionar incluso si hay problemas con multipart/form-data en PUT
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
        name: `${userId}-profile`,
        imageData: base64Data 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('Respuesta de actualización:', response.data)
      
      if (response.data.image && response.data.image.imagescol) {
        const imageUrl = `data:image/jpeg;base64,${response.data.image.imagescol}`
        localStorage.setItem('profileImage', imageUrl)
        console.log('Imagen actualizada y guardada en localStorage')
        return response.data.image
      } else {
        console.warn('La respuesta no contiene la imagen actualizada:', response.data)
        throw new Error('La respuesta no contiene la imagen actualizada')
      }
    } catch (error) {
      console.error('Error al actualizar la imagen de perfil:', error)
      throw error
    }
  }
}

export default imageService
