import "./MovieCard.css";
import { Link } from "react-router-dom";

export function MovieCard({ movie }) {
  console.log(movie);
  return (
    <div className="movie">
      <div>
        <Link to={`/movie/${movie.id}`}>
          <img src={movie.poster_path} className="movie-img"></img>
        </Link>
      </div>
      <div className="movie-header">{movie.title}</div>
      <div className="movie-info">
        <div className="movie-release">{movie.release_date}</div>
      </div>
      <div className="movie-overview">{movie.overview}</div>
    </div>
  );
}
