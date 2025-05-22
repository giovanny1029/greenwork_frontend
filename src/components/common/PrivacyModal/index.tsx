import { JSX } from 'react'
import Button from '../Button'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps): JSX.Element => {
  if (!isOpen) return <></>

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 transition-opacity z-40" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-40"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Política de Privacidad
                </h3>
                <div className="mt-4 max-h-[60vh] overflow-y-auto text-sm text-gray-500 space-y-4">
                  <p>
                    En Europa y en España existen normas de protección de datos pensadas para proteger su información personal de obligado cumplimiento para nuestra entidad.
                  </p>

                  <p>
                    Por ello, es muy importante para nosotros que entienda perfectamente qué vamos a hacer con los datos personales que le pedimos.
                  </p>

                  <p>
                    Así, seremos transparentes y le daremos el control de sus datos, con un lenguaje sencillo y opciones claras que le permitirán decidir qué haremos con su información personal.
                  </p>

                  <p>
                    Por favor, si una vez leída la presente información le queda alguna duda, no dude en preguntarnos.
                  </p>

                  <p>
                    Muchas gracias por su colaboración.
                  </p>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Quiénes somos?</h4>
                    <ul className="list-none space-y-2">
                      <li><strong>Nuestra denominación:</strong> GREENWORK</li>
                      <li><strong>Nuestra actividad principal:</strong> Servicios de coworking y alquiler de espacios de trabajo</li>
                      <li><strong>Nuestra dirección:</strong> IES Fernando Sagaseta, C. Manuel Alemán Álamo, 1, 35220 Valle de Jinamar, Las Palmas</li>
                      <li><strong>Nuestro teléfono de contacto:</strong> 605335423</li>
                      <li><strong>Nuestra dirección de correo electrónico de contacto:</strong> greenwork1995@gmail.com</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Para qué vamos a usar sus datos?</h4>
                    <p>
                      Con carácter general, sus datos personales serán usados para poder relacionarnos con usted y poder prestarle nuestros servicios.
                    </p>
                    <p>
                      Asimismo, también pueden ser usados para otras actividades, como enviarle publicidad o promocionar nuestras actividades.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Por qué necesitamos usar sus datos?</h4>
                    <p>
                      Sus datos personales son necesarios para poder relacionarnos con usted y poder prestarle nuestros servicios. En este sentido, pondremos a su disposición una serie de casillas que le permitirán decidir de manera clara y sencilla sobre el uso de su información personal.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Quién va a conocer la información que le pedimos?</h4>
                    <p>
                      Con carácter general, sólo el personal de nuestra entidad que esté debidamente autorizado podrá tener conocimiento de la información que le pedimos.
                    </p>
                    <p>
                      De igual modo, podrán tener conocimiento de su información personal aquellas entidades que necesiten tener acceso a la misma para que podamos prestarle nuestros servicios. Así por ejemplo, nuestro banco conocerá sus datos si el pago de nuestros servicios se realiza mediante tarjeta o transferencia bancaria.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Cómo vamos a proteger sus datos?</h4>
                    <p>
                      Protegeremos sus datos con medidas de seguridad eficaces en función de los riesgos que conlleve el uso de su información.
                    </p>
                    <p>
                      Para ello, nuestra entidad ha aprobado una Política de Protección de Datos y se realizan controles y auditorías anuales para verificar que sus datos personales están seguros en todo momento.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Durante cuánto tiempo vamos a conservar sus datos?</h4>
                    <p>
                      Conservaremos sus datos durante nuestra relación y mientras nos obliguen las leyes. Una vez finalizados los plazos legales aplicables, procederemos a eliminarlos de forma segura y respetuosa con el medio ambiente.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Cuáles son sus derechos de protección de datos?</h4>
                    <p>
                      En cualquier momento puede dirigirse a nosotros para:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Saber qué información tenemos sobre usted</li>
                      <li>Rectificarla si fuese incorrecta</li>
                      <li>Eliminarla una vez finalizada nuestra relación</li>
                      <li>Solicitar el traspaso de su información a otra entidad (portabilidad)</li>
                    </ul>
                    <p className="mt-2">
                      Para ejercer estos derechos, deberá realizar una solicitud escrita a nuestra dirección, junto con una fotocopia de su DNI.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Puede retirar su consentimiento?</h4>
                    <p>
                      Usted puede retirar su consentimiento si cambia de opinión sobre el uso de sus datos en cualquier momento, contactándonos en nuestra dirección de correo electrónico.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">¿Dónde puede formular una reclamación?</h4>
                    <p>
                      Si entiende que sus derechos han sido desatendidos, puede formular una reclamación en la Agencia Española de Protección de Datos (www.agpd.es).
                    </p>
                  </div>

                  <div className="mt-6 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">¿Usaremos sus datos para otros fines?</h4>
                    <p>
                      Nuestra política es no usar sus datos para otras finalidades distintas a las que le hemos explicado. Si necesitásemos usar sus datos para actividades distintas, siempre le solicitaremos previamente su permiso a través de opciones claras que le permitirán decidir al respecto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              variant="white"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
