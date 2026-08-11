import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { FiArrowLeft } from 'react-icons/fi'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import '../styles/MovieDetails.css'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toggleFavorite, isFavorited } = useFavorites()

  const API_KEY = '5f3da4d9'
  const API_URL = 'https://www.omdbapi.com/'

  // Fetch movie details from OMDB API
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_URL}?apikey=${API_KEY}&i=${id}`
        )
        const data = await response.json()

        if (data.Response === 'True') {
          setMovie(data)
        } else {
          setError(data.Error || 'Movie not found')
          setMovie(null)
        }
      } catch (err) {
        setError('Failed to fetch movie details. Please try again.')
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovieDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="page-container">
        <p className="loading">Loading movie details...</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="page-container">
        <p className="error">{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-btn">
        <FiArrowLeft /> Back to Home
      </button>

      <div className="movie-detail">
        <div className="detail-container">
          <div className="poster-section">
            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} className="poster-image" />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}
          </div>

          <div className="info-section">
            <h1>{movie.Title}</h1>

            <div className="meta-info">
              <span className="badge">{movie.Year}</span>
              {movie.Genre && <span className="badge">{movie.Genre}</span>}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="badge rating">⭐ Rating: {movie.imdbRating}</span>
              )}
            </div>

            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="plot-section">
                <h2>Plot</h2>
                <p>{movie.Plot}</p>
              </div>
            )}

            <div className="details-grid">
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="detail-item">
                  <strong>Director:</strong>
                  <p>{movie.Director}</p>
                </div>
              )}

              {movie.Writer && movie.Writer !== 'N/A' && (
                <div className="detail-item">
                  <strong>Writer:</strong>
                  <p>{movie.Writer}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="detail-item">
                  <strong>Actors:</strong>
                  <p>{movie.Actors}</p>
                </div>
              )}

              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="detail-item">
                  <strong>Runtime:</strong>
                  <p>{movie.Runtime}</p>
                </div>
              )}

              {movie.Type && movie.Type !== 'N/A' && (
                <div className="detail-item">
                  <strong>Type:</strong>
                  <p>{movie.Type}</p>
                </div>
              )}

              {movie.Language && movie.Language !== 'N/A' && (
                <div className="detail-item">
                  <strong>Language:</strong>
                  <p>{movie.Language}</p>
                </div>
              )}

              {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                <div className="detail-item">
                  <strong>IMDB Votes:</strong>
                  <p>{movie.imdbVotes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => toggleFavorite(movie.imdbID)}
              className={`fav-btn-detail ${isFavorited(movie.imdbID) ? 'favorited' : ''}`}
            >
              {isFavorited(movie.imdbID) ? <><MdFavorite /> Remove from Favorites</> : <><MdFavoriteBorder /> Add to Favorites</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}