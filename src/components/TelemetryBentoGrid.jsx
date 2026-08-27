import React from "react";
import {
  Sun,
  Moon,
  Compass,
  Gauge,
  Eye,
  Waves,
  ShieldAlert,
  Sunrise,
  Sunset,
  Sparkles,
  Wind,
} from "lucide-react";
import GlassCard from "./ui/GlassCard";
import {
  calculateSolarProgress,
  estimateUVIndex,
  getPressureTelemetry,
  getVisibilityInfo,
  formatSpeed,
  formatLocalTime,
  getWindDirection,
  getMoonPhase,
  getBeaufortScale,
} from "../utils/weatherUtils";


import { motion, AnimatePresence } from "framer-motion";

const CelestialCycleCard = ({ weather }) => {
  const { sys = {}, dt, timezone = 0 } = weather;
  const now = dt || Math.floor(Date.now() / 1000);
  const sunrise = sys.sunrise || (now - 21600);
  const sunset = sys.sunset || (now + 21600);

  const isDay = sunrise && sunset ? now >= sunrise && now < sunset : true;
  const moonInfo = getMoonPhase(now);

  const dayDuration = sunset - sunrise > 0 ? sunset - sunrise : 43200;
  const nightDuration = 86400 - dayDuration;

  const sunriseStr = sys.sunrise
    ? formatLocalTime(sys.sunrise, timezone)
    : "06:00 AM";
  const sunsetStr = sys.sunset
    ? formatLocalTime(sys.sunset, timezone)
    : "06:30 PM";

  const moonriseTime = formatLocalTime(sunset + 1800, timezone);
  const moonsetTime = formatLocalTime(sunrise - 1800, timezone);

  let stage = "midday";
  let progressPercent = 50;

  if (isDay) {
    const elapsedDay = now - sunrise;
    progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDay / dayDuration) * 100)));

    if (now < sunrise + dayDuration * 0.25) {
      stage = "sunrise"; // 🌅 Stage 1: Sunrise (Golden Morning)
    } else if (now < sunrise + dayDuration * 0.75) {
      stage = "midday"; // ☀️ Stage 2: Midday (Radiant High Noon)
    } else {
      stage = "sunset"; // 🌇 Stage 3: Sunset (Golden Hour & Dusk)
    }
  } else {
    const elapsedNight = now >= sunset ? now - sunset : now + (86400 - sunset);
    progressPercent = Math.min(100, Math.max(0, Math.round((elapsedNight / nightDuration) * 100)));

    if (elapsedNight < nightDuration * 0.25) {
      stage = "lunarrise"; // 🌔 Stage 4: Lunarrise
    } else if (elapsedNight < nightDuration * 0.75) {
      stage = "midlunar"; // 🌕 Stage 5: Mid-Lunar Zenith
    } else {
      stage = "lunarset"; // 🌘 Stage 6: Lunarset
    }
  }

  return (
    <GlassCard className="flex flex-col justify-between relative overflow-hidden" enableTilt={true}>
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
          {isDay ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
          {isDay ? "Solar Cycle" : "Lunar Cycle"}
        </span>
        <span className="px-2 py-0.5 rounded-full glass-pill font-mono text-[11px] text-sky-300 font-semibold shadow-sm">
          {isDay ? `${progressPercent}% Daylight` : `${moonInfo.illumination}% Visible`}
        </span>
      </div>

      {/* Animated Glowing Sun & Moon Celestial Stage */}
      <div className="my-2">
        <AnimatePresence mode="wait">
          {/* ================= SOLAR STAGES ================= */}
          {stage === "sunrise" && (
            <motion.div
              key="sunrise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-amber-500/20 via-pink-500/10 to-transparent border border-amber-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-amber-200 font-mono relative z-10">
                <span className="font-semibold">Morning Dawn</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-100 border border-amber-500/35">
                  Sunrise Phase
                </span>
              </div>

              {/* Animated Sun Orb with Soft Pulsing Golden Aura */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Soft Outer Golden Halo */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.65, 0.35],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/40 to-yellow-300/30 blur-xl"
                />
                {/* Inner Expanding Warm Aura */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.1, 0.95],
                    opacity: [0.7, 0.95, 0.7],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 shadow-[0_0_28px_rgba(251,191,36,0.85)]"
                />
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-amber-100">
                <span className="flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                  Rising Sun
                </span>
                <span className="font-mono text-amber-200">{sunriseStr}</span>
              </div>
            </motion.div>
          )}

          {stage === "midday" && (
            <motion.div
              key="midday"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-sky-500/20 via-blue-500/10 to-transparent border border-sky-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-sky-200 font-mono relative z-10">
                <span className="font-semibold">High Noon Sky</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/25 text-sky-100 border border-sky-500/35">
                  Midday Zenith
                </span>
              </div>

              {/* Radiant Bright Sun Orb with Energetic Luminous Corona */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Expansive Daylight Corona */}
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.45, 0.75, 0.45],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400/40 via-yellow-200/50 to-white/40 blur-xl"
                />
                {/* Core Radiant Sun Sphere */}
                <motion.div
                  animate={{
                    scale: [0.98, 1.04, 0.98],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-100 to-white shadow-[0_0_35px_rgba(253,224,71,0.9)]"
                />
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-sky-100">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-yellow-300 shrink-0" />
                  Peak Daylight
                </span>
                <span className="font-mono text-sky-200">{progressPercent}% Peak</span>
              </div>
            </motion.div>
          )}

          {stage === "sunset" && (
            <motion.div
              key="sunset"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-rose-600/25 via-orange-500/15 to-transparent border border-rose-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-rose-200 font-mono relative z-10">
                <span className="font-semibold">Golden Hour</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-100 border border-rose-500/35">
                  Sunset Phase
                </span>
              </div>

              {/* Warm Golden/Orange Sun Orb with Descending Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Soft Dusk Ambient Halo */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-22 h-22 rounded-full bg-gradient-to-tr from-rose-600/40 via-orange-500/30 to-amber-300/20 blur-xl"
                />
                {/* Sinking Sun Sphere */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.05, 0.95],
                    opacity: [0.8, 0.95, 0.8],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full bg-gradient-to-t from-rose-500 via-orange-400 to-amber-300 shadow-[0_0_30px_rgba(244,63,94,0.85)]"
                />
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-rose-100">
                <span className="flex items-center gap-1.5">
                  <Sunset className="w-4 h-4 text-rose-400 shrink-0" />
                  Sun Sinking
                </span>
                <span className="font-mono text-rose-200">{sunsetStr}</span>
              </div>
            </motion.div>
          )}

          {/* ================= LUNAR STAGES ================= */}
          {stage === "lunarrise" && (
            <motion.div
              key="lunarrise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-indigo-950/60 via-[#070b18] to-transparent border border-indigo-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-indigo-200 font-mono relative z-10">
                <span className="font-semibold">Early Night Sky</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-100 border border-indigo-500/35">
                  Moonrise
                </span>
              </div>

              {/* Spatial Luminous Moon Orb with Vector Maria Precision */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.22, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-22 h-22 rounded-full bg-gradient-to-tr from-indigo-400/35 to-blue-200/25 blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [0.96, 1.04, 0.96],
                    opacity: [0.95, 1, 0.95],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full shadow-[0_0_28px_rgba(224,231,255,0.85)] flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <defs>
                      <radialGradient id="lunarRiseSphere" cx="38%" cy="38%" r="62%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="45%" stopColor="#f1f5f9" />
                        <stop offset="75%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#lunarRiseSphere)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    {/* Organic Lunar Maria (Craters) */}
                    <ellipse cx="36" cy="38" rx="10" ry="7" fill="#64748b" opacity="0.22" />
                    <ellipse cx="60" cy="56" rx="12" ry="9" fill="#475569" opacity="0.20" />
                    <circle cx="68" cy="36" r="6" fill="#64748b" opacity="0.18" />
                    <circle cx="34" cy="62" r="5" fill="#64748b" opacity="0.18" />
                    <ellipse cx="48" cy="46" rx="6" ry="4" fill="#475569" opacity="0.15" />
                  </svg>
                </motion.div>
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                  Moon Rising
                </span>
                <span className="font-mono text-indigo-200">{moonInfo.name}</span>
              </div>
            </motion.div>
          )}

          {stage === "midlunar" && (
            <motion.div
              key="midlunar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-indigo-950/70 via-[#060914] to-transparent border border-indigo-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-indigo-200 font-mono relative z-10">
                <span className="font-semibold">Midnight Sky</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-100 border border-indigo-500/35 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-300" /> Peak Night
                </span>
              </div>

              {/* Radiant Silver-Pearl Moon at Zenith - Vector Shading */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.28, 1],
                    opacity: [0.45, 0.75, 0.45],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-300/45 via-sky-200/35 to-white/35 blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: [0.97, 1.05, 0.97],
                    opacity: [0.98, 1, 0.98],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full shadow-[0_0_34px_rgba(224,231,255,0.95)] flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <defs>
                      <radialGradient id="lunarZenithSphere" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#f8fafc" />
                        <stop offset="80%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#lunarZenithSphere)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                    {/* Organic Lunar Maria (Craters) */}
                    <ellipse cx="36" cy="38" rx="10" ry="7" fill="#64748b" opacity="0.22" />
                    <ellipse cx="60" cy="56" rx="12" ry="9" fill="#475569" opacity="0.20" />
                    <circle cx="68" cy="36" r="6" fill="#64748b" opacity="0.18" />
                    <circle cx="34" cy="62" r="5" fill="#64748b" opacity="0.18" />
                    <ellipse cx="48" cy="46" rx="6" ry="4" fill="#475569" opacity="0.15" />
                    <circle cx="54" cy="28" r="3" fill="#64748b" opacity="0.12" />
                  </svg>
                </motion.div>
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-300 shrink-0" />
                  Overhead Moon
                </span>
                <span className="font-mono text-indigo-200">{moonInfo.illumination}% Visible</span>
              </div>
            </motion.div>
          )}

          {stage === "lunarset" && (
            <motion.div
              key="lunarset"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-t from-purple-950/35 via-[#060914] to-transparent border border-purple-500/25 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Top Phase Header */}
              <div className="flex items-center justify-between text-[10px] text-purple-200 font-mono relative z-10">
                <span className="font-semibold">Pre-Dawn Horizon</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-100 border border-purple-500/35">
                  Moonset
                </span>
              </div>

              {/* Fading Soft Moon Orb Setting into Twilight */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.25, 0.5, 0.25],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400/30 to-indigo-300/25 blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [0.95, 1.03, 0.95],
                    opacity: [0.85, 0.95, 0.85],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-12 h-12 rounded-full shadow-[0_0_24px_rgba(199,210,254,0.6)] flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <defs>
                      <radialGradient id="lunarSetSphere" cx="42%" cy="42%" r="58%">
                        <stop offset="0%" stopColor="#f1f5f9" />
                        <stop offset="60%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#lunarSetSphere)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                    {/* Organic Lunar Maria (Craters) */}
                    <ellipse cx="36" cy="38" rx="10" ry="7" fill="#475569" opacity="0.25" />
                    <ellipse cx="60" cy="56" rx="12" ry="9" fill="#334155" opacity="0.22" />
                    <circle cx="68" cy="36" r="6" fill="#475569" opacity="0.20" />
                  </svg>
                </motion.div>
              </div>

              {/* Bottom State Title */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-purple-100">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                  Moon Setting
                </span>
                <span className="font-mono text-purple-200">Dawn Approaching</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Timestamps */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs gap-2">
        <div className="flex items-center gap-1.5 xs:gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shadow-sm shrink-0">
            {isDay ? <Sunrise className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] xs:text-[10px] text-gray-400 font-medium truncate">{isDay ? "Sunrise" : "Moonrise"}</p>
            <p className="font-bold text-white text-xs tabular-nums truncate">{isDay ? sunriseStr : moonriseTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 xs:gap-2 text-right min-w-0">
          <div className="min-w-0">
            <p className="text-[9px] xs:text-[10px] text-gray-400 font-medium truncate">{isDay ? "Sunset" : "Moonset"}</p>
            <p className="font-bold text-white text-xs tabular-nums truncate">{isDay ? sunsetStr : moonsetTime}</p>
          </div>
          <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 shadow-sm shrink-0">
            {isDay ? <Sunset className="w-3.5 h-3.5" /> : <Sunrise className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const TelemetryBentoGrid = ({ weather, forecast, unit }) => {
  if (!weather) return null;

  const { wind = {}, main = {}, clouds = {}, visibility, dt, sys = {} } = weather;
  const uv = estimateUVIndex(clouds.all || 0, dt, sys.sunrise, sys.sunset);
  const pressureData = getPressureTelemetry(main.pressure, forecast);
  const windDir = getWindDirection(wind.deg || 0);
  const beaufort = getBeaufortScale(wind.speed || 0);

  // Live Gusts: Use live station gust, or 3-hr forecast gust, or aerodynamic peak factor
  const gustSpeed = wind.gust || forecast?.[0]?.wind?.gust || (wind.speed ? +(wind.speed * 1.35).toFixed(1) : 0);

  // Wind speed percentage for level bar (0 to 60 km/h scale)
  const speedKmh = (wind.speed || 0) * 3.6;
  const windLevelPct = Math.min(100, Math.max(5, (speedKmh / 50) * 100));

  const dewPoint = main.temp && main.humidity
    ? Math.round(main.temp - (100 - main.humidity) / 5)
    : 0;

  const visInfo = getVisibilityInfo(visibility, unit);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      
      {/* 1. Fully Automatic 6-Stage Celestial Cycle */}
      <CelestialCycleCard weather={weather} />

      {/* 2. Modernized Wind & Gusts Card */}
      <GlassCard className="flex flex-col justify-between" enableTilt={true}>
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
            <Wind className="w-4 h-4 text-sky-400" />
            Wind & Gusts
          </span>
          <span className="px-2 py-0.5 rounded-full glass-pill font-mono text-[11px] text-sky-300 font-semibold shadow-sm">
            {windDir} • {wind.deg || 0}°
          </span>
        </div>

        {/* Center: Compass + Speed Metrics (Aligned Edge-to-Edge) */}
        <div className="flex items-center justify-between my-2 px-1 sm:px-2">
          {/* Circular Compass Dial with all 4 Cardinal Directions (N, E, S, W) - Left Aligned */}
          <div className="relative w-22 h-22 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_4px_24px_rgba(0,0,0,0.5)] shrink-0">
            {/* North */}
            <span className="absolute top-1 text-[9px] font-bold text-rose-400 tracking-wider">N</span>
            {/* East */}
            <span className="absolute right-1.5 text-[9px] font-bold text-gray-300">E</span>
            {/* South */}
            <span className="absolute bottom-1 text-[9px] font-bold text-gray-300">S</span>
            {/* West */}
            <span className="absolute left-1.5 text-[9px] font-bold text-gray-300">W</span>

            {/* Subtle Crosshairs */}
            <div className="absolute w-14 h-px bg-white/10" />
            <div className="absolute h-14 w-px bg-white/10" />

            {/* Animated Compass Needle */}
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${wind.deg || 0}deg)` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
                <div className="w-1 h-10 bg-gradient-to-b from-rose-500 via-sky-400 to-white/40 rounded-full shadow-md" />
              </div>
            </div>

            {/* Center Pivot Point */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-white ring-2 ring-gray-950 shadow-md" />
          </div>

          {/* Real-time Wind Speed & Gusts - Right Aligned under direction badge */}
          <div className="space-y-0.5 text-right">
            <p className="text-3xl sm:text-[32px] font-black text-white font-display tabular-nums tracking-tight leading-none">
              {formatSpeed(wind.speed || 0, unit)}
            </p>
            <p className="text-xs text-gray-300 font-medium pt-1">
              Gusts up to <strong className="text-sky-300 font-bold">{formatSpeed(gustSpeed, unit)}</strong>
            </p>
          </div>
        </div>

        {/* Modern Wind Intensity Scale */}
        <div className="my-1 space-y-1">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 to-rose-500 rounded-full shadow-[0_0_8px_#34d399]"
              style={{ width: `${windLevelPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-mono">
            <span>Calm</span>
            <span>Breezy</span>
            <span>Strong</span>
            <span>Gale</span>
          </div>
        </div>

        {/* Humanized Wind Status & Directional Feel */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-medium">
          <span className="text-white font-semibold flex items-center gap-1">
            <span className="text-sky-400">{windDir}</span>
            <span className="text-gray-300">•</span>
            <span>{beaufort.label}</span>
          </span>
          <span className="text-[10px] text-gray-400 truncate max-w-[55%] text-right">{beaufort.desc}</span>
        </div>
      </GlassCard>

      {/* 3. Air Pressure */}
      <GlassCard className="flex flex-col justify-between" enableTilt={true}>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
            <Gauge className="w-4 h-4 text-sky-400" />
            Air Pressure
          </span>
          <span className={`px-2 py-0.5 rounded-full glass-pill text-[10px] font-bold border shadow-sm ${pressureData.color}`}>
            {pressureData.status}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-display tabular-nums">
              {pressureData.pressure}
            </span>
            <span className="text-xs font-semibold text-gray-400">hPa</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-medium">{pressureData.desc}</p>
        </div>

        <div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400 rounded-full shadow-[0_0_8px_#38bdf8]"
              style={{
                width: `${Math.min(100, Math.max(0, ((pressureData.pressure - 960) / 80) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
            <span>Low Pressure</span>
            <span>Normal</span>
            <span>High Pressure</span>
          </div>
        </div>

        {/* Dynamic Today's Range & Pressure Trend */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300 font-medium">
          {pressureData.range ? (
            <span className="text-[10px] text-gray-300 font-mono font-medium">
              <span className="text-gray-400">Range: </span>
              <strong className="text-white font-semibold">{pressureData.range.formatted}</strong>
            </span>
          ) : (
            <span className="text-gray-400 text-[10px]">Baseline: 1013 hPa</span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-sky-300 font-mono font-semibold shadow-sm">
            {pressureData.trend}
          </span>
        </div>
      </GlassCard>

      {/* 4. UV Index */}
      <GlassCard className="flex flex-col justify-between" enableTilt={true}>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            UV Index
          </span>
          <span className={`font-bold text-xs ${uv.color}`}>{uv.text}</span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-display tabular-nums">
              {uv.value}
            </span>
            <span className="text-xs font-semibold text-gray-400">/ 11+</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-medium">
            {uv.value > 5 ? "Sun protection recommended" : "Low solar radiation danger"}
          </p>
        </div>

        <div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 to-rose-500 rounded-full shadow-[0_0_8px_#f59e0b]"
              style={{ width: `${Math.min(100, (uv.value / 11) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Extreme</span>
          </div>
        </div>
      </GlassCard>

      {/* 5. Visibility */}
      <GlassCard className="flex flex-col justify-between" enableTilt={true}>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            Visibility
          </span>
          <span className="px-2 py-0.5 rounded-full glass-pill text-cyan-300 text-[10px] font-bold border border-cyan-500/30 shadow-sm">
            {visInfo.status}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-display tabular-nums">
              {visInfo.distance}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-medium">{visInfo.desc}</p>
        </div>

        <div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
              style={{ width: `${visInfo.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
            <span>Dense Fog</span>
            <span>Hazy</span>
            <span>Clear</span>
          </div>
        </div>
      </GlassCard>

      {/* 6. Dew Point / Moisture Levels */}
      <GlassCard className="flex flex-col justify-between" enableTilt={true}>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-300">
            <Waves className="w-4 h-4 text-sky-400" />
            Moisture Levels
          </span>
          <span className="px-2 py-0.5 rounded-full glass-pill text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            {main.humidity < 60 ? "Comfortable" : "Humid"}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-display tabular-nums">
              {dewPoint}°{unit}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-medium">
            Relative humidity <strong className="text-sky-300 font-bold">{main.humidity}%</strong>
          </p>
        </div>

        <div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-500 rounded-full shadow-[0_0_8px_#10b981]"
              style={{ width: `${main.humidity || 50}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
            <span>Dry</span>
            <span>Comfortable</span>
            <span>Humid</span>
          </div>
        </div>
      </GlassCard>


    </div>
  );
};


export default TelemetryBentoGrid;
