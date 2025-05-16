import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useCTA = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleCTAClick = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate('/login')
    } catch (error) {
      console.error('Error al procesar CTA:', error)
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  return {
    isLoading,
    handleCTAClick
  }
}

export default useCTA
