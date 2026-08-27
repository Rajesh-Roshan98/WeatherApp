import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import WeatherEnvironment from "./environment/WeatherEnvironment";
import SpatialHeader from "./SpatialHeader";
import HeroWeatherDisplay from "./HeroWeatherDisplay";
import InteractiveHourlyForecast from "./InteractiveHourlyForecast";
import TelemetryBentoGrid from "./TelemetryBentoGrid";
import ExtendedForecastDeck from "./ExtendedForecastDeck";

const Weather = () => {
  const {
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
  } = useWeather();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-slate-100 antialiased overflow-x-hidden">
      {/* 1. Dynamic 3D/Canvas Weather Background Engine */}
      <WeatherEnvironment weather={weather} />

      {/* 2. Floating Spatial HUD Header */}
      <SpatialHeader
        displayCity={displayCity}
        isLoading={loading}
        onSearch={fetchWeatherByCity}
        onSelectLocation={fetchWeatherByCoords}
        onLocationClick={getUserLocation}
        unit={unit}
        onUnitToggle={toggleUnit}
      />

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 w-full max-w-none px-3 sm:px-6 lg:px-8 xl:px-10 pb-8 sm:pb-12">
        {/* Loading Overlay */}
        {loading && !weather && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
              <div className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/30 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm font-medium tracking-wide text-sky-200 animate-pulse text-center px-4">
              Calibrating spatial atmospheric telemetry...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 backdrop-blur-xl flex items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm shadow-xl"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchWeatherByCity(displayCity || "London")}
              className="px-3 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-xs font-semibold text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </motion.div>
        )}

        {/* Weather Telemetry Dashboard Content */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Top Grid: Hero Weather Display (Left) + Interactive 24-hr Forecast (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(380px,460px)_1fr] gap-6 items-stretch">
              <HeroWeatherDisplay
                weather={weather}
                forecast={forecast}
                cityName={displayCity}
                unit={unit}
              />
              <InteractiveHourlyForecast
                forecast={forecast}
                unit={unit}
              />
            </div>

            {/* Middle: 6-Tile Telemetry Bento Grid */}
            <TelemetryBentoGrid
              weather={weather}
              forecast={forecast}
              unit={unit}
            />

            {/* Bottom: 5-Day Extended Forecast Deck */}
            <ExtendedForecastDeck
              forecast={forecast}
              cityName={displayCity}
              unit={unit}
            />
          </motion.div>
        )}
      </main>

      {/* Enterprise Footer Watermark with Entrance Animation */}
      {weather && (
        <motion.footer
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="w-full py-6 text-center text-xs text-gray-400 border-t border-white/5 backdrop-blur-md space-y-1.5"
        >
          <p className="font-medium tracking-wide text-gray-300">
            ClimaCast • Real-time weather intelligence powered by OpenWeather
          </p>
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Rajesh Roshan · All rights reserved.
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            Designed & Built by <span className="text-sky-400 font-medium">Rajesh Roshan</span>
          </p>
        </motion.footer>
      )}
    </div>
  );
};

export default Weather;
