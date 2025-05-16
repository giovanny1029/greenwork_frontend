import axios from 'axios'
import { AuthResponse } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

console.log('API URL configurado:', API_URL)

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Configurar interceptor para añadir token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    console.log('Interceptor de error ejecutado:', error?.response?.status)

    const originalRequest = error.config

    // Solo procesar errores 401 que no sean intentos de login/registro
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/login') &&
      !originalRequest.url.includes('/register')
    ) {
      originalRequest._retry = true
      console.log('Intentando refrescar token...')

      try {
        // Intentar renovar el token con el refresh token
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          console.log('No hay refresh token disponible')
          // No redireccionamos aquí, solo rechazamos la promesa
          return Promise.reject(new Error('No hay token de refresco disponible'))
        } // Llamar al endpoint de refresh token
        console.log('Solicitando nuevo token con refresh token')
        const response = await axios.post<AuthResponse>(`${API_URL}/api/refresh`, {
          refresh_token: refreshToken
        })

        if (response.data && response.data.access_token) {
          console.log('Nuevo token obtenido')

          // Guardar el nuevo token
          localStorage.setItem('token', response.data.access_token)

          // Actualizar el header y volver a intentar la petición original
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`
          return axios(originalRequest)
        } else {
          console.error('El endpoint de refresh token no devolvió un token válido')
          return Promise.reject(new Error('No se pudo obtener un nuevo token'))
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError)

        // No hacemos redirección automática, solo devolvemos el error
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
