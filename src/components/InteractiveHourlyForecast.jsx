import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Clock, TrendingUp, Sparkles } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { convertTemp } from "../utils/weatherUtils";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-[#0d1424]/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.6)] text-xs space-y-1.5 min-w-[130px]">
        <p className="text-sky-300 flex items-center gap-1 font-mono text-[11px] font-semibold">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          {label}
        </p>
        <p className="text-white text-lg font-black tabular-nums font-display">
          {data.temp}°{unit}
        </p>
        <p className="text-gray-300 capitalize font-medium">{data.description}</p>
        <div className="text-[10px] text-gray-300 pt-1.5 border-t border-white/10 flex justify-between gap-3 font-mono">
          <span className="text-cyan-300">💧 {data.humidity}%</span>
          <span className="text-sky-300">💨 {data.wind} m/s</span>
        </div>
      </div>
    );
  }
  return null;
};

const InteractiveHourlyForecast = ({ forecast, unit }) => {
  const [activeTab, setActiveTab] = useState("chart");

  if (!forecast || forecast.length === 0) return null;

  const hourlyData = forecast.slice(0, 8).map((item) => {
    const [hour, minute] = item.dt_txt.split(" ")[1].split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const timeLabel = `${h}:${minute} ${ampm}`;

    return {
      time: timeLabel,
      temp: convertTemp(item.main.temp, unit),
      feels_like: convertTemp(item.main.feels_like, unit),
      humidity: item.main.humidity,
      wind: item.wind.speed,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      pop: Math.round((item.pop || 0) * 100),
    };
  });

  return (
    <GlassCard className="w-full flex flex-col justify-between relative overflow-hidden" enableTilt={false}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 relative z-10 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-2xl bg-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display flex items-center gap-1.5 truncate">
              <span>24-Hour Forecast</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </h2>
            <p className="text-xs text-gray-400 font-medium truncate">Hourly atmospheric trend</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white/[0.05] border border-white/15 rounded-full text-xs shadow-inner shrink-0 ml-auto sm:ml-0 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("chart")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              activeTab === "chart"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hourly")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              activeTab === "hourly"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* Chart View */}
      {activeTab === "chart" ? (
        <div className="w-full h-56 mt-2 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="richTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 2", "dataMax + 2"]}
                unit={`°`}
              />

              <Tooltip content={<CustomTooltip unit={unit} />} />

              <Area
                type="natural"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#richTempGradient)"
                activeDot={{ r: 6, fill: "#38bdf8", stroke: "#040711", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Rich Responsive Step Deck with Fluid Full-Width & Balanced Vertical Distribution */
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto py-1 no-scrollbar scroll-smooth snap-x touch-pan-x relative z-10 w-full flex-1 items-stretch min-h-[190px]">
          {hourlyData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-between flex-1 min-w-[72px] sm:min-w-[80px] md:min-w-0 py-3.5 px-2 sm:px-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-sky-500/40 transition-all text-center shrink-0 md:shrink shadow-sm"
            >
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 truncate w-full">{item.time}</span>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt={item.description}
                className="w-10 h-10 sm:w-11 sm:h-11 my-1.5 filter drop-shadow shrink-0"
              />
              <span className="text-sm sm:text-base font-bold text-white tabular-nums font-display">
                {item.temp}°
              </span>
              {item.pop > 0 ? (
                <span className="text-[9px] sm:text-[10px] text-cyan-300 mt-0.5 font-bold">
                  💧{item.pop}%
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] text-transparent mt-0.5 select-none font-bold">
                  ·
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default InteractiveHourlyForecast;
