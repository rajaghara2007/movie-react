import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { FiArrowRight, FiTrash2 } from 'react-icons/fi'
import '../styles/Favorites.css'

export default function Favorites() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { favorites, removeFavorite } = useFavorites()

  const API_KEY = '5f3da4d9'
  const API_URL = 'https://www.omdbapi.com/'

  // Fetch movie details for each favorite ID
  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) {
        setMovies([])
        return
      }

      setLoading(true)
      setError(null)
      try {
        const moviePromises = favorites.map(movieId =>
          fetch(`${API_URL}?apikey=${API_KEY}&i=${movieId}`).then(res => res.json())
        )
        const results = await Promise.all(moviePromises)
        
        // Filter out any failed requests
        const validMovies = results.filter(movie => movie.Response === 'True')
        setMovies(validMovies)
      } catch (err) {
        setError('Failed to fetch favorite movies')
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteMovies()
  }, [favorites])

  return (
    <div className="page-container">
      <h1>Favorite Movies ({favorites.length})</h1>

      {loading && <p className="loading">Loading your favorites...</p>}
      {error && <p className="error">{error}</p>}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No favorite movies yet!</p>
          <Link to="/" className="btn"><FiArrowRight /> Browse Movies</Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.imdbID} className="movie-card">
              <div className="movie-poster">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img src={movie.Poster} alt={movie.Title} />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
              </div>
              <h3>{movie.Title}</h3>
              <p className="year">{movie.Year}</p>
              <div className="card-actions">
                <Link to={`/movie/${movie.imdbID}`} className="view-btn">
                  <FiArrowRight /> Details
                </Link>
                <button
                  onClick={() => removeFavorite(movie.imdbID)}
                  className="remove-btn"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}