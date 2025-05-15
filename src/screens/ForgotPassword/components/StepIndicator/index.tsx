import { JSX } from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps): JSX.Element => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            index < currentStep
              ? 'bg-[#1a472a]'
              : index === currentStep
                ? 'bg-[#2d5a3c] w-4'
                : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default StepIndicator
