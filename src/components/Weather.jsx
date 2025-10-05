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
  const [displayCity, setDisplayCity] = useState(""); // Name shown in UI
  const [coords, setCoords] = useState(null); // Store user's coordinates

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Fetch weather using city name or coordinates
  const fetchWeather = async ({ city, useCoords = false }) => {
    if (!city && !useCoords) return;
    setLoading(true);
    setFade(false);
    setError(null);

    try {
      let current, forecastData;

      if (useCoords && coords) {
        // Weather by coordinates
        const { lat, lon } = coords;

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        current = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        forecastData = await forecastRes.json();
      } else {
        // Weather by city name
        const encodedCity = encodeURIComponent(city.trim());

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`
        );
        current = await currentRes.json();

        if (current.cod !== 200) {
          setWeather(null);
          setForecast([]);
          setError(`City not found: "${city}"`);
          setLoading(false);
          return;
        }

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`
        );
        forecastData = await forecastRes.json();
      }

      setWeather(current);
      setForecast(forecastData.list);
      setDisplayCity(inputRef.current.value || current.name);
      setError(null);
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // On load: get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });

          // Reverse geocode for display name
          try {
            const geoRes = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoRes.json();
            const cityName = geoData?.[0]?.name || "";
            if (inputRef.current) inputRef.current.value = cityName;
            setDisplayCity(cityName);

            // Fetch weather using coordinates
            fetchWeather({ useCoords: true });
          } catch {
            fetchWeather({ city: "Bhubaneswar" });
          }
        },
        () => {
          inputRef.current.value = "Bhubaneswar";
          fetchWeather({ city: "Bhubaneswar" });
        }
      );
    } else {
      inputRef.current.value = "Bhubaneswar";
      fetchWeather({ city: "Bhubaneswar" });
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
      <Navbar inputRef={inputRef} fetchWeather={fetchWeather} displayCity={displayCity} />

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-12 h-12 border-4 border-t-4 border-t-blue-400 border-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-center mt-10 text-red-500 font-medium">{error}</div>
      )}

      {weather && forecast.length > 0 && !loading && (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}>
          <CurrentWeather weather={weather} forecast={forecast} cityName={displayCity} />
          <TemperatureChart forecast={forecast} cityName={displayCity} />
        </div>
      )}

      {weather && !loading && (
        <WeatherDetails weather={weather} getWindDirection={getWindDirection} fade={fade} cityName={displayCity} />
      )}

      {forecast.length > 0 && !loading && (
        <DailyForecast dailyForecast={forecast} fade={fade} cityName={displayCity} />
      )}
    </div>
  );
};

export default Weather;
