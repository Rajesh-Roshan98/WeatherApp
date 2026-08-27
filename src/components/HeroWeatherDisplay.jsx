import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Droplets, Wind, Cloud, MapPin } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import AnimatedWeatherIcon from "./icons/AnimatedWeatherIcon";
import {
  convertTemp,
  formatSpeed,
  getWeatherConditionType,
} from "../utils/weatherUtils";

const HeroWeatherDisplay = ({ weather, forecast, cityName, unit }) => {
  if (!weather) return null;

  const currentTemp = convertTemp(weather.main.temp, unit);
  const feelsLike = convertTemp(weather.main.feels_like, unit);
  const conditionType = getWeatherConditionType(weather);
  const description = weather.weather?.[0]?.description || "Clear";
  const country = weather.sys?.country || "";

  // Clean City & State display: Strip duplicate trailing country code if present
  let cleanCityName = cityName || "";
  if (country && cleanCityName.endsWith(`, ${country}`)) {
    cleanCityName = cleanCityName.slice(0, -(country.length + 2));
  }

  const tempMin =
    forecast?.length > 0
      ? convertTemp(Math.min(...forecast.slice(0, 8).map((f) => f.main.temp_min)), unit)
      : convertTemp(weather.main.temp_min, unit);

  const tempMax =
    forecast?.length > 0
      ? convertTemp(Math.max(...forecast.slice(0, 8).map((f) => f.main.temp_max)), unit)
      : convertTemp(weather.main.temp_max, unit);

  const currentDateFormatted = new Date(weather.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <GlassCard className="w-full flex flex-col justify-between relative overflow-hidden" enableTilt={true}>
      {/* Ambient background soft glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Top Meta Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 relative z-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white font-display flex items-center gap-1.5 min-w-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
              <span className="break-words leading-tight">{cleanCityName}</span>
            </h1>
            {country && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-sky-300 border border-white/15 shadow-sm shrink-0 inline-flex items-center">
                {country}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-5 sm:ml-6 font-medium">{currentDateFormatted}</p>
        </div>

        {/* Condition Badge with live indicator pulse */}
        <div className="px-2.5 sm:px-3 py-1 rounded-full glass-pill flex items-center gap-1.5 border border-white/15 shadow-md shrink-0">
          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          <span className="text-xs font-semibold capitalize text-gray-100 whitespace-nowrap">{description}</span>
        </div>
      </div>

      {/* Main Temperature & Modern Weather Artwork */}
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] items-center gap-4 sm:gap-6 my-2 relative z-10">
        <div className="w-full text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${currentTemp}-${unit}`}
                initial={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white font-display tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              >
                {currentTemp}
              </motion.span>
            </AnimatePresence>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-sky-400 font-display">
              °{unit}
            </span>
          </div>

          {/* Feels Like & High/Low Range Pill */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 text-xs sm:text-sm">
            <span className="text-gray-300 font-medium">
              Feels like <strong className="text-white font-bold">{feelsLike}°{unit}</strong>
            </span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full glass-pill text-xs">
              <span className="flex items-center gap-0.5 text-sky-400 font-semibold">
                <ArrowDown className="w-3 h-3" />
                {tempMin}°
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-0.5 text-rose-400 font-semibold">
                <ArrowUp className="w-3 h-3" />
                {tempMax}°
              </span>
            </div>
          </div>
        </div>

        {/* Animated Weather Artwork with Glass Pedestal & Ambient Glow */}
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <div className="relative p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-white/12 via-white/[0.04] to-transparent border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
            <AnimatedWeatherIcon condition={conditionType} className="w-22 h-22 sm:w-26 sm:h-26 lg:w-28 lg:h-28 relative z-10" />
          </div>
        </div>
      </div>

      {/* Quick Telemetry Capsules - Resilient Fluid 3-Column Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all shadow-sm min-w-0">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0">
            <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight truncate">Humidity</p>
            <p className="text-xs sm:text-sm font-bold text-white tabular-nums truncate">{weather.main?.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all shadow-sm min-w-0">
          <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)] shrink-0">
            <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight truncate">Wind</p>
            <p className="text-xs sm:text-sm font-bold text-white tabular-nums truncate">
              {formatSpeed(weather.wind?.speed || 0, unit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all shadow-sm min-w-0">
          <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)] shrink-0">
            <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight truncate">Cloud Cover</p>
            <p className="text-xs sm:text-sm font-bold text-white tabular-nums truncate">{weather.clouds?.all || 0}%</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HeroWeatherDisplay;
