import "./MovieDetail.css";
import { useParams } from "react-router-dom";
import { movieData } from "../api/endpoints";
import { useEffect, useState } from "react";

export function MovieDetail() {
  const { id } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await movieData(id);
        setMovieInfo(data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErrorStatus(true);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) return <h1>Loading...</h1>;
  if (errorStatus) return <p>Something went wrong.</p>;

  return (
    <>
      <p className="movie-header-detailed">{movieInfo?.original_title}</p>
      <div className="detailed-view">
        <img
          className="movie-img-detailed"
          src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
        />

        <div className="movie-info">
          <table>
            <tbody>
              <tr>
                <th>Original Language</th>
                <td>{movieInfo?.original_language}</td>
              </tr>
              <tr>
                <th>Overview</th>
                <td>{movieInfo?.overview}</td>
              </tr>
              <tr>
                <th>Genre</th>
                <td>
                  {movieInfo.genres?.map((genre) => genre.name).join(", ") ||
                    "N/A"}
                </td>
              </tr>
              <tr>
                <th>Production Companies</th>
                <td>
                  {movieInfo?.production_companies?.map((company) => {
                    return (
                      <div key={company?.id} className="comp">
                        <img
                          className="comp-logo"
                          src={`https://image.tmdb.org/t/p/w500${company?.logo_path}`}
                        />
                        <p>{company?.name}</p>
                      </div>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{movieInfo?.status}</td>
              </tr>
              <tr>
                <th>Runtime</th>
                <td>{movieInfo?.runtime} minutes</td>
              </tr>
              <tr>
                <th>Tag Line</th>
                <td>{movieInfo?.tagline}</td>
              </tr>
              <tr>
                <th>Release Date</th>
                <td>{movieInfo?.release_date}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
