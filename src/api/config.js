import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const BEARER_TOKEN = import.meta.env.VITE_API_BEARER_TOKEN;

export const fetchData = async (endpoint, params = {}) => {
  const url = `${BASE_URL}/${endpoint}`;

  const response = await axios.get(url, {
    params,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });

  return response.data;
};
