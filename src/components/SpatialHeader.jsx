import React, { useState, useEffect, useRef } from "react";
import { Search, Navigation, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import UnitToggle from "./ui/UnitToggle";
import { useLocationAutocomplete } from "../hooks/useLocationAutocomplete";
import LocationAutocompleteDropdown from "./search/LocationAutocompleteDropdown";

const SpatialHeader = ({
  displayCity,
  isLoading,
  onSearch,
  onSelectLocation,
  onLocationClick,
  unit,
  onUnitToggle,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    highlightedIndex,
    setHighlightedIndex,
  } = useLocationAutocomplete();

  // Sync current city into search input only when resolved and not typing/open
  useEffect(() => {
    if (displayCity && !isLoading && !isDropdownOpen) {
      setQuery(displayCity);
    }
  }, [displayCity, isLoading, isDropdownOpen, setQuery]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Submit manual search
  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    saveRecentSearch({
      name: trimmed,
      formattedName: trimmed,
    });

    onSearch(trimmed);
    setIsDropdownOpen(false);
  };

  // Select suggestion from autocomplete dropdown
  const handleSelectSuggestion = (locationItem) => {
    saveRecentSearch(locationItem);
    setQuery(locationItem.formattedName || locationItem.name);
    setIsDropdownOpen(false);

    if (onSelectLocation && locationItem.lat !== undefined && locationItem.lon !== undefined) {
      onSelectLocation(locationItem.lat, locationItem.lon, locationItem.formattedName);
    } else {
      onSearch(locationItem.formattedName || locationItem.name);
    }
  };

  // Select recent search item
  const handleSelectRecent = (recentItem) => {
    setQuery(recentItem.formattedName || recentItem.name);
    setIsDropdownOpen(false);

    if (
      onSelectLocation &&
      recentItem.lat !== undefined &&
      recentItem.lon !== undefined
    ) {
      onSelectLocation(recentItem.lat, recentItem.lon, recentItem.formattedName);
    } else {
      onSearch(recentItem.formattedName || recentItem.name);
    }
  };

  return (
    <header className="sticky top-2 sm:top-4 z-50 w-full max-w-none px-3 sm:px-6 lg:px-8 xl:px-10 mb-4 sm:mb-6">
      <div className="glass-panel rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-2xl border border-white/10">
        
        {/* Brand Logo & Clean Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative group cursor-pointer">
            <img
              src={logo}
              alt="ClimaCast Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-sky-500/30 group-hover:ring-sky-400 transition-all duration-300 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-gray-900 rounded-full" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent select-none">
            ClimaCast
          </span>
        </div>

        {/* Search Bar & Autocomplete Suggestions Dropdown */}
        <div
          ref={searchContainerRef}
          className="relative order-last sm:order-none w-full sm:flex-1 sm:max-w-md"
        >
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search global city or region..."
              aria-label="Search weather by city or location"
              autoComplete="off"
              className="w-full bg-white/5 hover:bg-white/10 focus:bg-gray-900/95 text-xs sm:text-sm text-white placeholder-gray-400 pl-9 sm:pl-10 pr-20 sm:pr-18 py-2 rounded-full border border-white/15 focus:border-sky-400/80 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all duration-200"
            />

            {/* Clear Input Button (Touch target min-h 36px) */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsDropdownOpen(true);
                }}
                className="absolute right-10 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Clear input"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* GPS Geolocation Button (Touch target min-w 36px) */}
            <button
              type="button"
              onClick={onLocationClick}
              title="Locate Me (GPS)"
              aria-label="Use current location"
              className="absolute right-1.5 p-2 rounded-full text-gray-400 hover:text-sky-400 hover:bg-white/10 transition-colors"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </form>

          {/* Autocomplete & Recent Searches Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <LocationAutocompleteDropdown
                suggestions={suggestions}
                loading={loading}
                error={error}
                query={query}
                recentSearches={recentSearches}
                highlightedIndex={highlightedIndex}
                onSelectSuggestion={handleSelectSuggestion}
                onSelectRecentSearch={handleSelectRecent}
                onRemoveRecentSearch={removeRecentSearch}
                onClearRecentSearches={clearRecentSearches}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Unit Toggle Switcher */}
        <div className="flex items-center gap-2">
          <UnitToggle unit={unit} onToggle={onUnitToggle} />
        </div>
      </div>
    </header>
  );
};

export default SpatialHeader;
