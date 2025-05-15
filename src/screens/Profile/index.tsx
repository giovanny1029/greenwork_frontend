import React, { JSX } from 'react'
import Header from '../../components/Header'
import FormInput from '../../components/forms/FormInput'
import Button from '../../components/forms/Button'

const Profile = (): JSX.Element => {
  const [user, setUser] = React.useState({
    nombre: '',
    apellidos: '',
    password: '',
    newPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  console.log({user})

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      <Header />

      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Nombre"
              type="text"
              name="nombre"
              value=""
              onChange={handleChange}
              placeholder="Ingrese su nombre"
            />

            <FormInput
              label="Apellidos"
              type="text"
              name="apellidos"
              value=""
              onChange={handleChange}
              placeholder="Ingrese sus apellidos"
            />

            <FormInput
              label="Contraseña actual"
              type="password"
              name="password"
              value=""
              onChange={handleChange}
              placeholder="Ingrese su contraseña actual"
            />

            <FormInput
              label="Contraseña nueva"
              type="password"
              name="newPassword"
              value=""
              onChange={handleChange}
              placeholder="Ingrese su nueva contraseña"
            />
            <Button type="submit" className="cursor-pointer w-full bg-[#2d5a3c] text-white py-2 px-4 rounded-md hover:bg-[#1a472a] transition-colors" text="Guardar cambios" />
          </form>

          <div className="mt-6 text-right">
            <a className="cursor-pointer text-red-600 hover:text-red-800 text-sm" href="#">
              Darme de baja
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
