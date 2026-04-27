import { useRef } from "react";
import "./SearchBar.css";

export function SearchBar({ setSearchInput }) {
  const timerRef = useRef(null);

  const processInput = (e) => {
    const value = e.target.value;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setSearchInput(value);
      console.log("Debounced:", value);
    }, 500);
  };

  return (
    <input
      type="text"
      placeholder="Search"
      onChange={processInput}
      className="search-input "
    />
  );
}
