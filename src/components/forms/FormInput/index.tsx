import React from 'react'

interface FormInputProps {
    label: string
    type: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
}

function FormInput({ label, type, name, value, onChange, placeholder, className = '' }: FormInputProps) {
    return (
        <div>
            <label htmlFor={label} className='block text-green-700 text-sm font-medium text-gray-700'>
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500 ${className}`}
            />
        </div>
    )
}

export default FormInput
