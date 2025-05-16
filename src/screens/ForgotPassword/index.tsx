import { JSX, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Section from '../../components/common/Section'
import GradientText from '../../components/common/GradientText'
import EmailStep from './components/EmailStep'
import VerificationStep from './components/VerificationStep'
import NewPasswordStep from './components/NewPasswordStep'
import StepIndicator from './components/StepIndicator'

type Step = 'email' | 'verification' | 'newPassword'

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(
    null
  )

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
    if (!password) return null

    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

    if (score <= 2) return 'weak'
    if (score === 3) return 'medium'
    return 'strong'
  }

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }, [newPassword])

  const getCurrentStepNumber = () => {
    switch (step) {
      case 'email':
        return 0
      case 'verification':
        return 1
      case 'newPassword':
        return 2
      default:
        return 0
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep('verification')
    } catch (err) {
      setError('Error al enviar el código de verificación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep('newPassword')
    } catch (err) {
      setError('Código de verificación inválido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Código reenviado correctamente')
    } catch (err) {
      setError('Error al reenviar el código')
    } finally {
      setIsResending(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (passwordStrength !== 'strong') {
      setError('La contraseña no cumple con los requisitos mínimos')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate('/login')
    } catch (err) {
      setError('Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <EmailStep
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
          />
        )

      case 'verification':
        return (
          <VerificationStep
            email={email}
            code={verificationCode}
            onCodeChange={setVerificationCode}
            onSubmit={handleVerificationSubmit}
            onResendCode={handleResendCode}
            isLoading={isLoading}
            isResending={isResending}
          />
        )

      case 'newPassword':
        return (
          <NewPasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handlePasswordReset}
            passwordError={error || undefined}
            isLoading={isLoading}
            passwordStrength={passwordStrength}
          />
        )
    }
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
            <StepIndicator currentStep={getCurrentStepNumber()} totalSteps={3} />

            {error && !error.includes('contraseña') && (
              <div className="mb-6 p-3 text-red-500 bg-red-50 rounded-lg text-center">{error}</div>
            )}

            {renderStep()}

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
    </div>
  )
}

export default ForgotPassword
