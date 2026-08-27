import React, { useEffect, useRef } from "react";
import { getWeatherConditionType } from "../../utils/weatherUtils";

const WeatherEnvironment = ({ weather }) => {
  const canvasRef = useRef(null);
  const condition = getWeatherConditionType(weather);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles = [];
    const particleCount =
      condition === "rain" || condition === "thunderstorm"
        ? 120
        : condition === "snow"
        ? 80
        : condition === "clearNight"
        ? 110
        : 35;

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.15,
      speed: Math.random() * 0.015 + 0.005,
      increasing: Math.random() > 0.5,
    }));

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      if (condition === "clearNight" && Math.random() < 0.012 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.75,
          y: Math.random() * (height * 0.25),
          len: Math.random() * 70 + 35,
          speed: Math.random() * 10 + 8,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          alpha: 0.9,
        });
      }
    };

    // Rain / Snow / Atmosphere particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 8,
        radius: Math.random() * 2 + 0.8,
        speedY:
          condition === "rain" || condition === "thunderstorm"
            ? Math.random() * 12 + 14
            : condition === "snow"
            ? Math.random() * 1.2 + 0.8
            : Math.random() * 0.3 + 0.1,
        speedX:
          condition === "rain" || condition === "thunderstorm"
            ? Math.random() * 1.5 - 3
            : condition === "snow"
            ? Math.random() * 0.8 - 0.4
            : Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.4 + 0.15,
        sway: Math.random() * Math.PI * 2,
      });
    }

    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Modern Weather Atmospheric Palette
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (condition === "clearDay") {
        // Crisp Modern Cerulean
        bgGrad.addColorStop(0, "#081b33");
        bgGrad.addColorStop(0.5, "#061021");
        bgGrad.addColorStop(1, "#030712");
      } else if (condition === "sunriseSunset") {
        // Golden Twilight / Sunset
        bgGrad.addColorStop(0, "#1f1026");
        bgGrad.addColorStop(0.4, "#2d161c");
        bgGrad.addColorStop(0.8, "#100c1c");
        bgGrad.addColorStop(1, "#040308");
      } else if (condition === "clearNight") {
        // Deep Obsidian Space
        bgGrad.addColorStop(0, "#040714");
        bgGrad.addColorStop(0.6, "#02040a");
        bgGrad.addColorStop(1, "#000000");
      } else if (condition === "rain" || condition === "thunderstorm") {
        // Deep Slate Ocean
        bgGrad.addColorStop(0, "#08192b");
        bgGrad.addColorStop(0.5, "#06101c");
        bgGrad.addColorStop(1, "#02050a");
      } else if (condition === "snow") {
        // Crisp Arctic Frost
        bgGrad.addColorStop(0, "#0f1c2e");
        bgGrad.addColorStop(0.6, "#08101a");
        bgGrad.addColorStop(1, "#03060a");
      } else {
        // Overcast / Mist
        bgGrad.addColorStop(0, "#0e1524");
        bgGrad.addColorStop(0.6, "#080c14");
        bgGrad.addColorStop(1, "#030508");
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Atmospheric Radial Glows
      const glowX = width * 0.5;
      const glowY = height * 0.2;
      const glowRad = Math.min(width, height) * 0.75;
      const radialGlow = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, glowRad);
      
      if (condition === "clearDay") {
        radialGlow.addColorStop(0, "rgba(56, 189, 248, 0.12)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (condition === "sunriseSunset") {
        radialGlow.addColorStop(0, "rgba(251, 146, 60, 0.14)");
        radialGlow.addColorStop(0.5, "rgba(244, 63, 94, 0.08)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (condition === "rain" || condition === "thunderstorm") {
        radialGlow.addColorStop(0, "rgba(14, 165, 233, 0.1)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        radialGlow.addColorStop(0, "rgba(148, 163, 184, 0.06)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars
      if (condition === "clearNight" || condition === "sunriseSunset") {
        stars.forEach((star) => {
          if (star.increasing) {
            star.alpha += star.speed;
            if (star.alpha >= 0.8) star.increasing = false;
          } else {
            star.alpha -= star.speed;
            if (star.alpha <= 0.15) star.increasing = true;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        spawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= 0.025;

          if (s.alpha <= 0 || s.x > width || s.y > height) {
            shootingStars.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(
            s.x - Math.cos(s.angle) * s.len,
            s.y - Math.sin(s.angle) * s.len
          );
          ctx.stroke();
        }
      }

      // 4. Rain / Snow
      if (condition === "rain" || condition === "thunderstorm") {
        ctx.lineWidth = 1.1;
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y > height) {
            p.y = -15;
            p.x = Math.random() * (width + 100) - 50;
          }

          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX, p.y + p.length);
          ctx.stroke();
        });
      } else if (condition === "snow") {
        particles.forEach((p) => {
          p.sway += 0.015;
          p.x += Math.sin(p.sway) * 0.5 + p.speedX;
          p.y += p.speedY;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. Lightning
      if (condition === "thunderstorm") {
        lightningTimer++;
        if (lightningTimer > 200 && Math.random() < 0.02) {
          lightningFlash = 0.5;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash * 0.25})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash -= 0.05;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030508]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default WeatherEnvironment;
