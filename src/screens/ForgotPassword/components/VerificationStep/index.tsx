import { JSX } from 'react'
import FormInput from '../../../../components/common/FormInput'
import Button from '../../../../components/common/Button'
import LoadingSpinner from '../../../../components/common/LoadingSpinner'
import GradientText from '../../../../components/common/GradientText'

interface VerificationStepProps {
  email: string
  code: string
  onCodeChange: (code: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onResendCode: () => Promise<void>
  isLoading?: boolean
  isResending?: boolean
}

const VerificationStep = ({
  email,
  code,
  onCodeChange,
  onSubmit,
  onResendCode,
  isLoading = false,
  isResending = false
}: VerificationStepProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <GradientText text="Verificar código" from="green-600" to="emerald-700" />
        </h2>
        <div className="text-center">
          <p className="text-gray-600">Hemos enviado un código de verificación a</p>
          <p className="font-medium text-[#1a472a]">{email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <FormInput
            label="Código de verificación"
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="text-center text-2xl tracking-wider focus:border-[#1a472a] focus:ring-[#1a472a]"
            required
          />

          <button
            type="button"
            onClick={onResendCode}
            disabled={isResending}
            className="w-full text-sm text-gray-600 hover:text-white hover:bg-[#1a472a] rounded px-2 py-1 transition-colors flex items-center justify-center space-x-2"
          >
            {isResending ? (
              <>
                <LoadingSpinner size="small" />
                <span>Reenviando código...</span>
              </>
            ) : (
              'No recibí el código'
            )}
          </button>
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="w-full bg-[#1a472a] hover:bg-[#2d5a3c] flex items-center justify-center space-x-2 h-12"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span>Verificando...</span>
            </>
          ) : (
            'Verificar'
          )}
        </Button>
      </div>
    </form>
  )
}

export default VerificationStep
