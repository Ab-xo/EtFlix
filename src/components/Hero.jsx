import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function Hero({ movies }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPausedByInteraction, setIsPausedByInteraction] = useState(false);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const activeMovie = movies[activeIndex];
  const isPaused = !isPlaying || isPausedByInteraction;

  useEffect(() => {
    if (isPaused || movies.length < 2) return undefined;

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % movies.length);
    }, 7000);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isPaused, movies.length]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children ?? [],
        { y: 22, autoAlpha: 0, filter: "blur(3px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.075,
          ease: "power3.out",
          clearProps: "filter",
        },
      );
    }, heroRef);

    return () => context.revert();
  }, [activeIndex]);

  const showMovie = (index) => {
    setActiveIndex((index + movies.length) % movies.length);
  };

  return (
    <section
      aria-label="Featured films"
      aria-roledescription="carousel"
      className={`hero${isPausedByInteraction ? " hero--interaction-paused" : ""}${!isPlaying ? " hero--paused" : ""}`}
      id="home"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPausedByInteraction(false);
        }
      }}
      onFocus={() => setIsPausedByInteraction(true)}
      onMouseEnter={() => setIsPausedByInteraction(true)}
      onMouseLeave={() => setIsPausedByInteraction(false)}
      ref={heroRef}
    >
      <div aria-hidden="true" className="hero__backdrops">
        {movies.map((movie, index) => (
          <div
            className={`hero__backdrop${index === activeIndex ? " is-active" : ""}`}
            key={movie.id}
            style={{ backgroundImage: `url("${movie.backdrop}")` }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="hero__overlay" />
      <div aria-hidden="true" className="hero__grain" />

      <div
        aria-live={isPlaying && !isPausedByInteraction ? "off" : "polite"}
        className="hero__content"
        key={activeMovie.id}
        ref={contentRef}
      >
        <span className="hero__label">
          <span aria-hidden="true" className="hero__label-line" />
          ETFLIX SPOTLIGHT
          <span aria-hidden="true" className="hero__label-divider">
            /
          </span>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>

        <h1>{activeMovie.title}</h1>

        <div className="hero__meta">
          <span>{activeMovie.year}</span>
          <span className="hero__rating">
            <span aria-hidden="true">★</span> {activeMovie.rating}
          </span>
          <span>{activeMovie.genre}</span>
          <span>{activeMovie.duration}</span>
        </div>

        <p>{activeMovie.description}</p>

        <div className="hero__actions">
          <a className="button button--primary" href="#movies">
            <span aria-hidden="true" className="button__play">
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M4 2.5v7L9.5 6 4 2.5Z" fill="currentColor" />
              </svg>
            </span>
            <span>Explore the collection</span>
            <svg
              aria-hidden="true"
              className="button__arrow"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path d="M4 10h11m-4-4 4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      <div
        aria-label="Featured film carousel controls"
        className="hero__controls"
      >
        <div className="hero__pagination">
          <span className="hero__current-index">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="hero__index-rule" />
          <span className="hero__total-index">
            {String(movies.length).padStart(2, "0")}
          </span>
        </div>

        <div aria-label="Choose featured film" className="hero__slide-picker">
          {movies.map((movie, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Show ${movie.title}`}
              className={`hero__slide-dot${index === activeIndex ? " is-active" : ""}`}
              key={movie.id}
              onClick={() => showMovie(index)}
              type="button"
            >
              <span />
            </button>
          ))}
        </div>

        <div className="hero__control-actions">
          <button
            aria-label="Previous featured film"
            className="hero__control-button"
            onClick={() => showMovie(activeIndex - 1)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path d="m12 4-6 6 6 6" />
            </svg>
          </button>
          <button
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className="hero__control-button hero__play-toggle"
            onClick={() => setIsPlaying((playing) => !playing)}
            type="button"
          >
            {isPlaying ? (
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path d="M7 5.5v9m6-9v9" />
              </svg>
            ) : (
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path d="m7.5 5.5 8 4.5-8 4.5v-9Z" />
              </svg>
            )}
          </button>
          <button
            aria-label="Next featured film"
            className="hero__control-button"
            onClick={() => showMovie(activeIndex + 1)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path d="m8 4 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
