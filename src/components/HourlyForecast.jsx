import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const HourlyForecast = ({ forecast, fade }) => {
  if (!forecast || forecast.length === 0) return null;

  // Show next 12 hours
  const next12Hours = forecast.slice(0, 12);

  return (
    <div
      className={`bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <h3 className="text-xl font-semibold mb-5 text-center">12-Hour Forecast</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {next12Hours.map((f, idx) => (
          <div
            key={idx}
            className="bg-gray-800/60 rounded-xl p-4 text-center flex flex-col items-center gap-1"
          >
            {/* Time */}
            <p className="text-gray-300 text-sm mb-1">
              {new Date(f.dt * 1000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Weather Icon */}
            <img
              src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
              alt={f.weather[0].description}
              className="w-16 h-16 mb-1"
            />

            {/* Description */}
            <p className="capitalize text-gray-200 text-sm mb-1">
              {f.weather[0].description}
            </p>

            {/* Temperature */}
            <p className="text-white font-semibold text-lg mb-1">
              {Math.round(f.main.temp)}°
            </p>

            {/* Min / Max with arrows */}
            <div className="flex gap-2 text-sm font-medium">
              <span className="flex items-center gap-1 text-blue-500">
                <ArrowDown className="h-3 w-3" />
                {Math.round(f.main.temp_min)}°
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <ArrowUp className="h-3 w-3" />
                {Math.round(f.main.temp_max)}°
              </span>
            </div>

            {/* Humidity */}
            <p className="text-gray-400 text-sm mt-1">💧 {f.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
