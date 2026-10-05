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
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreList, setGenreList] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch genres and years on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [genres, years] = await Promise.all([
          tmdb.getGenres(),
          Promise.resolve(tmdb.getAvailableYears()),
        ]);
        setGenreList(genres);
        setAvailableYears(years);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch movies based on filters
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always use discover API for consistent filtering
        const filters = {
          page: currentPage,
          sortBy: sortBy,
          minVoteCount: 50, // Base quality threshold
        };

        // Category-specific date ranges and thresholds
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        if (selectedCategory === "trending") {
          // Trending: Last 60 days, high popularity, good rating
          const sixtyDaysAgo = new Date(today);
          sixtyDaysAgo.setDate(today.getDate() - 60);
          filters.releaseDateGte = sixtyDaysAgo.toISOString().split("T")[0];
          filters.releaseDateLte = todayStr;
          filters.sortBy = "popularity.desc";
          filters.minVoteCount = 100;
          filters.minRating = 6.0;
        } else if (selectedCategory === "inCinemas") {
          // In Cinemas: Last 45 days, theatrical release
          const fortyFiveDaysAgo = new Date(today);
          fortyFiveDaysAgo.setDate(today.getDate() - 45);
          filters.releaseDateGte = fortyFiveDaysAgo.toISOString().split("T")[0];
          filters.releaseDateLte = todayStr;
          filters.withReleaseType = 3; // Theatrical
          filters.sortBy = "popularity.desc";
          filters.minVoteCount = 50;
        } else if (selectedCategory === "comingSoon") {
          // Coming Soon: Future releases up to 6 months
          const sixMonthsLater = new Date(today);
          sixMonthsLater.setMonth(today.getMonth() + 6);
          filters.releaseDateGte = todayStr;
          filters.releaseDateLte = sixMonthsLater.toISOString().split("T")[0];
          filters.sortBy = "popularity.desc";
        } else if (selectedCategory === "popular") {
          // Popular: High quality, any time
          filters.sortBy = "popularity.desc";
          filters.minVoteCount = 200;
          filters.minRating = 6.0;
        } else if (selectedCategory === "topRated") {
          // Top Rated: Best movies ever
          filters.sortBy = "vote_average.desc";
          filters.minVoteCount = 500;
          filters.minRating = 7.0;
        }

        // Add genre filter (works with all categories)
        if (selectedGenre !== "all") {
          filters.genreIds = selectedGenre;
        }

        // Add year filter (works with all categories except date-range specific ones)
        if (selectedYear !== "all") {
          const yearNum = parseInt(selectedYear);
          // For date-specific categories, override date filters with year
          if (
            selectedCategory === "trending" ||
            selectedCategory === "inCinemas" ||
            selectedCategory === "comingSoon"
          ) {
            // Override: Use full year instead of date range
            filters.releaseDateGte = `${yearNum}-01-01`;
            filters.releaseDateLte = `${yearNum}-12-31`;
            delete filters.withReleaseType; // Remove release type constraint for historical years
          } else {
            // For other categories, use primary_release_year
            filters.year = yearNum;
          }
        }

        const result = await tmdb.discoverMovies(filters);

        setMovies(result.results);
        setTotalPages(result.totalPages);
        setTotalResults(result.totalResults);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedCategory, selectedGenre, selectedYear, sortBy, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedGenre, selectedCategory, selectedYear, sortBy]);

  // Client-side search filter
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleMovies = useMemo(() => {
    if (!normalizedQuery) return movies;
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedQuery),
    );
  }, [movies, normalizedQuery]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
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
            {/* Category Select */}
            <div className="filter-select">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select__control"
              >
                <option value="popular">Popular</option>
                <option value="trending">Trending</option>
                <option value="topRated">Top Rated</option>
                <option value="inCinemas">In Cinemas</option>
                <option value="comingSoon">Coming Soon</option>
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
                {availableYears.map((year) => (
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
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Top Rated</option>
                <option value="release_date.desc">Latest Release</option>
                <option value="title.asc">A-Z</option>
                <option value="revenue.desc">Highest Grossing</option>
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
                {totalResults > 0
                  ? totalResults.toLocaleString()
                  : visibleMovies.length}
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
                  {visibleMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
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
                    <span>Previous</span>
                  </button>

                  <div className="pagination__info">
                    <span className="pagination__current">
                      Page {currentPage}
                    </span>
                    <span className="pagination__divider">/</span>
                    <span className="pagination__total">
                      {totalPages > 500 ? "500+" : totalPages}
                    </span>
                  </div>

                  <button
                    className="pagination__btn pagination__btn--next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || currentPage >= 500}
                    aria-label="Next page"
                    type="button"
                  >
                    <span>Next</span>
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
              <div className="empty-state">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path
                    d="M21 21l-4.35-4.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>No movies match your filters</p>
                <p className="empty-state__hint">
                  Try adjusting your selection or search query
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MoviesPage;
