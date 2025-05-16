import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
    if (token) {
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
    const originalRequest = error.config

    // Si el error es 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Intentar renovar el token con el refresh token
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          // Si no hay refresh token, redirigir al login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Llamar al endpoint de refresh token
        const { data } = await axios.post(`${API_URL}/api/refresh`, {
          refresh_token: refreshToken
        })

        // Guardar el nuevo token
        localStorage.setItem('token', data.access_token)

        // Actualizar el header y volver a intentar la petición original
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
        return axios(originalRequest)
      } catch (refreshError) {
        // Si falla la renovación, limpiar datos de sesión y redirigir al login
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
