import { JSX, ReactNode } from 'react'
import Button from '../../../common/Button'

interface AdminModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const AdminModal = ({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = 'Guardar',
  isSubmitting = false
}: AdminModalProps): JSX.Element => {
  if (!isOpen) return <></>

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 transition-opacity z-40" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-40"></div>
        </div>
        {/* Esta parte centra el modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        {/* Modal content */}        <div
          className="relative inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 dark:bg-gray-800 bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800 bg-white">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium dark:text-gray-100 text-gray-900" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>          <div className="dark:bg-gray-700 bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {onSubmit && (
              <Button
                variant="secondary"
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto sm:ml-3"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  submitLabel
                )}
              </Button>
            )}
            <Button
              variant="white"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto mt-3 sm:mt-0"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminModal
