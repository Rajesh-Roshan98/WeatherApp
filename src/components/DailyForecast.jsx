import React from "react";
import { ArrowDown, ArrowUp, Droplets, Wind, Cloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DailyForecast = ({ dailyForecast, fade, cityName }) => {
  if (!dailyForecast?.length) return null;

  const todayStr = new Date().toLocaleDateString();

  const dailyData = Object.values(
    dailyForecast.reduce((acc, f) => {
      const day = new Date(f.dt * 1000).toLocaleDateString();
      if (day === todayStr) return acc; // skip today
      if (!acc[day]) acc[day] = [];
      acc[day].push(f);
      return acc;
    }, {})
  )
    .slice(0, 5)
    .map((dayForecasts) => {
      const temps = dayForecasts.map((f) => f.main.temp);
      const temp_min = Math.min(...temps);
      const temp_max = Math.max(...temps);
      const humidity =
        dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) /
        dayForecasts.length;
      const wind =
        dayForecasts.reduce((sum, f) => sum + f.wind.speed, 0) /
        dayForecasts.length;
      const mid = Math.floor(dayForecasts.length / 2);
      const weather = dayForecasts[mid].weather[0];
      const clouds = dayForecasts[mid].clouds; // added clouds

      return {
        date: new Date(dayForecasts[0].dt * 1000),
        temp_min,
        temp_max,
        humidity: Math.round(humidity),
        wind: wind.toFixed(1),
        weather,
        clouds,
      };
    });

  const formatTemp = (t) => `${Math.round(t)}°`;

  return (
    <div
      className={`bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <h3 className="text-xl font-semibold mb-5 text-center">
        5-Day Forecast for {cityName}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyData.map((f, idx) => (
          <div key={idx} className="bg-gray-800/60 rounded-xl p-4 text-center">
            <p className="text-gray-300 text-sm mb-2">
              {f.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>

            <img
              src={`https://openweathermap.org/img/wn/${f.weather.icon}@2x.png`}
              alt={f.weather.description}
              className="mx-auto w-16 h-16 mb-1"
            />

            <p className="capitalize text-gray-200 text-sm mb-2">
              {f.weather.description}
            </p>

            {/* Min/Max */}
            <div className="flex justify-center items-center gap-4 mb-1">
              {[
                { value: f.temp_min, Icon: ArrowDown, color: "text-blue-400" },
                { value: f.temp_max, Icon: ArrowUp, color: "text-red-400" },
              ].map(({ value, Icon, color }, i) => (
                <AnimatePresence mode="wait" key={i}>
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center gap-1 ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                    {formatTemp(value)}
                  </motion.span>
                </AnimatePresence>
              ))}
            </div>

            {/* Humidity & Wind & Clouds */}
            <div className="flex justify-center items-center gap-4 text-white text-sm">
              <span className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-500" /> {f.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-blue-500" /> {f.wind} m/s
              </span>
              <span className="flex items-center gap-1">
                <Cloud className="h-4 w-4 text-blue-500" /> {f.clouds.all}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
