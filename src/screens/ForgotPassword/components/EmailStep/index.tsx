import { JSX } from 'react'
import FormInput from '../../../../components/common/FormInput'
import Button from '../../../../components/common/Button'
import LoadingSpinner from '../../../../components/common/LoadingSpinner'
import GradientText from '../../../../components/common/GradientText'

interface EmailStepProps {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isLoading?: boolean
}

const EmailStep = ({
  email,
  onEmailChange,
  onSubmit,
  isLoading = false
}: EmailStepProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <GradientText text="Recuperar acceso" from="green-600" to="emerald-700" />
        </h2>
        <p className="text-gray-600">
          Introduce tu correo electrónico y te enviaremos un código de verificación
        </p>
      </div>

      <div className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          className="focus:border-[#1a472a] focus:ring-[#1a472a]"
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full bg-[#1a472a] hover:bg-[#2d5a3c] flex items-center justify-center space-x-2 h-12"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span>Enviando...</span>
            </>
          ) : (
            'Enviar código'
          )}
        </Button>
      </div>
    </form>
  )
}

export default EmailStep
