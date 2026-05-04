import { useState, useEffect, useRef, startTransition } from "react";
import { MovieCard } from "./MovieCard";
import { listMoviesNoFilter, searchMovies } from "../api/endpoints"; // ✅ use your API layer

export function MovieList({ searchInput }) {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const currentPage = useRef(1);
  const hasMoreMoviesRef = useRef(true);
  const observer = useRef();
  const isFetching = useRef(false);

  const mapMovie = (movie) => ({
    // ✅ moved outside component
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  });

  useEffect(() => {
    currentPage.current = 1;
    hasMoreMoviesRef.current = true;
    isFetching.current = false;
    let cancelled = false;

    startTransition(() => {
      setMovieData([]);
      setError(false);
    });

    const fetchPage = async () => {
      if (isFetching.current || !hasMoreMoviesRef.current) return;
      isFetching.current = true;
      setLoading(true);

      try {
        const data = searchInput // ✅ use API functions
          ? await searchMovies(searchInput, currentPage.current)
          : await listMoviesNoFilter(currentPage.current);

        if (cancelled) return;

        setMovieData((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          return [
            ...prev,
            ...data.results.map(mapMovie).filter((m) => !existingIds.has(m.id)),
          ];
        });

        hasMoreMoviesRef.current = data.total_pages > currentPage.current;
      } catch (err) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) {
          isFetching.current = false;
          setLoading(false);
        }
      }
    };

    const interObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching.current &&
          hasMoreMoviesRef.current
        ) {
          currentPage.current += 1;
          fetchPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observer.current) interObserver.observe(observer.current);
    fetchPage();

    return () => {
      cancelled = true;
      interObserver.disconnect();
    };
  }, [searchInput]);

  return (
    <>
      <div className="movies-list">
        {error && <h1>Error loading movies!</h1>}

        {!error && movieData.length === 0 && !loading && (
          <h1>No movies found</h1>
        )}

        {!error &&
          movieData.map((movie) => <MovieCard movie={movie} key={movie.id} />)}

        {loading && <h1>Loading...</h1>}
      </div>

      <div className="sentinel-div" ref={observer}></div>
    </>
  );
}
