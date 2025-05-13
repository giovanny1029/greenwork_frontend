import { JSX } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import './App.css'

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
