import axios from "axios";
import { useState, useEffect, useRef, startTransition } from "react";
import { MovieCard } from "./MovieCard";

export function MovieList({ searchInput }) {
  console.log(searchInput);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const currentPage = useRef(1);
  const hasMoreMoviesRef = useRef(true);
  const observer = useRef();
  const isFetching = useRef(false);

  useEffect(() => {
    currentPage.current = 1;
    hasMoreMoviesRef.current = true;
    isFetching.current = false;
    let cancelled = false;

    // Clear list for new search without triggering cascade
    startTransition(() => {
      setMovieData([]);
      setError(false);
    });

    const mapMovie = (movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    });

    const fetchPage = async () => {
      if (isFetching.current || !hasMoreMoviesRef.current) return;
      isFetching.current = true;
      setLoading(true);

      try {
        const url = searchInput
          ? `https://api.themoviedb.org/3/search/movie?query=${searchInput}&page=${currentPage.current}`
          : `https://api.themoviedb.org/3/discover/movie?page=${currentPage.current}`;

        const res = await axios.get(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_BEARER_TOKEN}`,
          },
        });

        if (cancelled) return;

        // Always append to prev — prev will be [] because startTransition cleared it
        setMovieData((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          return [
            ...prev,
            ...res.data.results
              .map(mapMovie)
              .filter((m) => !existingIds.has(m.id)),
          ];
        });

        hasMoreMoviesRef.current = res.data.total_pages > currentPage.current;
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
