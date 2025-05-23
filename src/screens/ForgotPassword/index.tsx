import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../../components/common/Card'
import Section from '../../components/common/Section'

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
    const handleOpenEmail = () => {
    const subject = 'Solicitud de cambio de contraseña'
    const body = `Estimados/as,

Me pongo en contacto con ustedes para solicitar el cambio de mi contraseña de acceso. A continuación, les facilito mis datos personales para su verificación:

Nombre: [Tu nombre]

Apellidos: [Tus apellidos]

DNI: [Tu número de DNI] (adjunte imagen)

Agradezco de antemano su atención y quedo a la espera de sus indicaciones para continuar con el proceso de recuperación.

Reciban un cordial saludo,
[Tu nombre completo]
[Tu correo electrónico o número de contacto, si lo deseas incluir]`
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=greenwork1995@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
  }
  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-[#1a472a] to-[#2d5a3c]'}`}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 text-white">
        <h1 className="text-8xl font-normal mb-12">GreenWork</h1>
        <div className={`text-5xl font-light space-y-2 ${isDark ? 'text-green-400' : 'text-[#C5D3CA]'}`}>
          <h2>Recupera tu</h2>
          <h3>acceso</h3>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Section>
          <Card className={`w-full max-w-md p-8 rounded-3xl ${isDark ? 'shadow-[0_0_50px_0_rgba(255,255,255,0.03)]' : 'shadow-[0_0_50px_0_rgba(0,0,0,0.1)]'}`}>
            <div className="text-center">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Recuperación de contraseña</h2>
              
              <div className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                className={`w-full ${isDark ? 'bg-[#1C6E41] hover:bg-[#2A7D4D]' : 'bg-[#1a472a] hover:bg-[#0f2b19]'} text-white py-3 px-6 rounded-lg mb-6 transition-colors`}
              >
                Enviar correo electrónico
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className={`text-sm ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-[#1a472a]'} underline transition-colors`}
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
