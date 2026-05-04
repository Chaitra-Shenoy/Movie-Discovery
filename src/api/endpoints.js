import { fetchData } from "./config.js";

export const listMoviesNoFilter = (page) => {
  return fetchData("discover/movie", { page });
};

export const searchMovies = (query, page) => {
  return fetchData("search/movie", { query, page });
};

export const movieData = (id) => {
  return fetchData(`movie/${id}`);
};
