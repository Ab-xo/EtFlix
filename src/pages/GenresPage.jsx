import { useRef, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { trendingMovies, trendingShows } from "../data/movie";

const genreMeta = [
  {
    name: "Action",
    icon: "bolt",
    accent: "#ff6b35",
    description: "Explosive thrills and adrenaline-pumping adventures",
    mood: "High-octane excitement",
  },
  {
    name: "Drama",
    icon: "masks",
    accent: "#e8804a",
    description: "Compelling stories that touch the heart",
    mood: "Emotional depth",
  },
  {
    name: "Sci-Fi",
    icon: "rocket",
    accent: "#4ec5f0",
    description: "Explore worlds beyond imagination",
    mood: "Futuristic wonder",
  },
  {
    name: "Horror",
    icon: "ghost",
    accent: "#d94e6a",
    description: "Spine-chilling tales that haunt your dreams",
    mood: "Dark thrills",
  },
  {
    name: "Comedy",
    icon: "smile",
    accent: "#f0c64e",
    description: "Laugh-out-loud moments and feel-good vibes",
    mood: "Pure joy",
  },
  {
    name: "Animation",
    icon: "palette",
    accent: "#f06ea8",
    description: "Stunning visuals and timeless stories",
    mood: "Visual magic",
  },
  {
    name: "Crime",
    icon: "gun",
    accent: "#8a8d92",
    description: "Mysteries, heists, and criminal masterminds",
    mood: "Edge of seat",
  },
  {
    name: "Adventure",
    icon: "compass",
    accent: "#4ed8a0",
    description: "Epic journeys to unknown territories",
    mood: "Endless exploration",
  },
  {
    name: "Music",
    icon: "music",
    accent: "#b48ef0",
    description: "Rhythm, melody, and musical brilliance",
    mood: "Sonic bliss",
  },
  {
    name: "History",
    icon: "scroll",
    accent: "#e0b870",
    description: "Journey through time and pivotal moments",
    mood: "Timeless tales",
  },
  {
    name: "Thriller",
    icon: "knife",
    accent: "#d45050",
    description: "Pulse-pounding suspense and twisted plots",
    mood: "Heart racing",
  },
  {
    name: "Fantasy",
    icon: "wand",
    accent: "#7da8f0",
    description: "Magic, myths, and legendary adventures",
    mood: "Enchanting realms",
  },
  {
    name: "Family",
    icon: "heart",
    accent: "#5ed0c0",
    description: "Perfect for watching together",
    mood: "Wholesome fun",
  },
];

function GenreIcon({ name }) {
  const icons = {
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    masks: (
      <path d="M4 6c4-2 12-2 16 0 0 3-2 5-4 6-2-1-4-1-4-1s-2 0-4 1c-2-1-4-3-4-6zm4 8c2 1 4 1 4 1s2 0 4-1c1 3 0 6-4 6s-5-3-4-6z" />
    ),
    rocket: (
      <path d="M12 2c3 2 5 6 5 10l-2 3h-6l-2-3c0-4 2-8 5-10zm0 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7 17l-2 5 5-2zm10 0l2 5-5-2z" />
    ),
    ghost: (
      <path d="M6 4h12v18l-3-3-3 3-3-3-3 3V4zm4 6a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" />
    ),
    smile: (
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7 14c1.5 2.5 6.5 2.5 8 0" />
    ),
    palette: (
      <path d="M12 2a10 10 0 100 20c1 0 2-1 2-2 0-1-1-1-1-2s1-2 2-2h2a4 4 0 004-4c0-5-4-8-9-8zm-5 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    ),
    gun: <path d="M4 7h16v3H4V7zm0 3l2 6h4l-2-6m6 0l4 6h3l-3-6" />,
    compass: (
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2 5-5 2 2-5 5-2z" />
    ),
    music: (
      <path d="M18 3l-8 2v10c-1-.5-2-1-3.5-1C4 14 3 16 3 17.5S4.5 20 6 20s3-1 3-3.5V8l6-1.5v6c-1-.5-2-1-3.5-1C8 11.5 7 13.5 7 15s1.5 2.5 3 2.5 3-1 3-3.5V3z" />
    ),
    scroll: (
      <path d="M5 3h12v2H5v12c0 1 .5 2 2 2h10c-1 0-2-1-2-2V5M19 5v12c0 1-1 2-2 2" />
    ),
    knife: <path d="M3 11l14-8 4 7L7 18z" />,
    wand: (
      <path d="M3 21l12-12 1 1L4 22zM15 4l1.5 3L20 8.5 16.5 10 15 13l-1.5-3L10 8.5 13.5 7zm4 10l.8 1.5L21 16l-1.2.5L19 18l-.8-1.5L17 16l1.2-.5z" />
    ),
    heart: (
      <path d="M12 21l-1.5-1.4C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.1L12 21z" />
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="genre-card__svg"
    >
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
        delay: 0.5,
      });
      gsap.from(".genres-features", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".genres-features",
          start: "top 80%",
          once: true,
        },
      });
      gsap.from(".feature-box", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".genres-features__grid",
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
              <h1>
                Discover content that <em>moves you</em>
              </h1>
              <p>
                From pulse-pounding action to quiet dramas, explore{" "}
                {totalGenres} carefully curated categories. Every genre, endless
                possibilities.
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
                <span className="genres-stats__number">
                  {topGenre?.count ?? 0}
                </span>
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
                <div className="genre-card__bg" />
                <div className="genre-card__content">
                  <div className="genre-card__icon-wrap">
                    <GenreIcon name={genre.icon} />
                  </div>
                  <div className="genre-card__text">
                    <h3 className="genre-card__name">{genre.name}</h3>
                    <p className="genre-card__mood">{genre.mood}</p>
                    <p className="genre-card__description">
                      {genre.description}
                    </p>
                    <p className="genre-card__count">
                      {genre.count} {genre.count === 1 ? "title" : "titles"}
                    </p>
                  </div>
                </div>
                <span className="genre-card__arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m-6-6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          <div className="genres-features">
            <div className="genres-features__header">
              <span className="eyebrow">WHY BROWSE BY GENRE?</span>
              <h2>Find exactly what you're in the mood for</h2>
            </div>
            <div className="genres-features__grid">
              <div className="feature-box">
                <div className="feature-box__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Personalized Discovery</h3>
                <p>
                  Every genre is tailored to help you find your next favorite.
                  Browse by mood, not just category.
                </p>
              </div>
              <div className="feature-box">
                <div className="feature-box__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-7h2v6h-2v-6zm0-4h2v2h-2V9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Smart Curation</h3>
                <p>
                  Our collection is handpicked for quality. Every title in every
                  genre meets our high standards.
                </p>
              </div>
              <div className="feature-box">
                <div className="feature-box__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Always Updated</h3>
                <p>
                  New titles added regularly across all genres. There's always
                  something fresh to watch.
                </p>
              </div>
            </div>
          </div>

          <div className="genres-cta">
            <span className="eyebrow">CAN'T DECIDE?</span>
            <h2>Let the algorithm do the work</h2>
            <p>
              Browse our full collection with advanced filters. Sort by rating,
              year, or let us surprise you.
            </p>
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
              <svg
                aria-hidden="true"
                className="button__arrow"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  d="M4 10h11m-4-4 4 4-4 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.4"
                />
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
