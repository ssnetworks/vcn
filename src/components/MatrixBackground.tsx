'use client';

import React, { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    let resizeTimeout: NodeJS.Timeout;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Characters list (binary, hex, and cyber symbols)
    const chars = '010101010101ABCDEFUX%#$&@*<>[]{}VCN'.split('');
    const fontSize = 14;
    
    // Calculate columns based on window width and font size
    let columns = Math.floor(canvas.width / fontSize);
    let rainDrops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));

    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Limit rendering speed to 30 FPS to save CPU and battery

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      // Frame throttle check
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);

      // Fade out background slightly to create trail effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color and font
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        // Pick a random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Vary character brightness for depth
        const brightness = Math.random();
        if (brightness > 0.96) {
          ctx.fillStyle = '#ffffff'; // White highlight for leading edge
        } else if (brightness > 0.5) {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.85)'; // Neon Cyan primary
        } else {
          ctx.fillStyle = 'rgba(0, 114, 255, 0.35)'; // Cyber Blue dim trail
        }

        // Draw character
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;
        
        // Draw the text
        if (y > 0) {
          ctx.fillText(text, x, y);
        }

        // Reset raindrop if it goes off screen or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        // Move raindrop down
        rainDrops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    // Handle window resize dynamically adjusting columns with 100ms debounce
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        const newColumns = Math.floor(canvas.width / fontSize);
        if (newColumns > columns) {
          const extra = Array(newColumns - columns).fill(1).map(() => Math.floor(Math.random() * -100));
          rainDrops = [...rainDrops, ...extra];
        } else if (newColumns < columns) {
          rainDrops = rainDrops.slice(0, newColumns);
        }
        columns = newColumns;
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-45"
    />
  );
}
