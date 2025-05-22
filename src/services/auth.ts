import axios from 'axios'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  access_token: string
  refresh_token: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

interface RefreshTokenData {
  refresh_token: string
}

interface PasswordResetRequestData {
  email: string
}

interface PasswordResetData {
  token: string
  password: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Configurar interceptor para añadir token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Verificar si es una ruta de autenticación (login/register)
    const isAuthRoute =
      originalRequest.url &&
      (originalRequest.url.includes('/api/login') || originalRequest.url.includes('/api/register'))

    // Si el error es 401 (No autorizado) y no es un intento de refresco de token
    // y NO es una ruta de autenticación (importante para evitar ciclos)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          console.warn('No hay refresh token disponible, no se puede renovar la sesión')
          // Limpiamos el almacenamiento sin lanzar error para evitar ciclos
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          return Promise.reject(
            new Error('La sesión ha expirado, por favor inicia sesión nuevamente.')
          )
        }

        const { data } = await api.post<AuthResponse>('/api/refresh', {
          refresh_token: refreshToken
        })

        // Actualizar el token en localStorage
        localStorage.setItem('token', data.access_token)

        // Actualizar el token en la cabecera de la petición original
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`

        // Reintentar la petición original
        return api(originalRequest)
      } catch (refreshError) {
        // Si no se puede refrescar el token, limpiar los datos de sesión
        // pero NO redirigir automáticamente para evitar recargas inesperadas
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // Eliminamos la redirección automática que podría estar causando el problema
        // window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Enviando solicitud de login:', credentials)

    // Asegurarnos de que la solicitud incluya los encabezados correctos
    const response = await api.post<AuthResponse>('/api/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Respuesta exitosa del servidor:', response)
    const { data } = response

    // Validar que la respuesta contenga todos los datos necesarios
    if (!data || !data.access_token || !data.refresh_token || !data.user) {
      console.error('Respuesta incompleta del servidor:', data)
      throw new Error('La respuesta del servidor no contiene todos los datos necesarios')
    }

    return data
  } catch (error: any) {
    console.error('Error en solicitud de login:', error)

    // Prevenir cualquier redirección automática
    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      })

      // Manejar específicamente errores de autenticación (401)
      if (error.response.status === 401) {
        throw new Error('Credenciales incorrectas. Por favor, verifica tu email y contraseña.')
      }

      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message)
      }

      // Error genérico de autenticación si no hay mensaje específico
      throw new Error('Error en la autenticación')
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta:', error.request)
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.')
    } else {
      // Error al configurar la solicitud
      console.error('Error de configuración:', error.message)
      throw new Error('Error en la configuración de la solicitud: ' + error.message)
    }
  }
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Enviando solicitud de registro:', { ...data, password: '***' })
    const { data: responseData } = await api.post<AuthResponse>('/api/register', data)
    console.log('Registro exitoso:', responseData)
    return responseData
  } catch (error: any) {
    console.error('Error en registro:', error)

    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data
      })

      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message)
      }
    }

    throw new Error(error?.message || 'Error en el registro')
  }
}

export const refreshToken = async (refreshData: RefreshTokenData): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/api/refresh', refreshData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al refrescar el token')
  }
}

export const requestPasswordReset = async (
  requestData: PasswordResetRequestData
): Promise<{ message: string }> => {
  try {
    const { data } = await api.post<{ message: string }>('/api/forgot-password', requestData)
    return data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Error al solicitar el restablecimiento de contraseña'
    )
  }
}

export const resetPassword = async (resetData: PasswordResetData): Promise<{ message: string }> => {
  try {
    const { data } = await api.post<{ message: string }>('/api/reset-password', resetData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al restablecer la contraseña')
  }
}

export const updateProfile = async (
  userId: string,
  updateData: UpdateProfileData
): Promise<AuthResponse> => {
  try {
    const { data } = await api.put<AuthResponse>(`/api/users/${userId}`, updateData)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al actualizar el perfil')
  }
}

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const { data } = await api.post<{ message: string }>(`/api/users/${userId}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al cambiar la contraseña')
  }
}

export const deleteAccount = async (
  userId: string,
  password: string
): Promise<{ message: string }> => {
  try {
    // Using axios directly for DELETE requests with body
    const response = await axios({
      method: 'DELETE',
      url: `${API_URL}/api/users/${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: { password }
    })

    // Ensure we return the expected format
    if (response.data && typeof response.data === 'object') {
      if ('message' in response.data) {
        return response.data as { message: string }
      }
      // If server doesn't return a message property, create one
      return { message: 'Cuenta eliminada correctamente' }
    }

    // Default fallback
    return { message: 'Operación completada correctamente' }
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar la cuenta')
  }
}
