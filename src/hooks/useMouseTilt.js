import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export const useMouseTilt = (options = {}) => {
  const { maxTilt = 10, springConfig = { stiffness: 300, damping: 25 } } = options;
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    // Set CSS variables for specular border shine
    ref.current.style.setProperty("--mouse-x", `${(mouseX / width) * 100}%`);
    ref.current.style.setProperty("--mouse-y", `${(mouseY / height) * 100}%`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
};
