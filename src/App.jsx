import "./App.css";
import { MovieList } from "./components/MovieList";
import { Header } from "./components/Header";
import { useState } from "react";
function App() {
  const [searchInput, setSearchInput] = useState("");
  return (
    <>
      <title>Movie Discovery</title>
      <Header
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      ></Header>
      <MovieList searchInput={searchInput}></MovieList>
    </>
  );
}

export default App;
