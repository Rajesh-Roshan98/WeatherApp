import React from "react";
import { motion } from "framer-motion";

const AnimatedWeatherIcon = ({ condition = "clearDay", className = "w-28 h-28" }) => {
  switch (condition) {
    case "clearDay":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          {/* Rotating Sun Beams */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-amber-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </motion.svg>
          {/* Pulsing Sun Sphere */}
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.9)]"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );

    case "clearNight":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          {/* Crescent Moon */}
          <motion.svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-indigo-200 drop-shadow-[0_0_25px_rgba(199,210,254,0.7)]"
            animate={{ rotate: [-4, 4, -4], y: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M50 15 A35 35 0 1 0 85 65 A30 30 0 1 1 50 15 Z"
              fill="url(#moonGradClean)"
            />
            <defs>
              <linearGradient id="moonGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </motion.svg>
          {/* Twinkling star */}
          <motion.div
            className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]"
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
      );

    case "sunriseSunset":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-t from-rose-500 via-orange-400 to-amber-300 shadow-[0_0_40px_rgba(249,115,22,0.9)]"
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg className="absolute bottom-2 w-full h-3 text-orange-400/90" viewBox="0 0 100 10">
            <line x1="8" y1="5" x2="92" y2="5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "rain":
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          {/* Floating Cloud */}
          <motion.div
            className="relative z-10"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 60" className="w-24 h-16 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
              <path
                d="M25 45 a15 15 0 0 1 0 -30 a20 20 0 0 1 35 -5 a18 18 0 0 1 25 15 a15 15 0 0 1 -10 20 z"
                fill="#cbd5e1"
              />
            </svg>
          </motion.div>

          {/* Continuous Rain Drops Array */}
          <div className="flex gap-3 -mt-2 z-20">
            {[
              { delay: 0, x: -6 },
              { delay: 0.25, x: 0 },
              { delay: 0.5, x: 6 },
            ].map((drop, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]"
                animate={{
                  y: [0, 16],
                  opacity: [0, 1, 0],
                  scaleY: [0.8, 1.2, 0.6],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  ease: "easeIn",
                  delay: drop.delay,
                }}
              />
            ))}
          </div>
        </div>
      );

    case "thunderstorm":
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <motion.div
            animate={{ x: [-3, 3, -3], y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 60" className="w-24 h-16 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <path
                d="M25 45 a15 15 0 0 1 0 -30 a20 20 0 0 1 35 -5 a18 18 0 0 1 25 15 a15 15 0 0 1 -10 20 z"
                fill="#475569"
              />
            </svg>
          </motion.div>
          {/* Flashing Lightning Bolt */}
          <motion.svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-amber-300 -mt-4 z-20 filter drop-shadow-[0_0_12px_#fde047]"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.1, 0.15, 0.3, 1] }}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
          </motion.svg>
        </div>
      );

    case "snow":
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 60" className="w-24 h-16 filter drop-shadow-md">
              <path
                d="M25 45 a15 15 0 0 1 0 -30 a20 20 0 0 1 35 -5 a18 18 0 0 1 25 15 a15 15 0 0 1 -10 20 z"
                fill="#94a3b8"
              />
            </svg>
          </motion.div>
          <div className="flex gap-3 mt-0.5">
            {[0, 0.35, 0.7].map((delay, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]"
                animate={{
                  y: [0, 14],
                  x: [-3, 3, -3],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay }}
              />
            ))}
          </div>
        </div>
      );

    case "cloudy":
    default:
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <motion.div
            animate={{
              y: [-5, 5, -5],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 60" className="w-28 h-20 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
              <path
                d="M25 45 a15 15 0 0 1 0 -30 a20 20 0 0 1 35 -5 a18 18 0 0 1 25 15 a15 15 0 0 1 -10 20 z"
                fill="#cbd5e1"
              />
            </svg>
          </motion.div>
        </div>
      );
  }
};

export default AnimatedWeatherIcon;
