import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";
import tmdb from "../services/tmdb";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const pageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieData, setMovieData] = useState({
    hero: [],
    trending: [],
    nowPlaying: [],
    topRated: [],
    popular: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all movie data on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories from TMDB
        const [trending, nowPlaying, topRated, popular, upcoming] =
          await Promise.all([
            tmdb.getTrending("movie", "week"),
            tmdb.getNowPlayingMovies(1),
            tmdb.getTopRatedMovies(1),
            tmdb.getPopularMovies(1),
            tmdb.getUpcomingMovies(1),
          ]);

        setMovieData({
          hero: trending.slice(0, 5), // Top 5 trending for hero
          trending: trending.slice(0, 20),
          nowPlaying: nowPlaying.slice(0, 20),
          topRated: topRated.slice(0, 20),
          popular: popular.slice(0, 20),
          upcoming: upcoming.slice(0, 20),
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies from TMDB:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".navbar", { y: -22, duration: 0.7 });

      gsap.to(".hero__backdrop", {
        backgroundPositionY: "58%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.from(".discover__heading, .movie-section", {
        y: 26,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".discover",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".closing-note > *", {
        y: 22,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".closing-note",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".feature-strip__item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feature-strip",
          start: "top 85%",
          once: true,
        },
      });
    }, pageRef);

    return () => context.revert();
  }, [loading]);

  // Error state
  if (error) {
    return (
      <div className="site-shell" ref={pageRef}>
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main>
          <div className="error-state">
            <div className="error-state__content">
              <div className="error-state__icon">⚠️</div>
              <h2>Unable to Load Movies</h2>
              <p className="error-state__message">{error}</p>
              <p className="error-state__hint">
                {error.includes("401") || error.includes("403")
                  ? "Please check your TMDB API Access Token in the .env file"
                  : "Please check your internet connection and try again"}
              </p>
              <button
                className="button button--primary"
                onClick={() => window.location.reload()}
                type="button"
              >
                <span>Retry</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="site-shell" ref={pageRef}>
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main>
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading amazing content from TMDB...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <Hero movies={movieData.hero} />

        <section className="feature-strip">
          <div className="feature-strip__item">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span>Powered by TMDB</span>
          </div>
          <div className="feature-strip__divider" />
          <div className="feature-strip__item">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
            </svg>
            <span>Latest releases</span>
          </div>
          <div className="feature-strip__divider" />
          <div className="feature-strip__item">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v18m-9-9h18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>Real-time data</span>
          </div>
        </section>

        <section className="discover" id="movies">
          <div className="discover__heading">
            <div>
              <span className="eyebrow">CURATED FOR YOUR NEXT MOVIE NIGHT</span>
              <h2>What to watch tonight</h2>
              <p>
                Discover the latest movies, trending hits, and timeless classics
                from The Movie Database.
              </p>
            </div>
          </div>

          <MovieSection
            movies={movieData.trending}
            title="Trending This Week"
            variant="carousel"
          />

          <MovieSection
            movies={movieData.nowPlaying}
            title="Now Playing in Theaters"
            variant="carousel"
          />

          <MovieSection
            movies={movieData.topRated}
            title="Top Rated Films"
            variant="carousel"
          />

          <MovieSection
            movies={movieData.popular}
            title="Popular Right Now"
            variant="carousel"
          />

          <MovieSection
            movies={movieData.upcoming}
            title="Coming Soon"
            variant="carousel"
          />
        </section>

        <section className="closing-note" id="about">
          <span className="eyebrow">POWERED BY TMDB</span>
          <p>
            Real movie data, updated daily. Discover what's trending worldwide.
          </p>
          <a className="text-link" href="#home">
            Back to the top <span aria-hidden="true">↑</span>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
