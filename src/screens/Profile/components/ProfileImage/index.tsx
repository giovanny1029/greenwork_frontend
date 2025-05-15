import { JSX, useState, useRef } from 'react'

interface ProfileImageProps {
  initialImage?: string
  onImageChange?: (file: File) => void
  size?: number
}

const ProfileImage = ({
  initialImage,
  onImageChange,
  size = 128
}: ProfileImageProps): JSX.Element => {
  const [image, setImage] = useState<string>(
    initialImage ||
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOC4wMiAxLjM0IDguMDIgNHYuMDNjLS4wMS43My0uMjUgMS40My0uNyAyLjAyLTEuMDYgMS40LTIuODQgMS44NC00LjMzIDEuODQtMS4zMSAwLTMuMDgtLjM1LTQuMTgtMS41OS0uNi0uNjgtLjc5LTEuNTgtLjc5LTIuNDQgMC0yLjY2IDUuMzItMy44NiA3Ljk4LTMuODZ6TTEyIDIwYy0yLjIxIDAtNC4yNy0uNy01Ljk2LTEuODkuNDQtMS40NCAyLjA5LTEuODEgNC41My0yLjA3IDEuODYuNTcgMy44OC41NyA1Ljc0IDAtLjc5IDIuNTMtMy42NiAzLjk2LTQuMzEgMy45NnoiIGZpbGw9IiM2NjYiLz48L3N2Zz4='
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange?.(file)
    }
  }

  return (
    <div
      className="relative cursor-pointer group"
      style={{ width: size, height: size }}
      onClick={handleImageClick}
    >
      <img src={image} alt="Profile" className="w-full h-full rounded-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white text-sm">Cambiar foto</span>
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
