import { JSX } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import './App.css'
import Login from './screens/Login'

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
