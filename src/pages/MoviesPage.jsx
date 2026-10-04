import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
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
  const [viewMode, setViewMode] = useState("grid");

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

    if (sortBy === "latest") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [normalizedQuery, selectedGenre, selectedType, selectedYear, sortBy, allContent]);

  const totalPages = Math.ceil(visibleMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return visibleMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [visibleMovies, currentPage]);

  useLayoutEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, selectedType, selectedYear, sortBy, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount =
    (selectedType !== "all" ? 1 : 0) +
    (selectedGenre !== "all" ? 1 : 0) +
    (selectedYear !== "all" ? 1 : 0) +
    (normalizedQuery ? 1 : 0);

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedGenre("all");
    setSelectedYear("all");
    setSortBy("latest");
    setSearchQuery("");
  };

  const filterPills = [];
  if (selectedType !== "all") {
    filterPills.push({
      label: selectedType === "film" ? "Movies" : "Series",
      clear: () => setSelectedType("all"),
    });
  }
  if (selectedGenre !== "all") {
    filterPills.push({
      label: selectedGenre,
      clear: () => setSelectedGenre("all"),
    });
  }
  if (selectedYear !== "all") {
    filterPills.push({
      label: selectedYear,
      clear: () => setSelectedYear("all"),
    });
  }
  if (normalizedQuery) {
    filterPills.push({
      label: `"${searchQuery}"`,
      clear: () => setSearchQuery(""),
    });
  }

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".navbar", { y: -22, duration: 0.7 });

      gsap.from(".movies-hero", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });

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

      <div className="filter-navbar">
        <div className="filter-navbar__container">
          <div className="filter-navbar__filters">
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
              <svg className="filter-select__icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

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
              <svg className="filter-select__icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

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
              <svg className="filter-select__icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {activeFilterCount > 0 && (
              <button
                className="filter-navbar__clear"
                onClick={clearFilters}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Clear all
              </button>
            )}
          </div>

          <div className="filter-navbar__actions">
            <div className="filter-select filter-select--sort">
              <svg className="filter-select__icon-left" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              <svg className="filter-select__icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="filter-results">
              <span className="filter-results__count">
                {visibleMovies.length}
              </span>
              <span className="filter-results__label">results</span>
            </div>

            <div className="filter-view-toggle">
              <button
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={`filter-view-toggle__btn${viewMode === "grid" ? " is-active" : ""}`}
                onClick={() => setViewMode("grid")}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
              <button
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`filter-view-toggle__btn${viewMode === "list" ? " is-active" : ""}`}
                onClick={() => setViewMode("list")}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="3" y="15" width="18" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filterPills.length > 0 && (
          <div className="filter-pills">
            {filterPills.map((pill, i) => (
              <button
                key={i}
                className="filter-pill"
                onClick={pill.clear}
                type="button"
              >
                <span>{pill.label}</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      <main>
        <section className="movies-page-content">
          <div className="movies-hero">
            <span className="eyebrow">THE FULL COLLECTION</span>
            <h1>Every title, one place</h1>
            <p>
              Browse the complete EtFlix library. Filter by type, genre, or year
              to find exactly what you're in the mood for.
            </p>

            <div className="movies-search">
              <svg className="movies-search__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or genre..."
                type="search"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  className="movies-search__clear"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="collection-content">
            {paginatedMovies.length > 0 ? (
              <>
                <div className={`movie-grid movie-grid--catalog${viewMode === "list" ? " movie-grid--list" : ""}`}>
                  {paginatedMovies.map((movie, index) => (
                    <MovieCard
                      index={index}
                      key={movie.id}
                      movie={movie}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination__btn pagination__btn--prev"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                            aria-current={page === currentPage ? "page" : undefined}
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
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="2" />
                  <path d="M44 44l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>No content matches your filters.</p>
                <button className="empty-state__btn" onClick={clearFilters} type="button">
                  Reset filters
                </button>
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
