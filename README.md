# ClimaCast — Real-Time Weather Intelligence

ClimaCast is a modern weather web application built with React and Vite. It provides current weather conditions, interactive 24-hour forecasts, a 5-day outlook, location search, atmospheric telemetry, and animated solar and lunar cycle visualizations through a responsive glassmorphic interface.

---

## ✨ Features

- **Dynamic Atmospheric Canvas**: Live weather-reactive particle and gradient engine (rain, snow, thunder, clear skies, mist, and dynamic day/night cycles).
- **Hero Atmospheric Telemetry**: Real-time temperature, condition badge, feels-like metrics, humidity, wind, and cloud cover.
- **Interactive 24-Hour Forecast**:
  - Interactive Recharts area trend line showing temperature curves and precipitation probabilities.
  - Granular hourly timeline cards with active glass tab switching.
- **6-Tile Telemetry Bento Grid**:
  - **Solar & Lunar Cycle**: Animated Sun and Moon visualization for sunrise, sunset, lunar phases, and illumination.
  - **Wind & Gust Dynamics**: Live Beaufort scale classification, cardinal airflow direction, and gust velocity.
  - **Air Pressure & Trends**: Real-time atmospheric barometric pressure (hPa), 24-hour range metrics, and rate-of-change indicators.
  - **Solar UV Index**: Sun elevation and cloud-attenuated UV telemetry with skin-safety guidance.
  - **Visibility Telemetry**: Optical distance measurement with descriptive horizon atmospheric clarity indicators.
  - **Dew Point & Thermal Comfort**: Moisture condensation analysis and thermal perception rating.
- **5-Day Extended Forecast Deck**: Comprehensive daily outlook cards with high/low temperature progression and weather condition artwork.
- **Global Search & Direct Geocoding**:
  - Debounced search input with OpenWeather Geocoding API suggestions.
  - Keyboard navigation (Arrow keys, Enter, Escape).
  - Recent search caching with local storage persistence.
  - One-click GPS location detection.
- **Unit Conversion**: Instant toggle between Metric (°C, m/s, km) and Imperial (°F, mph, mi).
- **Glassmorphism & 3D Tilt**: Hardware-accelerated dynamic mouse-tilt interactions and frosted backdrop blur.

---

## 🛠️ Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Motion & Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Timezone Resolution**: tz-lookup
- **External API**: OpenWeather API

---

## 📁 Project Structure

```text
ClimaCast/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── environment/
│   │   │   └── WeatherEnvironment.jsx      # 3D canvas atmospheric simulation
│   │   ├── icons/
│   │   │   └── AnimatedWeatherIcon.jsx     # Atmospheric weather artwork
│   │   ├── search/
│   │   │   └── LocationAutocompleteDropdown.jsx # Geocoding autocomplete dropdown
│   │   ├── ui/
│   │   │   ├── GlassCard.jsx               # Frosted glass card with 3D mouse tilt
│   │   │   └── UnitToggle.jsx              # °C / °F switcher
│   │   ├── ExtendedForecastDeck.jsx        # 5-day daily forecast deck
│   │   ├── HeroWeatherDisplay.jsx          # Current temperature & key telemetry
│   │   ├── InteractiveHourlyForecast.jsx   # 24-hr Recharts graph & hourly cards
│   │   ├── SpatialHeader.jsx               # Navigation bar & search HUD
│   │   ├── TelemetryBentoGrid.jsx          # 6-card meteorological bento grid
│   │   └── Weather.jsx                     # Main weather dashboard
│   ├── hooks/
│   │   ├── useLocationAutocomplete.js      # Debounced search & history hook
│   │   ├── useMouseTilt.js                 # Mouse tilt and parallax interactions
│   │   └── useWeather.js                   # OpenWeather API data fetcher
│   ├── utils/
│   │   └── weatherUtils.js                 # Weather and astronomical calculations
│   ├── App.jsx                             # Application root shell
│   ├── index.css                           # Tailwind styling & glassmorphism tokens
│   └── main.jsx                            # React 19 application mount
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** (or yarn / pnpm)
- An **OpenWeatherMap API Key**

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd ClimaCast
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root and configure your OpenWeather API key according to the project's environment configuration.
```env
PLACE_YOUR_API_KEY_HERE
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Production Build

To build the project for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 👨‍💻 Author & Credits

- **Designed & Built by**: [Rajesh Roshan](https://github.com/Rajesh-Roshan98)
- **Data Source**: Powered by [OpenWeather](https://openweathermap.org/)
- **Copyright**: © 2026 Rajesh Roshan · All rights reserved.
