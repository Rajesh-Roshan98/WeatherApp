import React from "react";

const WeatherDetails = ({ weather, fade, getWindDirection, cityName }) => {
  return (
    <div
      className={`bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-opacity duration-700 mb-6 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* City Name Heading */}
      <h3 className="text-2xl font-semibold text-center text-white mb-4">
        Today's Weather Details
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "🌅 Sunrise",
            value: new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          {
            label: "🌇 Sunset",
            value: new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          {
            label: "🧭 Wind",
            value: `${getWindDirection(weather.wind.deg)} (${weather.wind.deg}°)`,
          },
          {
            label: "📊 Pressure",
            value: `${weather.main.pressure} hPa`,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-900/60 rounded-xl p-4 transition duration-700"
            style={{ transitionDelay: `${idx * 100 + 300}ms` }}
          >
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
