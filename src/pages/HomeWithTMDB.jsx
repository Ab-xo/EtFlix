import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";
import { useMovieLists } from "../hooks/useMovies";

gsap.registerPlugin(ScrollTrigger);

function HomeWithTMDB() {
  const homeRef = useRef(null);
  const { lists, loading, error } = useMovieLists();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".navbar", { y: -22, duration: 0.7 })
        .from(".hero", { opacity: 0, duration: 0.9 }, "-=0.4");

      gsap.from(".discover__heading", {
        y: 26,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".discover",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".movie-section", {
        y: 32,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".discover",
          start: "top 70%",
          once: true,
        },
      });
    }, homeRef);

    return () => context.revert();
  }, []);

  if (error) {
    return (
      <div className="site-shell" ref={homeRef}>
        <Navbar />
        <main>
          <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            padding: '0 20px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#f5f1e9', fontSize: '1.5rem' }}>
              Unable to load movies
            </h2>
            <p style={{ color: '#98928a', maxWidth: '500px' }}>
              {error}. Please check your TMDB API key in the .env file.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#b8ef61',
                color: '#0b0c0a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell" ref={homeRef}>
      <Navbar />

      <main>
        <Hero movies={lists.trending} loading={loading} />

        <section className="discover">
          <div className="discover__content">
            <h2 className="discover__heading">Discover</h2>

            {loading ? (
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#98928a'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '3px solid rgba(184, 239, 97, 0.2)',
                    borderTopColor: '#b8ef61',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  <p>Loading amazing content...</p>
                </div>
              </div>
            ) : (
              <>
                <MovieSection
                  title="Trending This Week"
                  movies={lists.trending}
                />
                <MovieSection
                  title="Popular Right Now"
                  movies={lists.popular}
                />
                <MovieSection
                  title="Top Rated Classics"
                  movies={lists.topRated}
                />
                <MovieSection
                  title="New Releases"
                  movies={lists.nowPlaying}
                />
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default HomeWithTMDB;
