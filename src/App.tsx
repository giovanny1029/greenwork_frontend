import { JSX } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import './App.css'
import Login from './screens/Login'
import User from './screens/User'
import RoomAvailability from './screens/RoomAvailability'
import Reservations from './screens/Reservations'
import Profile from './screens/Profile'

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<User />} />{' '}
      <Route path="/room/:roomId" element={<RoomAvailability />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
