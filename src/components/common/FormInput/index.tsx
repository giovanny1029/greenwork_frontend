import { JSX, InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FormInput = ({ label, error, className = '', ...props }: FormInputProps): JSX.Element => {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 
          focus:ring-green-500 focus:border-green-500 
          ${error ? 'border-red-500' : ''} 
          ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default FormInput
