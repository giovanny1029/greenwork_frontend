import { JSX, useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import {
  adminUserServices,
  adminRoomServices,
  adminReservationServices,
  adminCompanyServices
} from '../../../services/admin'

const AdminDashboard = (): JSX.Element => {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    rooms: 0,
    reservations: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Cargar datos para estadísticas
        const [users, companies, rooms, reservations] = await Promise.all([
          adminUserServices.getUsers(),
          adminCompanyServices.getCompanies(),
          adminRoomServices.getRooms(),
          adminReservationServices.getReservations()
        ])

        setStats({
          users: users.length,
          companies: companies.length,
          rooms: rooms.length,
          reservations: reservations.length
        })
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Tarjetas de estadísticas
  const statCards = [
    {
      title: 'Usuarios',
      value: stats.users,
      icon: (
        <svg
          className="w-8 h-8 text-[#1a472a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )
    },
    {
      title: 'Compañías',
      value: stats.companies,
      icon: (
        <svg
          className="w-8 h-8 text-[#1a472a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      )
    },
    {
      title: 'Salas',
      value: stats.rooms,
      icon: (
        <svg
          className="w-8 h-8 text-[#1a472a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      )
    },
    {
      title: 'Reservas',
      value: stats.reservations,
      icon: (
        <svg
          className="w-8 h-8 text-[#1a472a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    }
  ]

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Administración</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido al panel de administración. Aquí puedes gestionar todos los datos del sistema.
        </p>

        {isLoading ? (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{card.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Documentación de Administración
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Guía rápida para gestionar el sistema
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Usuarios</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Administra los usuarios del sistema. Puedes crear, editar y eliminar usuarios.
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Compañías</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Gestiona las compañías registradas. Cada compañía puede tener varias salas.
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Salas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Administra las salas disponibles para reserva. Puedes asignar salas a compañías.
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Reservas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Gestiona todas las reservas realizadas en el sistema.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
