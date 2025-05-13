import { JSX } from 'react'

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Bienvenido a Mi Sitio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Una plataforma moderna construida con React, TypeScript y Tailwind CSS
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
            Comenzar
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition duration-300">
            <div className="text-blue-400 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Rápido y Moderno</h3>
            <p className="text-gray-400">Construido con las últimas tecnologías web para un rendimiento óptimo.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition duration-300">
            <div className="text-purple-400 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Diseño Elegante</h3>
            <p className="text-gray-400">Interfaces modernas y responsivas que se ven bien en cualquier dispositivo.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition duration-300">
            <div className="text-green-400 text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold mb-2">Personalizable</h3>
            <p className="text-gray-400">Adaptable a tus necesidades con componentes flexibles y reutilizables.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-lg mb-6 text-gray-200">Únete a nosotros y comienza a construir algo asombroso.</p>
          <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105">
            Empezar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home