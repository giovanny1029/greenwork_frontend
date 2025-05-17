import { JSX, useState, useRef, useEffect } from 'react'
import imageService, { ImageType } from '../../../services/image'

interface CompanyImageProps {
  companyId: string
  initialImage?: string
  onImageChange?: (file: File) => void
  size?: number
  readonly?: boolean
}

const CompanyImage = ({
  companyId,
  initialImage,
  onImageChange,
  size = 128,
  readonly = false
}: CompanyImageProps): JSX.Element => {
  const [image, setImage] = useState<string>(
    initialImage || 
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwIDJ2MkgzdjIwaDloMnYtMi4yMDljLjMzOS4wNjkuNjczLjEwNSAxIC4xMDUgMi43NTcgMCA1LTIuMjQzIDUtNVYySDEwek00IDRoNXYxMGg3VjRoMnYxMC44OTFDMTggMTYuMDUyIDE2LjA1MiAxOCAxNC44OTEgMThjLTEuMDkgMC0yLjA5MS0uNjM0LTIuNTU5LTEuNjIzQzEzLjUzNiAxNS4xMTQgMTQuMDM5IDE0LjA0MSAxNSAxNGgyVjZIMTJ2OGgtMWMtMi40OTcgMC00LjUyNiAyLjAyNS00LjU4OCA0LjQ4OEM2LjI0NyAxOC44MTQgNiAxOS4xNjggNiAxOS41VjhINHYtNHoiIGZpbGw9IiM2NjYiLz48L3N2Zz4='
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Cargar la imagen de la compañía cuando el componente se monte
  useEffect(() => {
    if (companyId && !initialImage) {
      console.log('CompanyImage: Intentando cargar imagen para compañía:', companyId)
      setLoading(true)
      
      imageService.getImage(companyId, ImageType.COMPANY)
        .then(response => {
          if (response && response.imagescol) {
            console.log('CompanyImage: Imagen de compañía cargada')
            setImage(`data:image/jpeg;base64,${response.imagescol}`)
          }
        })
        .catch(error => {
          // Si es un 404, es normal (no hay imagen) - ignorar silenciosamente
          if (error.response && error.response.status !== 404) {
            console.error('CompanyImage: Error al cargar la imagen de compañía:', error)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [companyId, initialImage])

  // Actualizar la imagen cuando cambie initialImage
  useEffect(() => {
    if (initialImage) {
      console.log('CompanyImage: Actualizando imagen desde prop initialImage')
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
      console.log('CompanyImage: Archivo seleccionado', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      })
      
      // Mostrar vista previa inmediata
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        console.log('CompanyImage: Vista previa generada con tamaño', result.length)
        setImage(result)
      }
      reader.readAsDataURL(file)
      
      // Llamar al método onImageChange proporcionado al componente
      if (onImageChange) {
        console.log('CompanyImage: Llamando a onImageChange')
        onImageChange(file)
      }
      
      // Actualizar la imagen de la compañía
      if (companyId) {
        console.log('CompanyImage: Actualizando imagen para la compañía:', companyId)
        setLoading(true)
        
        imageService.updateImage(companyId, file, ImageType.COMPANY)
          .then(() => {
            console.log('CompanyImage: Imagen de compañía actualizada exitosamente')
          })
          .catch((error: any) => {
            console.error('CompanyImage: Error al actualizar la imagen de compañía:', error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }

  return (
    <div
      className={`relative ${!readonly ? 'cursor-pointer group' : ''}`}
      style={{ width: size, height: size }}
      onClick={handleImageClick}
    >
      <div className="relative w-full h-full">
        <img
          src={image}
          alt="Logotipo de empresa"
          className={`w-full h-full rounded-full object-cover border-4 border-white shadow-md ${loading ? 'opacity-50' : ''}`}
        />
        {!readonly && (
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
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1a472a]"></div>
          </div>
        )}
      </div>
      {!readonly && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-sm bg-[#1a472a] px-3 py-1 rounded-full shadow">
              Cambiar logo
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

export default CompanyImage
