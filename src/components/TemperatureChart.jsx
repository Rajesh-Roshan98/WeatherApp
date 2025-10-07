import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TemperatureChart = ({ forecast, cityName }) => {
  const data = forecast.slice(0, 8).map((f) => ({
    time: f.dt_txt.split(" ")[1],
    temp: f.main.temp,
  }));

  return (
    <div
      className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-2 transition duration-700"
      style={{ transitionDelay: "200ms" }}
    >
      <h3 className="text-xl font-semibold mb-3 text-white text-center">
        Today's Temperature Chart
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="time"
            stroke="#aaa"
            tick={{ fill: "#ccc", fontSize: 12 }}
            tickFormatter={(time) => {
              const [hour, minute] = time.split(":");
              let h = parseInt(hour, 10);
              const ampm = h >= 12 ? "PM" : "AM";
              h = h % 12 || 12;
              return `${h}:${minute} ${ampm}`;
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            stroke="#aaa"
            tick={{ fill: "#ccc", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31,41,55,0.9)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "14px",
            }}
            labelStyle={{ color: "#38bdf8", fontWeight: "600" }}
            formatter={(value) => [`${Math.round(value)}°C`, "Temp"]}
            labelFormatter={(time) => {
              const [hour, minute] = time.split(":");
              let h = parseInt(hour, 10);
              const ampm = h >= 12 ? "PM" : "AM";
              h = h % 12 || 12;
              return `Time: ${h}:${minute} ${ampm}`;
            }}
          />

          <Line
            type="monotone"
            dataKey="temp"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4, fill: "#38bdf8", stroke: "#1e293b", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#38bdf8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
