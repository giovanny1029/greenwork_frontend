import { JSX } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import LoadingSpinner from '../../common/LoadingSpinner'

interface AdminRouteProps {
  children: JSX.Element
}

const AdminRoute = ({ children }: AdminRouteProps): JSX.Element => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return children
}

export default AdminRoute
