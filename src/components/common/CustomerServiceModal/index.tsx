import { JSX } from 'react'

interface CustomerServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CustomerServiceModal = ({ isOpen, onClose }: CustomerServiceModalProps): JSX.Element => {
  if (!isOpen) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <button
            className="absolute -right-2 -top-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
          
          <h3 className="text-lg font-bold mb-4 text-[#1a472a]">Servicio al Cliente</h3>
          
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Envíanos un correo:</p>
              <div className="space-y-2">
                <a 
                  href="mailto:greenwork1995@gmail.com" 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=greenwork1995@gmail.com', '_blank');
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="group-hover:underline">greenwork1995@gmail.com</span>
                </a>
                <div className="flex space-x-2 pl-7">
                  <button 
                    onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=greenwork1995@gmail.com', '_blank')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Abrir en Gmail
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Contáctanos:</p>
              <div className="space-y-2">
                <div className="flex items-center text-blue-600">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>605 33 54 23</span>
                </div>
                <p className="text-sm text-gray-500 pl-7">
                  Puede llamar a este número o escribirnos por WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerServiceModal