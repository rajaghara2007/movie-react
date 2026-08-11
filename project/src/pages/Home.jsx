import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { FiSearch, FiX } from 'react-icons/fi'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import '../styles/Home.css'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('batman')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filterYear, setFilterYear] = useState('')
  const [filterType, setFilterType] = useState('')
  const { favorites, toggleFavorite, isFavorited } = useFavorites()

  const API_KEY = '5f3da4d9' 
  const API_URL = 'https://www.omdbapi.com/'

  // Fetch movies from OMDB API
  const fetchMovies = async (searchTerm) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${searchTerm}`
      )
      const data = await response.json()

      if (data.Response === 'True') {
        setMovies(data.Search)
      } else {
        setMovies([])
        setError(data.Error || 'No movies found')
      }
    } catch (err) {
      setError('Failed to fetch movies. Please check your API key.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  // Load default movies on component mount
  useEffect(() => {
    fetchMovies('batman')
  }, [])

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      fetchMovies(search)
    }
  }

  // Filter movies based on year and type
  const getFilteredMovies = () => {
    return movies.filter(movie => {
      const yearMatch = !filterYear || movie.Year === filterYear
      const typeMatch = !filterType || movie.Type === filterType
      return yearMatch && typeMatch
    })
  }

  const filteredMovies = getFilteredMovies()

  return (
    <div className="page-container">
      <h1>Movie List</h1>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="search-section">
        <input
          type="text"
          placeholder="Search for movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <FiSearch /> Search
        </button>
      </form>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="year-filter">Filter by Year:</label>
          <input
            id="year-filter"
            type="text"
            placeholder="e.g., 2020"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-input"
          />
          {filterYear && (
            <button
              onClick={() => setFilterYear('')}
              className="clear-filter-btn"
            >
              <FiX /> Clear
            </button>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Filter by Type:</label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>

        {(filterYear || filterType) && (
          <button
            onClick={() => {
              setFilterYear('')
              setFilterType('')
            }}
            className="reset-filters-btn"
          >
            <FiX /> Reset Filters
          </button>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && <p className="loading">Loading movies...</p>}
      {error && <p className="error">{error}</p>}

      {/* Movies Grid */}
      {movies.length > 0 ? (
        filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
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
                    View Details
                  </Link>
                  <button
                    onClick={() => toggleFavorite(movie.imdbID)}
                    className={`fav-btn ${isFavorited(movie.imdbID) ? 'favorited' : ''}`}
                  >
                    {isFavorited(movie.imdbID) ? <><MdFavorite /> Favorited</> : <><MdFavoriteBorder /> Favorite</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No movies match your filters. Try adjusting the filters.</p>
        )
      ) : (
        !loading && <p className="no-results">No movies found. Try searching for something!</p>
      )}
    </div>
  )
}