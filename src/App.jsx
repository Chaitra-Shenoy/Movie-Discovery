import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { MovieList } from "./components/MovieList";
import { MovieDetail } from "./components/MovieDetail";
import { Header } from "./components/Header";
import { useState } from "react";
function App() {
  const [searchInput, setSearchInput] = useState("");
  return (
    <>
      <title>Movie Discovery</title>
      <Link to="/">
        <Header
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        ></Header>
      </Link>
      <Routes>
        <Route
          path="/home"
          element={<MovieList searchInput={searchInput}></MovieList>}
        />
        <Route
          path="/"
          element={<MovieList searchInput={searchInput}></MovieList>}
        />
        <Route path="/movie/:id" element={<MovieDetail></MovieDetail>} />
      </Routes>
    </>
  );
}

export default App;
