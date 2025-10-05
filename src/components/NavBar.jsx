import React, { useEffect } from "react";
import { Search } from "lucide-react";

const NavBar = ({ inputRef, fetchWeather, displayCity }) => {
  const handleSearch = () => {
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;
    fetchWeather(userInput, userInput); // user input is displayed
  };

  // Update input field if displayCity changes (e.g., default city or after search)
  useEffect(() => {
    if (displayCity && inputRef.current) {
      inputRef.current.value = displayCity;
    }
  }, [displayCity, inputRef]);

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight">🌤️ CLIMACAST</h1>
      <div className="flex items-center bg-gray-800/70 backdrop-blur-md shadow-md rounded-full px-4 py-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          className="bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1 w-40"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Search
          size={20}
          className="text-white cursor-pointer transition-transform duration-200 hover:scale-110"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default NavBar;
