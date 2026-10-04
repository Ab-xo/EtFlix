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

  // Split movies into sections
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
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <Hero movies={heroMovies} />

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

          <MovieSection movies={trendingSection} title="Trending Now" />

          <MovieSection movies={newReleaseSection} title="New Releases" />

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
