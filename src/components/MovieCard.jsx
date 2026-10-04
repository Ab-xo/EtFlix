function MovieCard({ movie, index }) {
  const genreTags = movie.genre.split(",").slice(0, 2).map((g) => g.trim());

  return (
    <article className="movie-card" style={{ "--card-index": index }}>
      <div className="movie-card__poster">
        <img
          decoding="async"
          loading="lazy"
          src={movie.poster}
          alt={movie.title}
        />

        <span className="movie-card__rating">
          <span aria-hidden="true">★</span> {movie.rating}
        </span>

        <span className="movie-card__kind-badge">
          {movie.kind === "series" ? "Series" : "Film"}
        </span>

        <div className="movie-card__overlay">
          <button
            className="movie-card__play-btn"
            aria-label={`Play ${movie.title}`}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="movie-card__actions">
          <button
            className="movie-card__action-btn"
            aria-label="Add to watchlist"
            title="Add to watchlist"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4.5v15m-7.5-7.5h15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            className="movie-card__action-btn"
            aria-label="Add to favorites"
            title="Add to favorites"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="movie-card__info">
        <h3>{movie.title}</h3>

        <div className="movie-card__tags">
          <span className="movie-card__year">{movie.year}</span>
          {genreTags.map((tag) => (
            <span key={tag} className="movie-card__genre-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
