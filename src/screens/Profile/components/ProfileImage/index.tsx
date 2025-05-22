import { JSX, useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'

interface ProfileImageProps {
  initialImage?: string
  onImageChange?: (file: File) => void
  size?: number
}

const ProfileImage = ({
  initialImage,
  onImageChange,
  size = 128
}: ProfileImageProps): JSX.Element => {  const { user, profileImage, updateProfileImage } = useAuth()
  const [image, setImage] = useState<string>(
    initialImage || profileImage || 
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOC4wMiAxLjM0IDguMDIgNHYuMDNjLS4wMS43My0uMjUgMS40My0uNyAyLjAyLTEuMDYgMS40LTIuODQgMS44NC00LjMzIDEuODQtMS4zMSAwLTMuMDgtLjM1LTQuMTgtMS41OS0uNi0uNjgtLjc5LTEuNTgtLjc5LTIuNDQgMC0yLjY2IDUuMzItMy44NiA3Ljk4LTMuODZ6TTEyIDIwYy0yLjIxIDAtNC4yNy0uNy01Ljk2LTEuODkuNDQtMS40NCAyLjA5LTEuODEgNC41My0yLjA3IDEuODYuNTcgMy44OC41NyA1Ljc0IDAtLjc5IDIuNTMtMy42NiAzLjk2LTQuMzEgMy45NnoiIGZpbGw9IiM2NjYiLz48L3N2Zz4='
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Actualizar la imagen cuando cambie profileImage en el contexto
  useEffect(() => {
    if (profileImage) {
      console.log('ProfileImage: Actualizando imagen desde contexto')
      setImage(profileImage)
    }
  }, [profileImage])

  useEffect(() => {
    if (initialImage) {
      console.log('ProfileImage: Actualizando imagen desde prop initialImage')
      setImage(initialImage)
    }
  }, [initialImage])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('ProfileImage: Archivo seleccionado', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        console.log('ProfileImage: Vista previa generada con tamaño', result.length)
        setImage(result)
      }
      reader.readAsDataURL(file)
      
      // Llamar al método onImageChange proporcionado al componente
      if (onImageChange) {
        console.log('ProfileImage: Llamando a onImageChange')
        onImageChange(file)
      }
      
      // También actualizar la imagen del perfil en el contexto de autenticación
      if (user) {
        console.log('ProfileImage: Actualizando imagen de perfil para el usuario:', user.id)
        // El servicio imageService.updateProfileImage ya maneja la lógica de POST/PUT internamente
        // Si el usuario ya tiene una imagen, se hará un PUT, si no, se hará un POST
        updateProfileImage(file)
          .then(() => {
            console.log('ProfileImage: Imagen de perfil actualizada exitosamente')
          })
          .catch((error: any) => {
            console.error('ProfileImage: Error al actualizar la imagen de perfil:', error)
          })
      }
    }
  }
  return (
    <div
      className="relative cursor-pointer group flex items-center justify-center mx-auto"
      style={{ width: size, height: size }}
      onClick={handleImageClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">        <img
          src={image}
          alt="Profile"
          className="w-full h-full rounded-full object-contain border-4 border-white shadow-md"
        />
        <div className="absolute -bottom-1 -right-1 bg-[#1a472a] rounded-full p-1 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="text-white text-sm bg-[#1a472a] px-3 py-1 rounded-full shadow">
          Cambiar foto
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  )
}

export default ProfileImage
