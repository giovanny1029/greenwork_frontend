import { JSX } from 'react'
import FormInput from '../../../../components/common/FormInput'
import Button from '../../../../components/common/Button'
import LoadingSpinner from '../../../../components/common/LoadingSpinner'
import GradientText from '../../../../components/common/GradientText'

interface NewPasswordStepProps {
  newPassword: string
  confirmPassword: string
  onNewPasswordChange: (password: string) => void
  onConfirmPasswordChange: (password: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  passwordError?: string
  isLoading?: boolean
  passwordStrength: 'weak' | 'medium' | 'strong' | null
}

interface PasswordRequirementProps {
  fulfilled: boolean
  text: string
}

const PasswordRequirement = ({ fulfilled, text }: PasswordRequirementProps) => (
  <li className={`flex items-center space-x-2 ${fulfilled ? 'text-green-600' : 'text-gray-500'}`}>
    <span className="flex-shrink-0">
      {fulfilled ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      )}
    </span>
    <span>{text}</span>
  </li>
)

const PasswordStrengthIndicator = ({
  strength
}: {
  strength: 'weak' | 'medium' | 'strong' | null
}) => {
  const getColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
      default:
        return 'bg-gray-200'
    }
  }

  const getWidth = () => {
    switch (strength) {
      case 'weak':
        return 'w-1/3'
      case 'medium':
        return 'w-2/3'
      case 'strong':
        return 'w-full'
      default:
        return 'w-0'
    }
  }

  return (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-500 ease-out ${getColor()} ${getWidth()}`} />
    </div>
  )
}

const PasswordRequirements = ({
  password,
  strength
}: {
  password: string
  strength: 'weak' | 'medium' | 'strong' | null
}) => {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Fortaleza:</span>
          <span
            className={`text-sm font-medium ${
              strength === 'weak'
                ? 'text-red-500'
                : strength === 'medium'
                  ? 'text-yellow-500'
                  : strength === 'strong'
                    ? 'text-green-500'
                    : 'text-gray-400'
            }`}
          >
            {strength === 'weak'
              ? 'Débil'
              : strength === 'medium'
                ? 'Media'
                : strength === 'strong'
                  ? 'Fuerte'
                  : 'No válida'}
          </span>
        </div>
        <PasswordStrengthIndicator strength={strength} />
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Requisitos:</p>
        <ul className="space-y-2">
          <PasswordRequirement fulfilled={hasMinLength} text="Al menos 8 caracteres" />
          <PasswordRequirement fulfilled={hasUppercase} text="Una letra mayúscula" />
          <PasswordRequirement fulfilled={hasNumber} text="Un número" />
          <PasswordRequirement fulfilled={hasSpecial} text="Un carácter especial" />
        </ul>
      </div>
    </div>
  )
}

const NewPasswordStep = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  passwordError,
  isLoading = false,
  passwordStrength
}: NewPasswordStepProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <GradientText text="Nueva contraseña" from="green-600" to="emerald-700" />
        </h2>
        <p className="text-gray-600">Crea una contraseña segura para tu cuenta</p>
      </div>

      <div className="space-y-6">
        <FormInput
          label="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          error={passwordError}
          className="focus:border-[#1a472a] focus:ring-[#1a472a]"
          required
        />

        <PasswordRequirements password={newPassword} strength={passwordStrength} />

        <FormInput
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          className="focus:border-[#1a472a] focus:ring-[#1a472a]"
          required
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full bg-[#1a472a] hover:bg-[#2d5a3c] flex items-center justify-center space-x-2 h-12"
          disabled={isLoading || passwordStrength !== 'strong' || !confirmPassword}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span>Actualizando...</span>
            </>
          ) : (
            'Confirmar cambio'
          )}
        </Button>
      </div>
    </form>
  )
}

export default NewPasswordStep
