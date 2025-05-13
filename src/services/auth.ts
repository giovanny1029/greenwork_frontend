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

interface AuthResponse {
  token: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface ErrorResponse {
  message: string
}

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/users/login', credentials)
    return data
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Error en la autenticación'
    throw new Error(errorMessage)
  }
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/register', data)
    return response.data
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Error en el registro'
    throw new Error(errorMessage)
  }
}
