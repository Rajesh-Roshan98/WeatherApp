import React, { useEffect } from "react";
import { Search } from "lucide-react";
import logo from "../assets/logo.png"; // 🔹 Replace with your logo path

const NavBar = ({ inputRef, fetchWeather, displayCity }) => {
  const handleSearch = () => {
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;
    fetchWeather(userInput, userInput);
  };

  useEffect(() => {
    if (displayCity && inputRef.current) {
      inputRef.current.value = displayCity;
    }
  }, [displayCity, inputRef]);

  return (
    <div
  className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-3 sm:px-8 
             py-2 bg-gray-900/40 backdrop-blur-md shadow-lg border-b border-white/10"
>
  {/* Logo */}
  <div className="flex items-center gap-2">
    <img
      src={logo}
      alt="Weather Logo"
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md object-cover 
                 transition-transform duration-300 hover:scale-110"
    />
  </div>

  {/* Search Bar */}
  <div
    className="flex items-center bg-white/10 border border-white/20 backdrop-blur-md 
               shadow-lg rounded-full px-2 py-1 transition duration-300 
               w-[45%] sm:w-[180px] md:w-[220px] lg:w-[240px]"
  >
    <input
      ref={inputRef}
      type="text"
      placeholder="Search city..."
      className="bg-transparent outline-none text-white placeholder-gray-300 
                 px-2 py-1 w-full text-sm sm:text-sm"
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
    />
    <Search
      size={18}
      className="text-white cursor-pointer hover:text-blue-400 
                 transition-transform duration-200 hover:scale-110"
      onClick={handleSearch}
    />
  </div>
</div>
  );
};

export default NavBar;
