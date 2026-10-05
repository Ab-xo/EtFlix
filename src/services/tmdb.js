// TMDB API Service - Supports both API Key and Access Token
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// Check if authentication is configured
if (!API_KEY && !ACCESS_TOKEN) {
  console.warn(
    "⚠️ TMDB API: No authentication configured. Please add VITE_TMDB_API_KEY or VITE_TMDB_ACCESS_TOKEN to your .env file",
  );
}

// Determine which authentication method to use
const USE_ACCESS_TOKEN = !!ACCESS_TOKEN;

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
};

// Helper to build image URLs
export const getImageUrl = (path, type = "poster", size = "medium") => {
  if (!path) return null;
  const sizeKey = IMAGE_SIZES[type][size] || IMAGE_SIZES[type].medium;
  return `${IMAGE_BASE_URL}/${sizeKey}${path}`;
};

// Helper to make API requests
const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // Method 1: Use Access Token in headers (more secure)
  if (USE_ACCESS_TOKEN) {
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    };

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `TMDB API Error: ${response.status} - ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw error;
    }
  }
  // Method 2: Use API Key in URL params (simpler)
  else {
    url.searchParams.append("api_key", API_KEY);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `TMDB API Error: ${response.status} - ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw error;
    }
  }
};

// Transform TMDB movie data to our format
const transformMovie = (movie, type = "movie") => {
  return {
    id: movie.id,
    title: movie.title || movie.name,
    year:
      new Date(
        movie.release_date || movie.first_air_date || "",
      ).getFullYear() || 2024,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "0.0",
    genre: movie.genre_ids ? movie.genre_ids.join(",") : "",
    kind: type === "tv" ? "series" : "film",
    poster: getImageUrl(movie.poster_path, "poster", "medium"),
    backdrop: getImageUrl(movie.backdrop_path, "backdrop", "large"),
    description: movie.overview || "",
    duration: movie.runtime || null,
    popularity: movie.popularity || 0,
    voteCount: movie.vote_count || 0,
  };
};

// API Methods

/**
 * Get trending movies and TV shows
 * @param {string} mediaType - 'all', 'movie', or 'tv'
 * @param {string} timeWindow - 'day' or 'week'
 */
export const getTrending = async (mediaType = "all", timeWindow = "week") => {
  const data = await fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
  return data.results.map((item) => transformMovie(item, item.media_type));
};

/**
 * Get popular movies
 * @param {number} page - Page number
 */
export const getPopularMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/popular", { page });
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get top rated movies
 * @param {number} page - Page number
 */
export const getTopRatedMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/top_rated", { page });
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get now playing movies (recent releases)
 * @param {number} page - Page number
 */
export const getNowPlayingMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/now_playing", { page });
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get upcoming movies
 * @param {number} page - Page number
 */
export const getUpcomingMovies = async (page = 1) => {
  const data = await fetchFromTMDB("/movie/upcoming", { page });
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get popular TV shows
 * @param {number} page - Page number
 */
export const getPopularTVShows = async (page = 1) => {
  const data = await fetchFromTMDB("/tv/popular", { page });
  return data.results.map((show) => transformMovie(show, "tv"));
};

/**
 * Get top rated TV shows
 * @param {number} page - Page number
 */
export const getTopRatedTVShows = async (page = 1) => {
  const data = await fetchFromTMDB("/tv/top_rated", { page });
  return data.results.map((show) => transformMovie(show, "tv"));
};

/**
 * Get movie details with cast, crew, videos, and recommendations
 * @param {number} movieId - Movie ID
 */
export const getMovieDetails = async (movieId) => {
  const [details, credits, videos, similar, recommendations] =
    await Promise.all([
      fetchFromTMDB(`/movie/${movieId}`),
      fetchFromTMDB(`/movie/${movieId}/credits`),
      fetchFromTMDB(`/movie/${movieId}/videos`),
      fetchFromTMDB(`/movie/${movieId}/similar`),
      fetchFromTMDB(`/movie/${movieId}/recommendations`),
    ]);

  return {
    ...transformMovie(details, "movie"),
    genres: details.genres?.map((g) => g.name) || [],
    genresString: details.genres?.map((g) => g.name).join(", ") || "",
    runtime: details.runtime || 0,
    tagline: details.tagline || "",
    releaseDate: details.release_date || "",
    budget: details.budget || 0,
    revenue: details.revenue || 0,
    status: details.status || "",
    originalLanguage: details.original_language || "",
    productionCompanies: details.production_companies || [],
    cast:
      credits.cast?.slice(0, 20).map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profilePath: getImageUrl(person.profile_path, "poster", "small"),
      })) || [],
    crew:
      credits.crew
        ?.filter((person) =>
          ["Director", "Producer", "Writer", "Screenplay"].includes(person.job),
        )
        .slice(0, 10)
        .map((person) => ({
          id: person.id,
          name: person.name,
          job: person.job,
          profilePath: getImageUrl(person.profile_path, "poster", "small"),
        })) || [],
    director:
      credits.crew?.find((person) => person.job === "Director")?.name || "",
    videos:
      videos.results
        ?.filter((v) => v.site === "YouTube")
        .map((video) => ({
          id: video.id,
          key: video.key,
          name: video.name,
          type: video.type,
          official: video.official,
        })) || [],
    trailer:
      videos.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      ) || null,
    similar:
      similar.results?.slice(0, 12).map((m) => transformMovie(m, "movie")) ||
      [],
    recommendations:
      recommendations.results
        ?.slice(0, 12)
        .map((m) => transformMovie(m, "movie")) || [],
  };
};

/**
 * Search for movies and TV shows
 * @param {string} query - Search query
 * @param {number} page - Page number
 */
export const searchMulti = async (query, page = 1) => {
  if (!query.trim()) return [];
  const data = await fetchFromTMDB("/search/multi", { query, page });
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => transformMovie(item, item.media_type));
};

/**
 * Get movies by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number
 */
export const getMoviesByGenre = async (genreId, page = 1) => {
  const data = await fetchFromTMDB("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  });
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get genre list
 */
export const getGenres = async () => {
  const [movieGenres, tvGenres] = await Promise.all([
    fetchFromTMDB("/genre/movie/list"),
    fetchFromTMDB("/genre/tv/list"),
  ]);

  // Combine and deduplicate genres
  const allGenres = [...movieGenres.genres, ...tvGenres.genres];
  const uniqueGenres = Array.from(
    new Map(allGenres.map((g) => [g.id, g])).values(),
  );

  return uniqueGenres;
};

/**
 * Get configuration (includes image base URLs)
 */
export const getConfiguration = async () => {
  return await fetchFromTMDB("/configuration");
};

/**
 * Advanced: Discover movies with comprehensive filters
 * @param {Object} filters - Filter options
 * @param {number} filters.page - Page number (default: 1)
 * @param {string} filters.sortBy - Sort by (popularity.desc, vote_average.desc, release_date.desc, etc.)
 * @param {number} filters.year - Filter by release year
 * @param {string} filters.genreIds - Comma-separated genre IDs
 * @param {number} filters.minVoteCount - Minimum vote count (quality filter)
 * @param {number} filters.minRating - Minimum vote average
 * @param {string} filters.releaseDateGte - Release date greater than or equal (YYYY-MM-DD)
 * @param {string} filters.releaseDateLte - Release date less than or equal (YYYY-MM-DD)
 * @param {string} filters.withReleaseType - Release type (1-7: Premiere, Theatrical, etc.)
 */
export const discoverMovies = async (filters = {}) => {
  const {
    page = 1,
    sortBy = "popularity.desc",
    year,
    genreIds,
    minVoteCount,
    minRating,
    releaseDateGte,
    releaseDateLte,
    withReleaseType,
  } = filters;

  const params = {
    page,
    sort_by: sortBy,
    include_adult: false,
    include_video: false,
    language: "en-US",
  };

  // Add optional filters
  if (year) params.year = year;
  if (genreIds) params.with_genres = genreIds;
  if (minVoteCount) params["vote_count.gte"] = minVoteCount;
  if (minRating) params["vote_average.gte"] = minRating;
  if (releaseDateGte) params["release_date.gte"] = releaseDateGte;
  if (releaseDateLte) params["release_date.lte"] = releaseDateLte;
  if (withReleaseType) params.with_release_type = withReleaseType;

  const data = await fetchFromTMDB("/discover/movie", params);
  return {
    results: data.results.map((movie) => transformMovie(movie, "movie")),
    totalPages: data.total_pages,
    totalResults: data.total_results,
    page: data.page,
  };
};

/**
 * Get quality trending movies (high vote count + recent)
 * Best for "Trending Now" sections
 */
export const getQualityTrending = async (page = 1) => {
  const data = await fetchFromTMDB(`/trending/movie/week`, { page });
  // Filter for quality: vote_count > 100
  const qualityMovies = data.results
    .filter((movie) => movie.vote_count > 100)
    .map((movie) => transformMovie(movie, "movie"));

  return qualityMovies;
};

/**
 * Get popular movies in theaters (Now Playing with quality filter)
 * Best for "In Cinemas" / "Now Playing" sections
 */
export const getPopularInCinemas = async (page = 1) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const params = {
    page,
    sort_by: "popularity.desc",
    "release_date.gte": thirtyDaysAgo.toISOString().split("T")[0],
    "release_date.lte": today.toISOString().split("T")[0],
    with_release_type: 3, // Theatrical release
    "vote_count.gte": 50, // Quality filter
  };

  const data = await fetchFromTMDB("/discover/movie", params);
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get high-quality popular movies (Popular + Quality Filter)
 * Best for "Popular" sections with guaranteed quality
 */
export const getQualityPopular = async (page = 1) => {
  const params = {
    page,
    sort_by: "popularity.desc",
    "vote_count.gte": 200, // High quality threshold
    "vote_average.gte": 6.0, // Minimum rating
  };

  const data = await fetchFromTMDB("/discover/movie", params);
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get upcoming releases (Coming Soon)
 * Best for "Coming Soon" sections
 */
export const getComingSoon = async (page = 1) => {
  const today = new Date();
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);

  const params = {
    page,
    sort_by: "popularity.desc",
    "release_date.gte": today.toISOString().split("T")[0],
    "release_date.lte": sixMonthsLater.toISOString().split("T")[0],
    with_release_type: 3, // Theatrical
  };

  const data = await fetchFromTMDB("/discover/movie", params);
  return data.results.map((movie) => transformMovie(movie, "movie"));
};

/**
 * Get all available years for filtering (1980 to current year + 1)
 */
export const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1900; year--) {
    years.push(year);
  }
  return years;
};

// Export all methods as default
export default {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getMovieDetails,
  searchMulti,
  getMoviesByGenre,
  getGenres,
  getConfiguration,
  getImageUrl,
  // New advanced methods
  discoverMovies,
  getQualityTrending,
  getPopularInCinemas,
  getQualityPopular,
  getComingSoon,
  getAvailableYears,
};
