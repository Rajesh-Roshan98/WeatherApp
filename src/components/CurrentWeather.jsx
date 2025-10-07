import React from "react";
import { ArrowDown, ArrowUp, Droplet, Wind, Cloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CurrentWeather = ({ weather, forecast, cityName }) => {
  const formatTemp = (temp) => `${Math.round(temp)}°`;

  const temp_min =
    forecast?.length > 0
      ? Math.min(...forecast.map((f) => f.main.temp_min))
      : weather.main.temp;
  const temp_max =
    forecast?.length > 0
      ? Math.max(...forecast.map((f) => f.main.temp_max))
      : weather.main.temp;

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md w-full transition duration-700">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {cityName}, {weather.sys.country}
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <AnimatePresence mode="wait">
              <motion.p
                key={weather.main.temp}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="text-6xl sm:text-7xl font-bold text-white leading-tight"
              >
                {formatTemp(weather.main.temp)}
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col gap-1 text-sm mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={temp_min}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-1 text-blue-400"
                >
                  <ArrowDown className="h-4 w-4" />
                  {formatTemp(temp_min)}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={temp_max}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-1 text-red-400"
                >
                  <ArrowUp className="h-4 w-4" />
                  {formatTemp(temp_max)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-gray-300 mt-1">
            Feels like{" "}
            <span className="text-blue-400 font-medium">
              {formatTemp(weather.main.feels_like)}
            </span>
          </p>

          <div className="mt-3 flex justify-start gap-6 text-gray-400 text-sm">
            <div className="flex flex-col items-center">
              <Droplet className="h-5 w-5 text-blue-500" />
              <span className="text-white">{weather.main.humidity}%</span>
              <span className="text-gray-300 text-xs">Humidity</span>
            </div>

            <div className="flex flex-col items-center">
              <Wind className="h-5 w-5 text-blue-500" />
              <span className="text-white">{weather.wind.speed} m/s</span>
              <span className="text-gray-300 text-xs">Wind</span>
            </div>

            <div className="flex flex-col items-center">
              <Cloud className="h-5 w-5 text-blue-500" />
              <span className="text-white">{weather.clouds.all}%</span>
              <span className="text-gray-300 text-xs">Clouds</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-4 sm:mt-0">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="Weather Icon"
            className="w-28 h-28 drop-shadow-md"
          />
          <p className="capitalize text-lg text-gray-200 mt-1 text-center">
            {weather.weather[0].description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
