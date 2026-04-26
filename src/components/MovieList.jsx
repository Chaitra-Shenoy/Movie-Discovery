import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { MovieCard } from "./MovieCard";

export function MovieList() {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hasMoreMoviesRef = useRef(true);
  const observer = useRef();
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieDataRaw = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?page=${currentPage}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_API_BEARER_TOKEN}`,
            },
          },
        );

        if (movieDataRaw.status !== 200) {
          throw new Error("List Movie Endpoint failed!");
        }

        const moviesData = movieDataRaw.data.results;
        const structuredMovieList = moviesData.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        setMovieData((prev) => {
          const existingId = new Set(prev.map((m) => m.id));
          return [
            ...prev,
            ...structuredMovieList.filter((movie) => !existingId.has(movie.id)),
          ];
        });
        hasMoreMoviesRef.current = movieDataRaw.data.total_pages > currentPage;
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        isFetching.current = false; // finished loading
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const interObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching.current &&
          hasMoreMoviesRef.current
        ) {
          isFetching.current = true;
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );
    if (observer.current) interObserver.observe(observer.current);

    return () => interObserver.disconnect();
  }, []);
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
