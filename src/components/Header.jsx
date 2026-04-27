import "./Header.css";
import logo from "../assets/logo.png";
import { SearchBar } from "./SearchBar";

export function Header({ searchInput, setSearchInput }) {
  return (
    <div className="header">
      <img src={logo} alt="Movie Discovery Logo" className="logo"></img>
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      ></SearchBar>
    </div>
  );
}
