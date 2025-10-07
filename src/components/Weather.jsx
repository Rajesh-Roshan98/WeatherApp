import React, { useEffect, useState, useRef } from "react";
import Navbar from "./NavBar";
import TemperatureChart from "./TemperatureChart";
import WeatherDetails from "./WeatherDetails";
import DailyForecast from "./DailyForecast";
import CurrentWeather from "./CurrentWeather";

const Weather = () => {
  const inputRef = useRef();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(false);
  const [displayCity, setDisplayCity] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const formatCityName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchWeatherByCoords = async (lat, lon, displayName) => {
    setLoading(true);
    setFade(false);
    setError(null);

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const current = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      const formattedName = formatCityName(displayName || current.name);
      setWeather(current);
      setForecast(forecastData.list);
      setDisplayCity(formattedName);
      inputRef.current.value = formattedName;
    } catch (err) {
      console.error("Coordinate weather fetch failed:", err);
      setWeather(null);
      setForecast([]);
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    setLoading(true);
    setFade(false);
    setError(null);

    const formattedCity = formatCityName(city);

    try {
      const encodedCity = encodeURIComponent(city.trim());

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`
      );
      const current = await currentRes.json();

      if (current.cod !== 200) {
        setWeather(null);
        setForecast([]);
        setError(`City not found: "${formattedCity}"`);
        setLoading(false);
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      setWeather(current);
      setForecast(forecastData.list);
      setDisplayCity(formattedCity);
      inputRef.current.value = formattedCity;
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const geoRes = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoRes.json();
            const displayName = geoData?.[0]?.name || "Your Location";
            fetchWeatherByCoords(latitude, longitude, displayName);
          } catch (err) {
            console.error("Reverse geocode failed:", err);
            fetchWeatherByCoords(latitude, longitude, "Your Location");
          }
        },
        (err) => {
          console.warn("Geolocation denied or failed", err);
          fetchWeatherByCity("London");
        }
      );
    } else {
      fetchWeatherByCity("London");
    }
  }, []);

  useEffect(() => {
    if (!loading && weather) setFade(true);
  }, [loading, weather]);

  const getWindDirection = (deg) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <Navbar
        inputRef={inputRef}
        fetchWeather={fetchWeatherByCity}
        displayCity={displayCity}
      />

      {/* ✅ Added padding top so content sits below fixed navbar */}
      <div className="pt-18">
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="w-12 h-12 border-4 border-t-4 border-t-blue-400 border-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center mt-10 text-red-500 font-medium">
            {error}
          </div>
        )}

        {weather && forecast.length > 0 && !loading && (
          <div
            className={`grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 mb-6 items-stretch transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full">
              <CurrentWeather
                weather={weather}
                forecast={forecast}
                cityName={displayCity}
              />
            </div>

            <div className="h-full w-full">
              <TemperatureChart forecast={forecast} cityName={displayCity} />
            </div>
          </div>
        )}

        {weather && !loading && (
          <WeatherDetails
            weather={weather}
            getWindDirection={getWindDirection}
            fade={fade}
            cityName={displayCity}
          />
        )}

        {forecast.length > 0 && !loading && (
          <DailyForecast
            dailyForecast={forecast}
            fade={fade}
            cityName={displayCity}
          />
        )}
      </div>
    </div>
  );
};

export default Weather;
