import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieSection from "../components/MovieSection";
import { heroMovies, trendingMovies, trendingShows } from "../data/movie";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const pageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const trendingSection = [
    ...trendingMovies.slice(0, 4),
    ...trendingShows.slice(0, 4),
  ];
  const popularSection = [
    ...trendingMovies.slice(4),
    ...trendingShows.slice(4),
  ];
  const newReleaseSection = trendingMovies.filter(
    (movie) => movie.year >= 2024,
  );
  const topRatedFilms = [...trendingMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);
  const topRatedShows = [...trendingShows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);
  const classicsSection = trendingMovies.filter((movie) => movie.year < 2010);

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
  }, []);

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <Hero movies={heroMovies} />

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
            <span>Handpicked daily</span>
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
            <span>No autoplay noise</span>
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
            <span>Watch on any device</span>
          </div>
        </section>

        <section className="discover" id="movies">
          <div className="discover__heading">
            <div>
              <span className="eyebrow">CURATED FOR YOUR NEXT MOVIE NIGHT</span>
              <h2>What to watch tonight</h2>
              <p>
                Big stories, unforgettable characters, and a little something
                for every kind of night.
              </p>
            </div>
          </div>

          <MovieSection
            movies={trendingSection}
            title="Trending Now"
            variant="carousel"
          />

          <MovieSection
            movies={newReleaseSection}
            title="New Releases"
            variant="carousel"
          />

          <MovieSection
            movies={topRatedFilms}
            title="Top Rated Films"
            variant="carousel"
          />

          <MovieSection
            movies={topRatedShows}
            title="Top Rated Series"
            variant="carousel"
          />

          <MovieSection
            movies={classicsSection}
            title="Timeless Classics"
            variant="carousel"
          />

          <MovieSection movies={popularSection} title="Popular Picks" />
        </section>

        <section className="closing-note" id="about">
          <span className="eyebrow">A BETTER KIND OF MOVIE NIGHT</span>
          <p>Less scrolling. More stories worth staying up for.</p>
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
