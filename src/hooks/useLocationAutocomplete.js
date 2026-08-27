import { useState, useEffect, useRef, useCallback } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
const RECENT_SEARCHES_KEY = "climacast_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// In-memory LRU cache for autocomplete queries
const geocodeCache = new Map();

// Helper to validate recent search item schema
const isValidSearchItem = (item) => {
  return (
    item &&
    typeof item === "object" &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    (item.lat === undefined || typeof item.lat === "number") &&
    (item.lon === undefined || typeof item.lon === "number")
  );
};

export const useLocationAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Load real recent searches from localStorage on mount with strict schema validation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validated = parsed.filter(isValidSearchItem).slice(0, MAX_RECENT_SEARCHES);
          setRecentSearches(validated);
        }
      }
    } catch (e) {
      console.warn("Could not read recent searches from localStorage:", e);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((locationItem) => {
    if (!locationItem || !locationItem.name) return;

    setRecentSearches((prev) => {
      // Filter out duplicate by name + country / lat + lon
      const filtered = prev.filter(
        (item) =>
          item.formattedName !== locationItem.formattedName &&
          !(item.lat === locationItem.lat && item.lon === locationItem.lon)
      );

      const updated = [locationItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save recent search to localStorage:", e);
      }
      return updated;
    });
  }, []);

  // Remove single recent search
  const removeRecentSearch = useCallback((indexToRemove, e) => {
    e?.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not update recent searches:", err);
      }
      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearRecentSearches = useCallback((e) => {
    e?.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.warn("Could not clear recent searches:", err);
    }
  }, []);

  // Fetch geocoding suggestions from OpenWeather Direct Geocoding API
  const fetchSuggestions = useCallback(async (searchTerm) => {
    const trimmed = searchTerm.trim();

    if (!trimmed || trimmed.length === 0) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // 1. Check in-memory cache
    const cacheKey = trimmed.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
      setSuggestions(geocodeCache.get(cacheKey));
      setLoading(false);
      setError(null);
      return;
    }

    // 2. Cancel in-flight network request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const encoded = encodeURIComponent(trimmed);
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encoded}&limit=5&appid=${API_KEY}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!res.ok) {
        throw new Error(`Geocoding error: ${res.statusText}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data.map((item) => {
          const parts = [item.name];
          if (item.state && item.state !== item.name) parts.push(item.state);
          if (item.country) parts.push(item.country);

          return {
            name: item.name,
            state: item.state || "",
            country: item.country || "",
            lat: item.lat,
            lon: item.lon,
            formattedName: parts.join(", "),
          };
        });

        // Store in cache (limit cache size to 100 entries)
        if (geocodeCache.size > 100) {
          const firstKey = geocodeCache.keys().next().value;
          geocodeCache.delete(firstKey);
        }
        geocodeCache.set(cacheKey, formatted);

        setSuggestions(formatted);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Geocoding fetch error:", err);
        setError("Unable to load location suggestions");
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced input handler (350ms)
  useEffect(() => {
    setHighlightedIndex(-1);

    if (!query || !query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
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
  };
};
