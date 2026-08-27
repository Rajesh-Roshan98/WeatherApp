export const formatCityName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const convertTemp = (tempC, unit = "C") => {
  if (tempC === null || tempC === undefined) return 0;
  if (unit === "F") {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
};

export const formatSpeed = (speedMs, unit = "C") => {
  if (unit === "F") {
    // mph
    return `${(speedMs * 2.23694).toFixed(1)} mph`;
  }
  // km/h
  return `${(speedMs * 3.6).toFixed(1)} km/h`;
};

export const getWindDirection = (deg) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

export const getWeatherConditionType = (weatherData) => {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
    return "clearDay";
  }

  const id = weatherData.weather[0].id;
  const sys = weatherData.sys || {};
  const dt = weatherData.dt || Math.floor(Date.now() / 1000);
  const sunrise = sys.sunrise || 0;
  const sunset = sys.sunset || 0;

  // Check twilight (within 35 mins of sunrise or sunset)
  const isTwilight =
    (sunrise > 0 && Math.abs(dt - sunrise) < 2100) ||
    (sunset > 0 && Math.abs(dt - sunset) < 2100);

  const isDay = sunrise && sunset ? dt >= sunrise && dt < sunset : true;

  // Thunderstorm: 2xx
  if (id >= 200 && id < 300) return "thunderstorm";

  // Drizzle / Rain: 3xx, 5xx
  if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return "rain";

  // Snow: 6xx
  if (id >= 600 && id < 700) return "snow";

  // Atmosphere (Fog, Mist, Dust, Smoke): 7xx
  if (id >= 700 && id < 800) return "fog";

  // Clouds: 801 - 804
  if (id > 800) {
    if (id === 801 || id === 802) {
      return isTwilight ? "sunriseSunset" : isDay ? "clearDay" : "clearNight";
    }
    return "cloudy";
  }

  // Clear: 800
  if (isTwilight) return "sunriseSunset";
  return isDay ? "clearDay" : "clearNight";
};

export const calculateSolarProgress = (sunrise, sunset, currentDt) => {
  if (!sunrise || !sunset) return 0.5;
  const now = currentDt || Math.floor(Date.now() / 1000);
  if (now <= sunrise) return 0;
  if (now >= sunset) return 1;
  return (now - sunrise) / (sunset - sunrise);
};

export const estimateUVIndex = (cloudsPercent = 0, dt = 0, sunrise = 0, sunset = 0) => {
  const now = dt || Math.floor(Date.now() / 1000);
  if (!sunrise || !sunset || now < sunrise || now > sunset) return { value: 0, text: "Low", color: "text-emerald-400" };

  const midday = (sunrise + sunset) / 2;
  const diffFromMidday = Math.abs(now - midday);
  const maxDiff = (sunset - sunrise) / 2;
  const sunElevationFactor = Math.max(0, 1 - diffFromMidday / maxDiff);

  // Peak UV ~ 9-10 adjusted for cloud attenuation
  const cloudAttenuation = 1 - (cloudsPercent / 100) * 0.65;
  const uv = Math.round(sunElevationFactor * 10 * cloudAttenuation * 10) / 10;

  if (uv <= 2) return { value: uv, text: "Low", color: "text-emerald-400" };
  if (uv <= 5) return { value: uv, text: "Moderate", color: "text-amber-400" };
  if (uv <= 7) return { value: uv, text: "High", color: "text-orange-400" };
  if (uv <= 10) return { value: uv, text: "Very High", color: "text-rose-500" };
  return { value: uv, text: "Extreme", color: "text-purple-400" };
};

export const PRESSURE_THRESHOLDS = [
  { max: 980, status: "Severe", desc: "Severe storm conditions", color: "text-purple-300 border-purple-500/30" },
  { max: 995, status: "Stormy", desc: "Stormy conditions", color: "text-rose-300 border-rose-500/30" },
  { max: 1005, status: "Low", desc: "Unsettled conditions", color: "text-sky-300 border-sky-500/30" },
  { max: 1015, status: "Normal", desc: "Stable conditions", color: "text-emerald-300 border-emerald-500/30" },
  { max: 1025, status: "High", desc: "Fair weather", color: "text-sky-300 border-sky-500/30" },
  { max: Infinity, status: "Very High", desc: "High pressure system", color: "text-indigo-300 border-indigo-500/30" },
];

export const getPressureStatus = (pressureHpa) => {
  if (typeof pressureHpa !== "number" || isNaN(pressureHpa)) {
    return { status: "Normal", desc: "Stable conditions", color: "text-emerald-300 border-emerald-500/30" };
  }
  const match = PRESSURE_THRESHOLDS.find((threshold) => pressureHpa <= threshold.max);
  return match || { status: "Normal", desc: "Stable conditions", color: "text-emerald-300 border-emerald-500/30" };
};

export const calculatePressureTrend = (currentPressure, forecastList = []) => {
  if (
    typeof currentPressure !== "number" ||
    isNaN(currentPressure) ||
    !Array.isArray(forecastList) ||
    forecastList.length === 0
  ) {
    return "→ Stable";
  }

  // Look at next 3-6 hour interval in forecast
  const nextItem = forecastList.find(
    (item) => item?.main?.pressure && typeof item.main.pressure === "number"
  );

  if (!nextItem || !nextItem.main?.pressure) {
    return "→ Stable";
  }

  const delta = nextItem.main.pressure - currentPressure;

  if (delta >= 3) return "↑ Rising Rapidly";
  if (delta >= 0.8) return "↑ Rising Slowly";
  if (delta <= -3) return "↓ Falling Rapidly";
  if (delta <= -0.8) return "↓ Falling Slowly";
  return "→ Stable";
};

export const calculatePressureRange = (currentPressure, forecastList = []) => {
  const pressureValues = [];
  if (typeof currentPressure === "number" && !isNaN(currentPressure)) {
    pressureValues.push(currentPressure);
  }

  if (Array.isArray(forecastList) && forecastList.length > 0) {
    // 24-hour horizon (first 8 3-hr steps)
    forecastList.slice(0, 8).forEach((item) => {
      const p = item?.main?.pressure;
      if (typeof p === "number" && !isNaN(p)) {
        pressureValues.push(p);
      }
    });
  }

  if (pressureValues.length === 0) return null;

  const minP = Math.min(...pressureValues);
  const maxP = Math.max(...pressureValues);

  return {
    min: minP,
    max: maxP,
    formatted: `Low ${minP} • High ${maxP} hPa`,
  };
};

export const getPressureTelemetry = (currentPressure, forecastList = []) => {
  const pressure = typeof currentPressure === "number" && !isNaN(currentPressure) ? currentPressure : 1013;
  const statusInfo = getPressureStatus(pressure);
  const trend = calculatePressureTrend(pressure, forecastList);
  const range = calculatePressureRange(pressure, forecastList);

  return {
    pressure,
    status: statusInfo.status,
    desc: statusInfo.desc,
    color: statusInfo.color,
    trend,
    range,
  };
};

export const getVisibilityInfo = (meters, unit = "C") => {
  // Raw live meters from OpenWeather API (e.g. 10000, 4500, 2000)
  const rawMeters = meters !== undefined && meters !== null ? meters : 10000;
  
  if (unit === "F") {
    // 1 meter = 0.000621371 miles (Pure 1:1 math)
    const miles = +(rawMeters * 0.000621371).toFixed(1);
    let status = "Optimal";
    let desc = "Clear line of sight to the horizon";

    if (rawMeters >= 10000) {
      status = "Optimal";
      desc = "Maximum clear-sky station visibility";
    } else if (rawMeters >= 6000) {
      status = "Good";
      desc = "Clear view, slight distant haze";
    } else if (rawMeters >= 2000) {
      status = "Moderate";
      desc = "Noticeable haze or moisture";
    } else {
      status = "Poor";
      desc = "Dense fog or heavy mist";
    }

    return {
      distance: `${miles} mi`,
      status,
      desc,
      percentage: Math.min(100, (rawMeters / 10000) * 100),
    };
  }

  // Metric: 1000 meters = 1 km (Pure 1:1 math)
  const km = +(rawMeters / 1000).toFixed(1);
  let status = "Optimal";
  let desc = "Clear line of sight to the horizon";

  if (rawMeters >= 10000) {
    status = "Optimal";
    desc = "Maximum clear-sky station visibility";
  } else if (rawMeters >= 6000) {
    status = "Good";
    desc = "Clear view, slight distant haze";
  } else if (rawMeters >= 2000) {
    status = "Moderate";
    desc = "Noticeable haze or moisture";
  } else {
    status = "Poor";
    desc = "Dense fog or heavy mist";
  }

  return {
    distance: `${km} km`,
    status,
    desc,
    percentage: Math.min(100, (rawMeters / 10000) * 100),
  };
};




export const getMoonPhase = (dateInput) => {
  const date = dateInput ? new Date(typeof dateInput === 'number' ? dateInput * 1000 : dateInput) : new Date();
  
  // Known reference new moon: January 11, 2024 at 11:57 UTC
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000; // ms in a lunar cycle
  
  const diff = date.getTime() - knownNewMoon;
  const phaseCycle = (diff % synodicMonth) / synodicMonth;
  const normalizedPhase = phaseCycle < 0 ? phaseCycle + 1 : phaseCycle;
  
  // Illumination calculation (0% to 100%)
  const illumination = Math.round((0.5 * (1 - Math.cos(normalizedPhase * 2 * Math.PI))) * 100);

  let phaseName = "New Moon";
  let phaseIcon = "🌑";

  if (normalizedPhase < 0.03 || normalizedPhase >= 0.97) {
    phaseName = "New Moon";
    phaseIcon = "🌑";
  } else if (normalizedPhase < 0.22) {
    phaseName = "Waxing Crescent";
    phaseIcon = "🌒";
  } else if (normalizedPhase < 0.28) {
    phaseName = "First Quarter";
    phaseIcon = "🌓";
  } else if (normalizedPhase < 0.47) {
    phaseName = "Waxing Gibbous";
    phaseIcon = "🌔";
  } else if (normalizedPhase < 0.53) {
    phaseName = "Full Moon";
    phaseIcon = "🌕";
  } else if (normalizedPhase < 0.72) {
    phaseName = "Waning Gibbous";
    phaseIcon = "🌖";
  } else if (normalizedPhase < 0.78) {
    phaseName = "Last Quarter";
    phaseIcon = "🌗";
  } else {
    phaseName = "Waning Crescent";
    phaseIcon = "🌘";
  }

  return {
    phase: normalizedPhase,
    name: phaseName,
    icon: phaseIcon,
    illumination,
  };
};

export const getBeaufortScale = (speedMs) => {
  if (!speedMs || speedMs < 0.5) return { label: "Calm Conditions", desc: "Still & peaceful air" };
  if (speedMs < 3.3) return { label: "Light Wind", desc: "Gentle airflow on skin" };
  if (speedMs < 5.5) return { label: "Mild Wind", desc: "Leaves & twigs in motion" };
  if (speedMs < 8.0) return { label: "Moderate Wind", desc: "Small branches swaying" };
  if (speedMs < 10.8) return { label: "Steady Wind", desc: "Noticeable continuous airflow" };
  if (speedMs < 13.9) return { label: "Strong Wind", desc: "Large branches in motion" };
  if (speedMs < 17.2) return { label: "High Wind", desc: "Strong resistance walking" };
  return { label: "Gale Force Wind", desc: "Severe wind conditions" };
};



