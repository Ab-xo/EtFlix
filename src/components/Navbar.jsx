import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Brand from "./Brand";

function Navbar({ searchQuery, onSearchChange }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isMoviesPage = pathname === "/movies";
  const isGenresPage = pathname === "/genres";
  const isAboutPage = pathname === "/about";
  const isMainSite = isHome || isMoviesPage || isGenresPage || isAboutPage;
  const hasSearch = typeof onSearchChange === "function";

  useEffect(() => {
    if (!isMainSite) return undefined;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainSite]);

  return (
    <header
      className={`navbar${isMainSite ? "" : " navbar--account"}${isScrolled ? " navbar--scrolled" : ""}`}
    >
      <Brand className="navbar__brand" />

      <nav aria-label="Main navigation" className="navbar__links">
        {isMainSite ? (
          <>
            <Link to="/" className={isHome ? "is-current" : ""}>
              Home
            </Link>
            <Link to="/movies" className={isMoviesPage ? "is-current" : ""}>
              Movies
            </Link>
            <Link to="/genres" className={isGenresPage ? "is-current" : ""}>
              Genres
            </Link>
            <Link to="/about" className={isAboutPage ? "is-current" : ""}>
              About
            </Link>
          </>
        ) : (
          <Link to="/">Discover EtFlix</Link>
        )}
      </nav>

      <div className="navbar__actions">
        {isMainSite && hasSearch && (
          <>
            <button
              aria-expanded={isSearchOpen}
              aria-label={
                isSearchOpen ? "Close movie search" : "Open movie search"
              }
              className={`navbar__search${isSearchOpen ? " is-open" : ""}`}
              onClick={() => {
                setIsSearchOpen((open) => !open);
                if (isSearchOpen) onSearchChange("");
              }}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="navbar__search-icon"
                fill="none"
                viewBox="0 0 20 20"
              >
                {isSearchOpen ? (
                  <path d="m5 5 10 10M15 5 5 15" />
                ) : (
                  <>
                    <circle cx="8.7" cy="8.7" r="5.5" />
                    <path d="m12.8 12.8 4 4" />
                  </>
                )}
              </svg>
              <span className="navbar__search-label">
                {isSearchOpen ? "Close" : "Search"}
              </span>
            </button>
            <Link
              aria-label="Sign in to EtFlix"
              className="navbar__signin"
              to="/signin"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="6.4" r="3.1" />
                <path d="M3.9 16.7c.5-3 2.7-4.7 6.1-4.7s5.6 1.7 6.1 4.7" />
              </svg>
              <span>Sign in</span>
            </Link>
            <Link className="navbar__join" to="/signup">
              <span className="navbar__join-label">Join EtFlix</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </>
        )}
        {!isMainSite && (
          <Link
            className="navbar__join navbar__join--account"
            to={pathname === "/signup" ? "/signin" : "/signup"}
          >
            <span className="navbar__join-label">
              {pathname === "/signup" ? "Sign in" : "Create account"}
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>

      {isMainSite && hasSearch && isSearchOpen && (
        <div className="navbar__search-panel">
          <label className="sr-only" htmlFor="movie-search">
            Search movies
          </label>
          <input
            autoFocus
            id="movie-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Try a title or genre..."
            type="search"
            value={searchQuery}
          />
          {searchQuery && (
            <button
              aria-label="Clear search"
              className="navbar__clear-search"
              onClick={() => onSearchChange("")}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
