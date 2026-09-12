import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';

export const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle generator based on theme
    const particleCount = currentTheme === THEMES.SAMURAI ? 45 : currentTheme === THEMES.FOREST ? 55 : 40;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedX: currentTheme === THEMES.SAMURAI ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.6,
        speedY: currentTheme === THEMES.SAMURAI ? Math.random() * 1.2 + 0.8 : (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render theme-specific particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.rotationSpeed;

        // Wrap around screen
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (currentTheme === THEMES.FOREST) {
          // Bioluminescent glowing forest spores / fireflies
          ctx.beginPath();
          const pulse = (Math.sin(Date.now() * 0.002 + p.x) + 1) / 2;
          const currentRadius = p.radius * (0.8 + pulse * 0.6);
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius * 2.5);
          gradient.addColorStop(0, `rgba(52, 211, 153, ${p.opacity})`);
          gradient.addColorStop(0.5, `rgba(16, 185, 129, ${p.opacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

          ctx.fillStyle = gradient;
          ctx.fill();

        } else if (currentTheme === THEMES.SAMURAI) {
          // Falling Sakura blossom petal
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.2, p.radius * 1.1, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity * 0.7})`;
          ctx.fill();

        } else if (currentTheme === THEMES.CITY) {
          // Digital cyber data spark / blueprint node
          ctx.beginPath();
          ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.fillStyle = p.radius > 2 
            ? `rgba(0, 242, 254, ${p.opacity * 0.8})` 
            : `rgba(245, 158, 11, ${p.opacity * 0.7})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f2fe';
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
