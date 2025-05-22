import { JSX } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Login from './screens/Login'
import RoomAvailability from './screens/RoomAvailability'
import Reservations from './screens/Reservations'
import Profile from './screens/Profile'
import Rooms from './screens/Rooms'
import ForgotPassword from './screens/ForgotPassword'
import Dashboard from './screens/Dashboard'
import Header from './components/Header'
import LoadingSpinner from './components/common/LoadingSpinner'
import AdminRoute from './components/admin/AdminRoute'

// Admin Screens
import AdminDashboard from './screens/Admin/Dashboard'
import AdminUsers from './screens/Admin/Users'
import AdminCompanies from './screens/Admin/Companies'
import AdminRooms from './screens/Admin/Rooms'
import AdminReservations from './screens/Admin/Reservations'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  const { isDark } = useTheme()

  return (
    <>
      <Header />
      <main className={`pt-16 min-h-screen ${isDark ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}>{children}</main>
    </>
  )
}

function AppRoutes(): JSX.Element {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Redirigir la raíz al dashboard si está autenticado, o al login si no */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <RoomAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <RoomAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />{' '}
      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* Rutas de administración */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <AdminRoute>
            <AdminCompanies />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <AdminRoute>
            <AdminRooms />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <AdminRoute>
            <AdminReservations />
          </AdminRoute>
        }
      />
    </Routes>
  )
}

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
