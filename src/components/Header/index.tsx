import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'

interface HeaderProps {
  showBackButton?: boolean
  showNavigationButtons?: boolean
}

const Header = ({
  showBackButton = false,
  showNavigationButtons = true
}: HeaderProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <header className="flex justify-between items-center p-4 text-white">
      <div>
        {showBackButton ? (
          <Button variant="secondary" onClick={() => navigate('/user')}>
            ← Volver
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => navigate('/user')}>
            Ver salas
          </Button>
        )}
      </div>
      {showNavigationButtons && (
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate('/reservations')}>
            Mis reservas
          </Button>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            User
          </Button>
          <Button variant="secondary">→</Button>
        </div>
      )}
    </header>
  )
}

export default Header
