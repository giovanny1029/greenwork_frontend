import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Section from '../../components/common/Section'

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate()

  const handleOpenEmail = () => {
    window.location.href = 'mailto:greenworkemp@gmail.com?subject=Solicitud de cambio de contraseña&body=Hola, necesito cambiar mi contraseña. Mi nombre de usuario es: '
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 text-white">
        <h1 className="text-8xl font-normal mb-12">GreenWork</h1>
        <div className="text-5xl font-light space-y-2 text-[#C5D3CA]">
          <h2>Recupera tu</h2>
          <h3>acceso</h3>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <Section>
          <Card className="w-full max-w-md p-8 rounded-3xl shadow-[0_0_50px_0_rgba(0,0,0,0.1)]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recuperación de contraseña</h2>
              
              <div className="mb-6 text-gray-600">
                <p className="mb-4">
                  Para restablecer tu contraseña, por favor envía un correo electrónico a nuestro 
                  equipo de soporte utilizando el botón a continuación.
                </p>
                <p className="mb-4">
                  Nuestro equipo procesará tu solicitud y te enviará instrucciones para crear 
                  una nueva contraseña.
                </p>
              </div>

              <button
                onClick={handleOpenEmail}
                className="w-full bg-[#1a472a] hover:bg-[#0f2b19] text-white py-3 px-6 rounded-lg mb-6 transition-colors"
              >
                Enviar correo electrónico
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 hover:text-[#1a472a] underline transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </Card>
        </Section>
      </div>
    </div>  )
}

export default ForgotPassword
