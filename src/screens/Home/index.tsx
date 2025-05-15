import { JSX } from 'react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Section from '../../components/common/Section'
import { useFeatures } from '../../hooks/useFeatures'
import useCTA from '../../hooks/useCTA'

const Home = (): JSX.Element => {
  const { features, removeFeature } = useFeatures()
  const { isLoading, handleCTAClick } = useCTA()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-gray-800/50"
                onClick={() => removeFeature(feature.title)}
              >
                <div className={`text-${feature.color}-400 text-4xl mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section>
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600" hover={false}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
              <p className="text-lg mb-6 text-gray-200">
                Únete a nosotros y comienza a construir algo asombroso.
              </p>
              <Button variant="white" onClick={handleCTAClick} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Empezar Ahora'}
              </Button>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  )
}

export default Home
