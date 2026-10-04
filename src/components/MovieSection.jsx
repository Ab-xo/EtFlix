import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieSection({ title, movies, variant = "grid" }) {
  const scrollRef = useRef(null);

  if (variant === "carousel") {
    const scrollByDir = (dir) => {
      const container = scrollRef.current;
      if (!container) return;
      container.scrollBy({ left: dir * container.clientWidth * 0.8, behavior: "smooth" });
    };

    return (
      <section aria-label={title} className="movie-section movie-section--carousel">
        <div className="movie-section__header">
          <h2>{title}</h2>
          <div className="movie-section__carousel-controls">
            <button
              aria-label={`Scroll ${title} left`}
              className="movie-section__arrow"
              onClick={() => scrollByDir(-1)}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              aria-label={`Scroll ${title} right`}
              className="movie-section__arrow"
              onClick={() => scrollByDir(1)}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="movie-carousel" ref={scrollRef}>
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

  return (
    <section aria-label={title} className="movie-section">
      {title && (
        <div className="movie-section__header">
          <h2>{title}</h2>
          <a href="#genres">
            Browse genres <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

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
