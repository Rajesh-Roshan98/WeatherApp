import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, X, Loader2, Compass, AlertCircle } from "lucide-react";

const LocationAutocompleteDropdown = ({
  suggestions,
  loading,
  error,
  query,
  recentSearches,
  highlightedIndex,
  onSelectSuggestion,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
}) => {
  const isTyping = query.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 mt-2 bg-[#090e1c]/95 backdrop-blur-3xl rounded-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7)] z-50 overflow-hidden max-h-[65vh] sm:max-h-[380px] overflow-y-auto overscroll-contain touch-pan-y"
    >
      {/* 1. Live Geocoding Suggestions Mode (User is actively typing) */}
      {isTyping && (
        <div className="p-2">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-2.5 px-3 py-3 text-xs text-sky-300 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Searching global locations...</span>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-rose-300 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          {!loading && !error && suggestions.length > 0 && (
            <ul className="space-y-1" role="listbox">
              {suggestions.map((item, idx) => {
                const isSelected = highlightedIndex === idx;
                return (
                  <li
                    key={`${item.lat}-${item.lon}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onSelectSuggestion(item)}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-sky-500/25 border border-sky-400/40 text-white shadow-sm"
                        : "text-gray-200 hover:bg-white/10 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? "bg-sky-400 text-gray-950 shadow-[0_0_8px_#38bdf8]"
                            : "bg-white/10 text-sky-400"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">
                          {item.state ? `${item.state}, ` : ""}
                          {item.country}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-sky-300 shrink-0">
                      {item.country}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Empty State: No results found */}
          {!loading && !error && suggestions.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-400 space-y-1">
              <Compass className="w-6 h-6 text-gray-500 mx-auto stroke-1" />
              <p className="font-semibold text-gray-300">No locations found</p>
              <p className="text-[11px] text-gray-500">
                Please check the spelling of your search query.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Recent Searches Mode (When search input is empty but focused) */}
      {!isTyping && (
        <div className="p-2.5">
          {recentSearches && recentSearches.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-white/10 text-[11px]">
                <span className="font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-gray-500 hover:text-rose-400 transition-colors font-medium text-[10px]"
                >
                  Clear All
                </button>
              </div>

              <ul className="space-y-1 mt-1.5" role="listbox">
                {recentSearches.map((item, idx) => (
                  <li
                    key={`${item.lat || item.name}-${idx}`}
                    onClick={() => onSelectRecentSearch(item)}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-400 transition-colors shrink-0" />
                      <span className="text-xs font-semibold truncate">
                        {item.formattedName || item.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onRemoveRecentSearch(idx, e)}
                      title="Remove from history"
                      className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-gray-400 space-y-1">
              <Compass className="w-5 h-5 text-sky-400/80 mx-auto" />
              <p className="font-medium text-gray-300">
                Type any city or region to search
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                Real-time OpenWeather Geocoding
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default LocationAutocompleteDropdown;
