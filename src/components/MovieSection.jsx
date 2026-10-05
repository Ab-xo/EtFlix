import { motion } from "motion/react";
import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieSection({ title, movies, variant = "grid" }) {
  const scrollRef = useRef(null);

  const scrollByDir = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: dir * container.clientWidth * 0.8, behavior: "smooth" });
  };

  if (variant === "carousel") {
    return (
      <motion.section aria-label={title} className="movie-section movie-section--carousel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10%" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="movie-section__header">
          <h2>{title}</h2>
          <div className="movie-section__carousel-controls">
            <motion.button aria-label={`Scroll ${title} left`} className="movie-section__arrow" onClick={() => scrollByDir(-1)} type="button" whileHover={{ scale: 1.08, x: -2 }} whileTap={{ scale: 0.9 }}><svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></motion.button>
            <motion.button aria-label={`Scroll ${title} right`} className="movie-section__arrow" onClick={() => scrollByDir(1)} type="button" whileHover={{ scale: 1.08, x: 2 }} whileTap={{ scale: 0.9 }}><svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></motion.button>
          </div>
        </div>
        <div className="movie-carousel" ref={scrollRef}>{movies.map((movie, index) => <MovieCard index={index} key={movie.id} movie={movie} />)}</div>
      </motion.section>
    );
  }

  return (
    <motion.section aria-label={title} className="movie-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
      {title && <div className="movie-section__header"><h2>{title}</h2><a href="#genres">Browse genres <span aria-hidden="true">↗</span></a></div>}
      <div className="movie-grid">{movies.map((movie, index) => <MovieCard index={index} key={movie.id} movie={movie} />)}</div>
    </motion.section>
  );
}

export default MovieSection;
