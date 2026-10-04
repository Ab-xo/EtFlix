import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import tmdb from "../services/tmdb";

function MoviesPage() {
  const pageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedType, setSelectedType] = useState("popular"); // popular, topRated, nowPlaying, upcoming
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreList, setGenreList] = useState([]);

  const ITEMS_PER_PAGE = 20;

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await tmdb.getGenres();
        setGenreList(genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies based on selected type
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let movies = [];

        switch (selectedType) {
          case "popular":
            movies = await tmdb.getPopularMovies(currentPage);
            break;
          case "topRated":
            movies = await tmdb.getTopRatedMovies(currentPage);
            break;
          case "nowPlaying":
            movies = await tmdb.getNowPlayingMovies(currentPage);
            break;
          case "upcoming":
            movies = await tmdb.getUpcomingMovies(currentPage);
            break;
          default:
            movies = await tmdb.getPopularMovies(currentPage);
        }

        setAllMovies(movies);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedType, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, selectedType, selectedYear, sortBy, searchQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const years = useMemo(() => {
    const yearSet = new Set(allMovies.map((item) => item.year).filter(Boolean));
    return ["all", ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [allMovies]);

  const visibleMovies = useMemo(() => {
    let filtered = allMovies.filter((movie) => {
      const matchesGenre =
        selectedGenre === "all" ||
        (movie.genre && movie.genre.includes(selectedGenre));

      const matchesYear =
        selectedYear === "all" || movie.year === parseInt(selectedYear);

      const matchesSearch =
        !normalizedQuery || movie.title.toLowerCase().includes(normalizedQuery);

      return matchesGenre && matchesYear && matchesSearch;
    });

    // Apply sorting
    if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "year") {
      filtered.sort((a, b) => b.year - a.year);
    }
    // Default is popularity (already sorted from API)

    return filtered;
  }, [allMovies, normalizedQuery, selectedGenre, selectedYear, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".navbar", { y: -22, duration: 0.7 });

      gsap.from(".filter-navbar", {
        y: 26,
        duration: 0.65,
        ease: "power2.out",
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      loading
    )
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".movie-card", {
        y: 28,
        opacity: 0,
        duration: 0.55,
        stagger: 0.075,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    }, pageRef);

    return () => context.revert();
  }, [loading, visibleMovies, currentPage]);

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Filter Navbar */}
      <div className="filter-navbar">
        <div className="filter-navbar__container">
          {/* Left: Filters */}
          <div className="filter-navbar__filters">
            {/* Type Select */}
            <div className="filter-select">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select__control"
              >
                <option value="popular">Popular</option>
                <option value="topRated">Top Rated</option>
                <option value="nowPlaying">Now Playing</option>
                <option value="upcoming">Upcoming</option>
              </select>
              <svg
                className="filter-select__icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Genre Select */}
            <div className="filter-select">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select__control"
              >
                <option value="all">All Genres</option>
                {genreList.map((genre) => (
                  <option key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <svg
                className="filter-select__icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Year Select */}
            <div className="filter-select">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select__control"
              >
                <option value="all">All Years</option>
                {years
                  .filter((y) => y !== "all")
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
              <svg
                className="filter-select__icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Right: Sort & Count */}
          <div className="filter-navbar__actions">
            {/* Sort By */}
            <div className="filter-select filter-select--sort">
              <svg
                className="filter-select__icon-left"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 6h18M7 12h10M11 18h2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select__control"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="year">Latest</option>
                <option value="title">A-Z</option>
              </select>
              <svg
                className="filter-select__icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Results Count */}
            <div className="filter-results">
              <span className="filter-results__count">
                {visibleMovies.length}
              </span>
              <span className="filter-results__label">results</span>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section className="movies-page-content">
          <div className="collection-content">
            {loading ? (
              <div className="loading-state loading-state--inline">
                <div className="loading-spinner" />
                <p>Loading movies from TMDB...</p>
              </div>
            ) : error ? (
              <div className="error-state error-state--inline">
                <div className="error-state__content">
                  <div className="error-state__icon">⚠️</div>
                  <h3>Unable to Load Movies</h3>
                  <p className="error-state__message">{error}</p>
                  <button
                    className="button button--primary"
                    onClick={() => window.location.reload()}
                    type="button"
                  >
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            ) : visibleMovies.length > 0 ? (
              <>
                <div className="movie-grid">
                  {visibleMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className="pagination__btn pagination__btn--prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className="pagination__info">
                    <span>Page {currentPage}</span>
                  </div>

                  <button
                    className="pagination__btn pagination__btn--next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={visibleMovies.length < ITEMS_PER_PAGE}
                    aria-label="Next page"
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <p className="empty-state">
                No movies match your filters. Try adjusting your selection.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MoviesPage;
