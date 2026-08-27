import React from "react";
import { motion } from "framer-motion";
import { useMouseTilt } from "../../hooks/useMouseTilt";

const GlassCard = ({
  children,
  className = "",
  enableTilt = true,
  glowEffect = true,
  onClick,
  style = {},
  ...props
}) => {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt({
    maxTilt: 6,
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
      onClick={onClick}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
        ...style,
      }}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`relative rounded-3xl p-6 transition-shadow duration-300 ${
        glowEffect ? "glass-panel glass-panel-glow" : "glass-panel"
      } ${className}`}
      {...props}
    >
      {/* Specular Mouse-following Lighting overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
