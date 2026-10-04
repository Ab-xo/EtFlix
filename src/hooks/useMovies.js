import { useState, useEffect } from 'react';
import tmdb from '../services/tmdb';

/**
 * Custom hook for fetching movies from TMDB
 * @param {string} fetchType - Type of movies to fetch ('trending', 'popular', 'topRated', etc.)
 * @param {object} options - Additional options like page number
 */
export const useMovies = (fetchType = 'popular', options = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        let data = [];

        switch (fetchType) {
          case 'trending':
            data = await tmdb.getTrending('movie', 'week');
            break;
          case 'popular':
            data = await tmdb.getPopularMovies(options.page);
            break;
          case 'topRated':
            data = await tmdb.getTopRatedMovies(options.page);
            break;
          case 'nowPlaying':
            data = await tmdb.getNowPlayingMovies(options.page);
            break;
          case 'upcoming':
            data = await tmdb.getUpcomingMovies(options.page);
            break;
          case 'popularTV':
            data = await tmdb.getPopularTVShows(options.page);
            break;
          case 'topRatedTV':
            data = await tmdb.getTopRatedTVShows(options.page);
            break;
          case 'search':
            if (options.query) {
              data = await tmdb.searchMulti(options.query, options.page);
            }
            break;
          case 'genre':
            if (options.genreId) {
              data = await tmdb.getMoviesByGenre(options.genreId, options.page);
            }
            break;
          default:
            data = await tmdb.getPopularMovies(options.page);
        }

        if (isMounted) {
          setMovies(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          console.error('Error fetching movies:', err);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [fetchType, options.page, options.query, options.genreId]);

  return { movies, loading, error };
};

/**
 * Hook for fetching multiple movie lists
 */
export const useMovieLists = () => {
  const [lists, setLists] = useState({
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAllLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const [trending, popular, topRated, nowPlaying] = await Promise.all([
          tmdb.getTrending('movie', 'week'),
          tmdb.getPopularMovies(1),
          tmdb.getTopRatedMovies(1),
          tmdb.getNowPlayingMovies(1),
        ]);

        if (isMounted) {
          setLists({
            trending: trending.slice(0, 20),
            popular: popular.slice(0, 20),
            topRated: topRated.slice(0, 20),
            nowPlaying: nowPlaying.slice(0, 20),
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          console.error('Error fetching movie lists:', err);
        }
      }
    };

    fetchAllLists();

    return () => {
      isMounted = false;
    };
  }, []);

  return { lists, loading, error };
};

export default useMovies;
