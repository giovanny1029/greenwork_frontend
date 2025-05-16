import { useState } from 'react'

interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

const defaultFeatures: Feature[] = [
  {
    icon: '→',
    title: 'Rápido y Moderno',
    description: 'Construido con las últimas tecnologías web para un rendimiento óptimo.',
    color: 'blue'
  },
  {
    icon: '+',
    title: 'Diseño Elegante',
    description: 'Interfaces modernas y responsivas que se ven bien en cualquier dispositivo.',
    color: 'purple'
  },
  {
    icon: '*',
    title: 'Personalizable',
    description: 'Adaptable a tus necesidades con componentes flexibles y reutilizables.',
    color: 'green'
  }
]

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures)

  const addFeature = (feature: Feature) => {
    setFeatures([...features, feature])
  }

  const removeFeature = (title: string) => {
    setFeatures(features.filter((feature) => feature.title !== title))
  }

  const updateFeature = (title: string, updatedFeature: Partial<Feature>) => {
    setFeatures(
      features.map((feature) =>
        feature.title === title ? { ...feature, ...updatedFeature } : feature
      )
    )
  }

  return {
    features,
    addFeature,
    removeFeature,
    updateFeature
  }
}

export type { Feature }
