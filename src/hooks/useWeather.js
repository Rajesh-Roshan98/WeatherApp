import { useState, useEffect, useCallback } from "react";
import { formatCityName } from "../utils/weatherUtils";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCity, setDisplayCity] = useState("");
  const [unit, setUnit] = useState("C"); // "C" or "F"

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon, customName) => {
    setLoading(true);
    setError(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      ]);

      const current = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (current.cod && Number(current.cod) !== 200) {
        throw new Error(current.message || "Failed to fetch weather data");
      }

      const formattedName = customName || formatCityName(current.name);
      setWeather(current);
      setForecast(forecastData.list || []);
      setDisplayCity(formattedName);
    } catch (err) {
      console.error("Coords weather fetch error:", err);
      setError(err.message || "Unable to retrieve weather for location.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityQuery) => {
    if (!cityQuery || !cityQuery.trim()) return;
    setLoading(true);
    setError(null);

    const query = cityQuery.trim();
    const formattedCity = formatCityName(query);

    try {
      const encoded = encodeURIComponent(query);
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&units=metric&appid=${API_KEY}`
      );
      const current = await currentRes.json();

      if (current.cod && Number(current.cod) !== 200) {
        throw new Error(`Location "${formattedCity}" not found. Please verify spelling.`);
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encoded}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      setWeather(current);
      setForecast(forecastData.list || []);
      setDisplayCity(formattedCity);
    } catch (err) {
      console.error("City weather fetch error:", err);
      setError(err.message || "Failed to fetch weather for the selected city.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      fetchWeatherByCity("London");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const geoData = await geoRes.json();
          const cityName = geoData?.[0]?.name ? `${geoData[0].name}, ${geoData[0].country}` : "My Location";
          await fetchWeatherByCoords(latitude, longitude, cityName);
        } catch {
          await fetchWeatherByCoords(latitude, longitude, "My Location");
        }
      },
      (err) => {
        console.warn("Geolocation permission denied/failed:", err.message);
        fetchWeatherByCity("New York");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchWeatherByCity, fetchWeatherByCoords]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  return {
    weather,
    forecast,
    loading,
    error,
    displayCity,
    unit,
    toggleUnit,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    getUserLocation,
  };
};
