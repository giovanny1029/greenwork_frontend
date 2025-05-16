import { JSX, ReactNode } from 'react'
import Button from '../../../common/Button'

interface AdminTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    width?: string
  }[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  keyExtractor: (item: T) => string
  isLoading?: boolean
}

function AdminTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  keyExtractor,
  isLoading = false
}: AdminTableProps<T>): JSX.Element {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.width || ''
                }`}
              >
                {column.header}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
              {' '}
              {columns.map((column, index) => {
                let cellContent: ReactNode

                if (typeof column.accessor === 'function') {
                  cellContent = column.accessor(item)
                } else {
                  cellContent = item[column.accessor] as ReactNode
                }

                return (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cellContent}
                  </td>
                )
              })}
              {(onView || onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <Button
                        type="button"
                        variant="white"
                        className="px-3 py-1 text-xs"
                        onClick={() => onView(item)}
                      >
                        Ver
                      </Button>
                    )}{' '}
                    {onEdit && (
                      <Button
                        type="button"
                        variant="white"
                        className="px-3 py-1 text-xs"
                        onClick={() => {
                          console.log('Editando item:', JSON.stringify(item))
                          try {
                            onEdit(item)
                          } catch (error) {
                            console.error('Error al editar item:', error)
                          }
                        }}
                      >
                        Editar
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        type="button"
                        variant="white"
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
                        onClick={() => onDelete(item)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
