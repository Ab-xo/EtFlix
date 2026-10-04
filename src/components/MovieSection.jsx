import MovieCard from "./MovieCard";

function MovieSection({ title, movies }) {
  return (
    <section aria-label={title} className="movie-section">
      <div className="movie-section__header">
        <h2>{title}</h2>
        <a href="#genres">
          Browse genres <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard
            index={index}
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;