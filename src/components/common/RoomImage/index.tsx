import { JSX, useState, useRef, useEffect } from 'react'
import imageService, { ImageType } from '../../../services/image'

interface RoomImageProps {
  roomId: string
  initialImage?: string
  onImageChange?: (file: File) => void
  className?: string
  size?: number | string
  height?: number | string
  readonly?: boolean
  isBanner?: boolean
}

const RoomImage = ({
  roomId,
  initialImage,
  onImageChange,
  className = '',
  size,
  height,
  readonly = false,
  isBanner = false
}: RoomImageProps): JSX.Element => {
  const [image, setImage] = useState<string>(
    initialImage || 
    // Placeholder para la imagen de la sala
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMTBoMTh2MTBIMy0xMHptMTgtMWgyVjNoLTZ2Mkgxdi00aDIwdjE4aC0xdi0xMHptLTUtMVY0SDEwdjRINnYyaDE0YzAtMS4xLS45LTItMi0yek03IDh2Mkgxdi0yaDZ6IiBmaWxsPSIjNjY2Ii8+PC9zdmc+'
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Cargar la imagen de la sala cuando el componente se monte
  useEffect(() => {
    if (roomId && !initialImage) {
      console.log('RoomImage: Intentando cargar imagen para sala:', roomId)
      setLoading(true)
      
      imageService.getImage(roomId, ImageType.ROOM)
        .then(response => {
          if (response && response.imagescol) {
            console.log('RoomImage: Imagen de sala cargada')
            setImage(`data:image/jpeg;base64,${response.imagescol}`)
          }
        })
        .catch(error => {
          // Si es un 404, es normal (no hay imagen) - ignorar silenciosamente
          if (error.response && error.response.status !== 404) {
            console.error('RoomImage: Error al cargar la imagen de sala:', error)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [roomId, initialImage])

  // Actualizar la imagen cuando cambie initialImage
  useEffect(() => {
    if (initialImage) {
      console.log('RoomImage: Actualizando imagen desde prop initialImage')
      setImage(initialImage)
    }
  }, [initialImage])

  const handleImageClick = () => {
    if (!readonly) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('RoomImage: Archivo seleccionado', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      })
      
      // Mostrar vista previa inmediata
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        console.log('RoomImage: Vista previa generada con tamaño', result.length)
        setImage(result)
      }
      reader.readAsDataURL(file)
      
      // Llamar al método onImageChange proporcionado al componente
      if (onImageChange) {
        console.log('RoomImage: Llamando a onImageChange')
        onImageChange(file)
      }
      
      // Actualizar la imagen de la sala
      if (roomId) {
        console.log('RoomImage: Actualizando imagen para la sala:', roomId)
        setLoading(true)
        
        imageService.updateImage(roomId, file, ImageType.ROOM)
          .then(() => {
            console.log('RoomImage: Imagen de sala actualizada exitosamente')
          })
          .catch((error: any) => {
            console.error('RoomImage: Error al actualizar la imagen de sala:', error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }  // Estilo para imágenes tipo banner o tipo avatar
  const getContainerStyle = () => {
    if (isBanner) {
      return {
        width: '100%',
        height: typeof height === 'string' ? height : (height || 200) + 'px',
        overflow: 'hidden', // Asegura que la imagen no se desborde
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6' // Fondo gris claro para cuando la imagen se está cargando
      }
    }
    
    return {
      width: typeof size === 'string' ? size : (size || 128) + 'px',
      height: typeof size === 'string' ? size : (size || 128) + 'px'
    }
  }  // Clases para imágenes tipo banner o tipo avatar
  const getImageClasses = () => {
    const baseClasses = `${loading ? 'opacity-50' : ''} ${className}`
    
    if (isBanner) {
      return `w-full h-full object-cover object-center rounded-lg shadow-md ${baseClasses}`
    }
    
    return `w-full h-full rounded-full object-cover border-4 border-white shadow-md ${baseClasses}`
  }
  return (
    <div
      className={`relative ${!readonly ? 'cursor-pointer group' : ''}`}
      style={getContainerStyle()}
      onClick={handleImageClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Imagen de sala"
          className={getImageClasses()}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1a472a]"></div>
          </div>
        )}
        {!readonly && (
          <div className="absolute -bottom-1 -right-1 bg-[#1a472a] rounded-full p-1 shadow-md z-10">
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
        )}
      </div>
      {!readonly && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-sm bg-[#1a472a] px-3 py-1 rounded-full shadow">
              {isBanner ? 'Cambiar imagen de fondo' : 'Cambiar imagen'}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </>
      )}
    </div>
  )
}

export default RoomImage
