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

interface AuthResponse {
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

    // Si el error es 401 (No autorizado) y no es un intento de refresco de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
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
        // Si no se puede refrescar el token, redirigir al login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Enviando solicitud de login:', credentials)
    const response = await api.post<AuthResponse>('/api/login', credentials)
    console.log('Respuesta bruta del servidor:', response)
    const { data } = response
    return data
  } catch (error: any) {
    console.error('Error en solicitud de login:', error.response || error)
    if (error.response && error.response.data) {
      console.error('Detalles del error:', error.response.data)
      throw new Error(error.response.data.message || 'Error en la autenticación')
    }
    throw new Error('Error en la conexión con el servidor')
  }
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const { data: responseData } = await api.post<AuthResponse>('/api/register', data)
    return responseData
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error en el registro')
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
    const { data } = await api.delete<{ message: string }>(`/api/users/${userId}`, {
      data: { password }
    })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar la cuenta')
  }
}
