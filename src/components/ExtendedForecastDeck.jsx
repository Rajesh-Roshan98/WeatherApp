import React from "react";
import { Calendar, ArrowDown, ArrowUp, Droplets, Wind, Sparkles } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { convertTemp, formatSpeed } from "../utils/weatherUtils";

const ExtendedForecastDeck = ({ forecast, cityName, unit }) => {
  if (!forecast || !forecast.length) return null;

  const todayStr = new Date().toLocaleDateString();

  const dailyGroups = forecast.reduce((acc, f) => {
    const day = new Date(f.dt * 1000).toLocaleDateString();
    if (day === todayStr) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push(f);
    return acc;
  }, {});

  const days = Object.values(dailyGroups)
    .slice(0, 5)
    .map((daySlots) => {
      const temps = daySlots.map((s) => s.main.temp);
      const minC = Math.min(...temps);
      const maxC = Math.max(...temps);
      const avgHumidity = Math.round(
        daySlots.reduce((sum, s) => sum + s.main.humidity, 0) / daySlots.length
      );
      const avgWind =
        daySlots.reduce((sum, s) => sum + s.wind.speed, 0) / daySlots.length;
      const mid = Math.floor(daySlots.length / 2);
      const mainWeather = daySlots[mid].weather[0];
      const maxPop = Math.round(
        Math.max(...daySlots.map((s) => s.pop || 0)) * 100
      );

      return {
        date: new Date(daySlots[0].dt * 1000),
        min: convertTemp(minC, unit),
        max: convertTemp(maxC, unit),
        humidity: avgHumidity,
        wind: avgWind,
        weather: mainWeather,
        pop: maxPop,
      };
    });

  const globalMin = Math.min(...days.map((d) => d.min));
  const globalMax = Math.max(...days.map((d) => d.max));
  const totalRange = Math.max(1, globalMax - globalMin);

  return (
    <GlassCard className="w-full relative overflow-hidden" enableTilt={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display flex items-center gap-1.5">
              5-Day Outlook
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </h2>
            <p className="text-xs text-gray-400 font-medium">Extended forecast for {cityName}</p>
          </div>
        </div>
      </div>

      {/* Daily Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 relative z-10">
        {days.map((day, idx) => {
          const leftPercent = Math.max(0, ((day.min - globalMin) / totalRange) * 100);
          const widthPercent = Math.max(16, ((day.max - day.min) / totalRange) * 100);

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.3)] group"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                    {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                {day.pop > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
                    💧{day.pop}%
                  </span>
                )}
              </div>

              {/* Weather Icon & Description */}
              <div className="flex items-center gap-2.5 my-3">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                  alt={day.weather.description}
                  className="w-10 h-10 sm:w-11 sm:h-11 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
                <p className="text-xs text-gray-200 capitalize font-medium leading-tight">
                  {day.weather.description}
                </p>
              </div>

              {/* Dynamic Temperature Spectrum Range Bar */}
              <div className="my-2 space-y-1.5">
                <div className="flex justify-between text-xs font-bold tabular-nums">
                  <span className="text-sky-400 flex items-center gap-0.5">
                    <ArrowDown className="w-3 h-3" />
                    {day.min}°
                  </span>
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" />
                    {day.max}°
                  </span>
                </div>

                {/* Relative Range Pill with Glowing Gradient */}
                <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>

              {/* Humidity & Wind */}
              <div className="flex items-center justify-between text-[11px] text-gray-300 pt-2.5 border-t border-white/10 mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  {day.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  {formatSpeed(day.wind, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default ExtendedForecastDeck;
