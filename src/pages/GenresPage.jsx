import { useRef, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { trendingMovies, trendingShows } from "../data/movie";

gsap.registerPlugin(ScrollTrigger);

const genreMeta = [
  { name: "Action", icon: "bolt", accent: "#ff6b35" },
  { name: "Drama", icon: "masks", accent: "#e8804a" },
  { name: "Sci-Fi", icon: "rocket", accent: "#4ec5f0" },
  { name: "Horror", icon: "ghost", accent: "#d94e6a" },
  { name: "Comedy", icon: "smile", accent: "#f0c64e" },
  { name: "Animation", icon: "palette", accent: "#f06ea8" },
  { name: "Crime", icon: "gun", accent: "#8a8d92" },
  { name: "Adventure", icon: "compass", accent: "#4ed8a0" },
  { name: "Music", icon: "music", accent: "#b48ef0" },
  { name: "History", icon: "scroll", accent: "#e0b870" },
  { name: "Thriller", icon: "knife", accent: "#d45050" },
  { name: "Fantasy", icon: "wand", accent: "#7da8f0" },
  { name: "Family", icon: "heart", accent: "#5ed0c0" },
];

function GenreIcon({ name }) {
  const icons = {
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    masks: <path d="M4 6c4-2 12-2 16 0 0 3-2 5-4 6-2-1-4-1-4-1s-2 0-4 1c-2-1-4-3-4-6zm4 8c2 1 4 1 4 1s2 0 4-1c1 3 0 6-4 6s-5-3-4-6z" />,
    rocket: <path d="M12 2c3 2 5 6 5 10l-2 3h-6l-2-3c0-4 2-8 5-10zm0 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7 17l-2 5 5-2zm10 0l2 5-5-2z" />,
    ghost: <path d="M6 4h12v18l-3-3-3 3-3-3-3 3V4zm4 6a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" />,
    smile: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7 14c1.5 2.5 6.5 2.5 8 0" />,
    palette: <path d="M12 2a10 10 0 100 20c1 0 2-1 2-2 0-1-1-1-1-2s1-2 2-2h2a4 4 0 004-4c0-5-4-8-9-8zm-5 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />,
    gun: <path d="M4 7h16v3H4V7zm0 3l2 6h4l-2-6m6 0l4 6h3l-3-6" />,
    compass: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2 5-5 2 2-5 5-2z" />,
    music: <path d="M18 3l-8 2v10c-1-.5-2-1-3.5-1C4 14 3 16 3 17.5S4.5 20 6 20s3-1 3-3.5V8l6-1.5v6c-1-.5-2-1-3.5-1C8 11.5 7 13.5 7 15s1.5 2.5 3 2.5 3-1 3-3.5V3z" />,
    scroll: <path d="M5 3h12v2H5v12c0 1 .5 2 2 2h10c-1 0-2-1-2-2V5M19 5v12c0 1-1 2-2 2" />,
    knife: <path d="M3 11l14-8 4 7L7 18z" />,
    wand: <path d="M3 21l12-12 1 1L4 22zM15 4l1.5 3L20 8.5 16.5 10 15 13l-1.5-3L10 8.5 13.5 7zm4 10l.8 1.5L21 16l-1.2.5L19 18l-.8-1.5L17 16l1.2-.5z" />,
    heart: <path d="M12 21l-1.5-1.4C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.1L12 21z" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="genre-card__svg">
      {icons[name] || icons.bolt}
    </svg>
  );
}

function GenresPage() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState(null);

  const allContent = [...trendingMovies, ...trendingShows];

  const genres = useMemo(() => {
    const counts = {};
    allContent.forEach((item) => {
      item.genre.split(",").forEach((g) => {
        const trimmed = g.trim();
        counts[trimmed] = (counts[trimmed] || 0) + 1;
      });
    });
    return genreMeta
      .map((meta) => ({
        ...meta,
        count: counts[meta.name] || 0,
        id: meta.name.toLowerCase().replace(/\s+/g, "-"),
      }))
      .filter((g) => g.count > 0)
      .sort((a, b) => b.count - a.count);
  }, []);

  const totalTitles = allContent.length;
  const totalGenres = genres.length;
  const topGenre = genres[0];

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".navbar", { y: -22, duration: 0.7, ease: "power3.out" });
      gsap.from(".genres-hero__content > *", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });
      gsap.from(".genres-stats__item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.from(".genre-card", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        delay: 0.4,
        scrollTrigger: {
          trigger: ".genres-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  const handleGenreClick = (genreName) => {
    navigate("/movies");
  };

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar />

      <main>
        <section className="genres-page">
          <div className="genres-hero">
            <div className="genres-hero__content">
              <span className="eyebrow">BROWSE BY CATEGORY</span>
              <h1>Find your <em>genre</em></h1>
              <p>
                From pulse-pounding action to quiet dramas, explore {totalGenres}{" "}
                curated categories and discover your next obsession.
              </p>
            </div>

            <div className="genres-stats">
              <div className="genres-stats__item">
                <span className="genres-stats__number">{totalTitles}</span>
                <span className="genres-stats__label">Total Titles</span>
              </div>
              <div className="genres-stats__divider" />
              <div className="genres-stats__item">
                <span className="genres-stats__number">{totalGenres}</span>
                <span className="genres-stats__label">Genres</span>
              </div>
              <div className="genres-stats__divider" />
              <div className="genres-stats__item">
                <span className="genres-stats__number">{topGenre?.count ?? 0}</span>
                <span className="genres-stats__label">In {topGenre?.name}</span>
              </div>
            </div>
          </div>

          <div className="genres-grid">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`genre-card${activeGenre === genre.id ? " is-active" : ""}`}
                onClick={() => handleGenreClick(genre.name)}
                onMouseEnter={() => setActiveGenre(genre.id)}
                onMouseLeave={() => setActiveGenre(null)}
                style={{ "--genre-accent": genre.accent }}
                type="button"
              >
                <div className="genre-card__icon-wrap">
                  <GenreIcon name={genre.icon} />
                </div>
                <h3 className="genre-card__name">{genre.name}</h3>
                <p className="genre-card__count">
                  {genre.count} {genre.count === 1 ? "title" : "titles"}
                </p>
                <span className="genre-card__arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          <div className="genres-cta">
            <span className="eyebrow">CAN'T DECIDE?</span>
            <p>Let us guide you. Browse the full collection and filter by what you love.</p>
            <button
              className="button button--primary genres-cta__btn"
              onClick={() => navigate("/movies")}
              type="button"
            >
              <span className="button__play">
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M4 2.5v7L9.5 6 4 2.5Z" fill="currentColor" />
                </svg>
              </span>
              <span>Explore all titles</span>
              <svg aria-hidden="true" className="button__arrow" fill="none" viewBox="0 0 20 20">
                <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default GenresPage;
