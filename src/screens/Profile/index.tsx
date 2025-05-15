import { JSX } from 'react'
import Header from '../../components/Header'
import ProfileImage from './components/ProfileImage'
import FormInput from '../../components/common/FormInput'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Section from '../../components/common/Section'

const Profile = (): JSX.Element => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#2d5a3c] p-4">
      <Header />
      <Section>
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex justify-center mb-8">
              <ProfileImage />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput label="Nombre" type="text" id="nombre" name="nombre" />
              <FormInput label="Apellidos" type="text" id="apellidos" name="apellidos" />
              <FormInput label="Contraseña actual" type="password" id="password" name="password" />
              <FormInput
                label="Contraseña nueva"
                type="password"
                id="newPassword"
                name="newPassword"
              />
              <Button type="submit" variant="secondary">
                Guardar cambios
              </Button>
            </form>

            <div className="mt-6 text-right">
              <button className="text-red-600 hover:text-red-800 text-sm">Darme de baja</button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  )
}

export default Profile
