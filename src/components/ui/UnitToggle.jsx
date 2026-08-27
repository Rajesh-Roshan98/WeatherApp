import React from "react";
import { motion } from "framer-motion";

const UnitToggle = ({ unit, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Temperature Unit"
      className="relative flex items-center bg-white/10 border border-white/15 rounded-full p-1 min-h-[38px] cursor-pointer transition-colors duration-200 hover:bg-white/15 backdrop-blur-md select-none touch-manipulation"
    >
      <motion.div
        className="absolute top-1 bottom-1 w-7 sm:w-8 bg-sky-500 rounded-full shadow-md shadow-sky-500/30"
        animate={{
          left: unit === "C" ? "4px" : "calc(100% - 32px)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
      />
      <span
        className={`relative z-10 w-7 sm:w-8 text-center text-xs font-semibold tracking-wider transition-colors duration-200 ${
          unit === "C" ? "text-white" : "text-gray-400"
        }`}
      >
        °C
      </span>
      <span
        className={`relative z-10 w-7 sm:w-8 text-center text-xs font-semibold tracking-wider transition-colors duration-200 ${
          unit === "F" ? "text-white" : "text-gray-400"
        }`}
      >
        °F
      </span>
    </button>
  );
};

export default UnitToggle;
