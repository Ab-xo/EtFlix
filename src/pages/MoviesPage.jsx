import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import MovieSection from "../components/MovieSection";
import { trendingMovies, trendingShows } from "../data/movie";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

function MoviesPage() {
  const pageRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const allContent = [...trendingMovies, ...trendingShows];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const genres = useMemo(() => {
    const genreSet = new Set(
      allContent.flatMap((item) =>
        item.genre.split(",").map((genre) => genre.trim()),
      ),
    );
    return ["all", ...Array.from(genreSet)];
  }, []);

  const years = useMemo(() => {
    const yearSet = new Set(allContent.map((item) => item.year));
    return ["all", ...Array.from(yearSet).sort((a, b) => b - a)];
  }, []);

  const visibleMovies = useMemo(() => {
    let filtered = allContent.filter((movie) => {
      const matchesType = selectedType === "all" || movie.kind === selectedType;

      const matchesGenre =
        selectedGenre === "all" ||
        movie.genre
          .split(",")
          .some(
            (genre) =>
              genre.trim().toLowerCase() === selectedGenre.toLowerCase(),
          );

      const matchesYear =
        selectedYear === "all" || movie.year === parseInt(selectedYear);

      const matchesSearch =
        !normalizedQuery ||
        `${movie.title} ${movie.genre}`.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesGenre && matchesYear && matchesSearch;
    });

    // Apply sorting
    if (sortBy === "latest") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [
    normalizedQuery,
    selectedGenre,
    selectedType,
    selectedYear,
    sortBy,
    allContent,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(visibleMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return visibleMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [visibleMovies, currentPage]);

  // Reset to page 1 when filters change
  useLayoutEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, selectedType, selectedYear, sortBy, searchQuery]);

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
        scrollTrigger: {
          trigger: ".movies-page-content",
          start: "top 78%",
          once: true,
        },
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".movie-card", {
        y: 28,
        duration: 0.55,
        stagger: 0.075,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
      });
    }, pageRef);

    return () => context.revert();
  }, [paginatedMovies, currentPage]);

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
                <option value="all">All Content</option>
                <option value="film">Movies Only</option>
                <option value="series">Series Only</option>
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
                {genres
                  .filter((g) => g !== "all")
                  .map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
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
                <option value="latest">Latest</option>
                <option value="rating">Top Rated</option>
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
            {paginatedMovies.length > 0 ? (
              <>
                <MovieSection movies={paginatedMovies} title="" />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination__btn pagination__btn--prev"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
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

                    <div className="pagination__numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`pagination__page ${page === currentPage ? "pagination__page--active" : ""}`}
                            onClick={() => handlePageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      className="pagination__btn pagination__btn--next"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
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
                )}
              </>
            ) : (
              <p className="empty-state">
                No content matches your filters. Try adjusting your selection.
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
