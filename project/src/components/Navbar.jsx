import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { FiHome, FiHeart, FiInfo } from 'react-icons/fi'
import { IoFilmSharp } from 'react-icons/io5'
import './Navbar.css'

export default function Navbar() {
  const { favoriteCount } = useFavorites()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <IoFilmSharp /> MovieDB
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">
              <FiHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="nav-link">
              <FiHeart />
              Favorites
              {favoriteCount > 0 && (
                <span className="favorites-badge">{favoriteCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              <FiInfo /> About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}