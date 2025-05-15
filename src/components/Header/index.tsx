import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate()

    return (
        <header className="flex justify-between items-center p-4 text-white">
            <div className="flex gap-4">
                <button onClick={() => navigate('/user')} className="hover:text-gray-200">
                    Ver salas
                </button>
                <button onClick={() => navigate('/reservations')} className="hover:text-gray-200">
                    Mis reservas
                </button>
            </div>
            <div className="flex gap-4">
                <button className="hover:text-gray-200">User</button>
                <button className="hover:text-gray-200">→</button>
            </div>
        </header>
    )
}

export default Header