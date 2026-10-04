import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner" />
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <h2>Failed to load movie details</h2>
        <p>{error || 'Movie not found'}</p>
        <button className="button button--primary" onClick={() => navigate('/movies')}>
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      {/* Hero Section with Backdrop */}
      <section className="movie-detail__hero">
        <div 
          className="movie-detail__backdrop"
          style={{ backgroundImage: `url("${movie.backdrop}")` }}
        />
        <div className="movie-detail__hero-overlay" />
        <div className="movie-detail__hero-grain" />

        <button 
          className="movie-detail__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back
        </button>

        <div className="movie-detail__hero-content">
          <div className="movie-detail__poster-container">
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="movie-detail__poster"
            />
          </div>

          <div className="movie-detail__hero-info">
            <h1 className="movie-detail__title">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="movie-detail__tagline">"{movie.tagline}"</p>
            )}

            <div className="movie-detail__meta">
              <span className="movie-detail__rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.rating}
              </span>
              <span>{movie.year}</span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span className="movie-detail__kind-badge">{movie.kind === 'series' ? 'Series' : 'Film'}</span>
            </div>

            <div className="movie-detail__genres">
              {movie.genres.map((genre, idx) => (
                <span key={idx} className="movie-detail__genre-tag">{genre}</span>
              ))}
            </div>

            <div className="movie-detail__actions">
              {movie.trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${movie.trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--primary"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}
              <button className="button button--secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4.5v15m-7.5-7.5h15" strokeLinecap="round" />
                </svg>
                Add to Watchlist
              </button>
              <button className="button button--icon" aria-label="Add to favorites">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" />
                </svg>
              </button>
              <button className="button button--icon" aria-label="Share">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="movie-detail__content">
        <div className="movie-detail__tabs">
          <button 
            className={`movie-detail__tab ${selectedTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`movie-detail__tab ${selectedTab === 'cast' ? 'is-active' : ''}`}
            onClick={() => setSelectedTab('cast')}
          >
            Cast & Crew
          </button>
          <button 
            className={`movie-detail__tab ${selectedTab === 'videos' ? 'is-active' : ''}`}
            onClick={() => setSelectedTab('videos')}
          >
            Videos
          </button>
          <button 
            className={`movie-detail__tab ${selectedTab === 'details' ? 'is-active' : ''}`}
            onClick={() => setSelectedTab('details')}
          >
            Details
          </button>
        </div>

        <div className="movie-detail__tab-content">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="movie-detail__overview">
              <div className="movie-detail__description">
                <h2>Synopsis</h2>
                <p>{movie.description || 'No description available.'}</p>
              </div>

              {movie.director && (
                <div className="movie-detail__info-grid">
                  <div className="movie-detail__info-item">
                    <span className="label">Director</span>
                    <span className="value">{movie.director}</span>
                  </div>
                  <div className="movie-detail__info-item">
                    <span className="label">Release Date</span>
                    <span className="value">{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="movie-detail__info-item">
                    <span className="label">Status</span>
                    <span className="value">{movie.status}</span>
                  </div>
                  <div className="movie-detail__info-item">
                    <span className="label">Rating</span>
                    <span className="value">{movie.rating}/10 ({movie.voteCount} votes)</span>
                  </div>
                </div>
              )}

              {/* Top Cast Preview */}
              {movie.cast.length > 0 && (
                <div className="movie-detail__cast-preview">
                  <h2>Top Cast</h2>
                  <div className="movie-detail__cast-grid">
                    {movie.cast.slice(0, 6).map((person) => (
                      <div key={person.id} className="movie-detail__cast-card">
                        <div className="movie-detail__cast-photo">
                          {person.profilePath ? (
                            <img src={person.profilePath} alt={person.name} />
                          ) : (
                            <div className="movie-detail__cast-placeholder">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="movie-detail__cast-info">
                          <span className="name">{person.name}</span>
                          <span className="character">{person.character}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="movie-detail__view-all-btn"
                    onClick={() => setSelectedTab('cast')}
                  >
                    View Full Cast & Crew
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cast & Crew Tab */}
          {selectedTab === 'cast' && (
            <div className="movie-detail__cast-crew">
              {movie.cast.length > 0 && (
                <div className="movie-detail__section">
                  <h2>Cast</h2>
                  <div className="movie-detail__cast-grid movie-detail__cast-grid--full">
                    {movie.cast.map((person) => (
                      <div key={person.id} className="movie-detail__cast-card">
                        <div className="movie-detail__cast-photo">
                          {person.profilePath ? (
                            <img src={person.profilePath} alt={person.name} />
                          ) : (
                            <div className="movie-detail__cast-placeholder">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="movie-detail__cast-info">
                          <span className="name">{person.name}</span>
                          <span className="character">{person.character}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.crew.length > 0 && (
                <div className="movie-detail__section">
                  <h2>Crew</h2>
                  <div className="movie-detail__crew-list">
                    {movie.crew.map((person) => (
                      <div key={person.id} className="movie-detail__crew-item">
                        <span className="name">{person.name}</span>
                        <span className="job">{person.job}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {selectedTab === 'videos' && (
            <div className="movie-detail__videos">
              {movie.videos.length > 0 ? (
                <div className="movie-detail__videos-grid">
                  {movie.videos.map((video) => (
                    <div key={video.id} className="movie-detail__video-card">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="movie-detail__video-thumbnail"
                      >
                        <img 
                          src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                          alt={video.name}
                        />
                        <div className="movie-detail__video-play">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </a>
                      <div className="movie-detail__video-info">
                        <span className="type">{video.type}</span>
                        <span className="name">{video.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="movie-detail__empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  </svg>
                  <p>No videos available</p>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {selectedTab === 'details' && (
            <div className="movie-detail__details">
              <div className="movie-detail__details-grid">
                <div className="movie-detail__detail-item">
                  <span className="label">Original Title</span>
                  <span className="value">{movie.title}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Status</span>
                  <span className="value">{movie.status}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Release Date</span>
                  <span className="value">{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Runtime</span>
                  <span className="value">{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Budget</span>
                  <span className="value">{formatMoney(movie.budget)}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Revenue</span>
                  <span className="value">{formatMoney(movie.revenue)}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Original Language</span>
                  <span className="value">{movie.originalLanguage.toUpperCase()}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Vote Average</span>
                  <span className="value">{movie.rating}/10</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Vote Count</span>
                  <span className="value">{movie.voteCount.toLocaleString()}</span>
                </div>
                <div className="movie-detail__detail-item">
                  <span className="label">Popularity</span>
                  <span className="value">{movie.popularity.toFixed(1)}</span>
                </div>
              </div>

              {movie.productionCompanies.length > 0 && (
                <div className="movie-detail__production">
                  <h3>Production Companies</h3>
                  <div className="movie-detail__production-grid">
                    {movie.productionCompanies.map((company) => (
                      <div key={company.id} className="movie-detail__production-card">
                        {company.logo_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w154${company.logo_path}`}
                            alt={company.name}
                          />
                        ) : (
                          <span>{company.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Similar Movies */}
      {movie.recommendations.length > 0 && (
        <section className="movie-detail__recommendations">
          <h2>You May Also Like</h2>
          <div className="movie-detail__recommendations-grid">
            {movie.recommendations.map((similarMovie, index) => (
              <div 
                key={similarMovie.id}
                onClick={() => navigate(`/movie/${similarMovie.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(`/movie/${similarMovie.id}`)}
              >
                <MovieCard movie={similarMovie} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies (fallback) */}
      {movie.recommendations.length === 0 && movie.similar.length > 0 && (
        <section className="movie-detail__recommendations">
          <h2>Similar Movies</h2>
          <div className="movie-detail__recommendations-grid">
            {movie.similar.map((similarMovie, index) => (
              <div 
                key={similarMovie.id}
                onClick={() => navigate(`/movie/${similarMovie.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(`/movie/${similarMovie.id}`)}
              >
                <MovieCard movie={similarMovie} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetailPage;
