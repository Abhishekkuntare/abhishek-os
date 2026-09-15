import React, { useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';

export const LiveWallpaper: React.FC = () => {
  const { currentWallpaper, settings } = useOS();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldAnimate =
    settings.animationsEnabled &&
    settings.performanceMode !== 'performance' &&
    !isReducedMotion &&
    currentWallpaper.type &&
    currentWallpaper.type !== 'static' &&
    currentWallpaper.type !== 'video';

  useEffect(() => {
    if (!shouldAnimate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Initializations based on wallpaper type
    const wallpaperType = currentWallpaper.type || 'aurora';
    let time = 0;

    // Starfield particles
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      alpha: number;
      speed: number;
    }
    const stars: Star[] = [];
    if (wallpaperType === 'starfield' || wallpaperType === 'cosmic-flow') {
      const count = settings.performanceMode === 'quality' ? 120 : 60;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * width,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.2,
        });
      }
    }

    // Neural nodes
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }
    const nodes: Node[] = [];
    if (wallpaperType === 'neural') {
      const nodeCount = settings.performanceMode === 'quality' ? 35 : 20;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 1.5,
        });
      }
    }

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      if (wallpaperType === 'aurora') {
        // Multi-layer glowing sinusoidal aurora curtains
        const layers = [
          { color: 'rgba(56, 189, 248, 0.15)', freq: 0.0018, speed: 0.8, amp: 90, yOffset: height * 0.35 },
          { color: 'rgba(129, 140, 248, 0.12)', freq: 0.0022, speed: 1.1, amp: 120, yOffset: height * 0.42 },
          { color: 'rgba(52, 211, 153, 0.08)', freq: 0.0015, speed: 0.6, amp: 80, yOffset: height * 0.5 },
        ];

        layers.forEach(layer => {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const wave1 = Math.sin(x * layer.freq + time * layer.speed) * layer.amp;
            const wave2 = Math.cos(x * layer.freq * 0.5 + time * 0.5) * (layer.amp * 0.5);
            const mouseFactor = ((mouseX - width / 2) / width) * 40;
            const y = layer.yOffset + wave1 + wave2 + mouseFactor;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = layer.color;
          ctx.fill();
        });
      } else if (wallpaperType === 'starfield') {
        // 3D Starfield with smooth drift & parallax
        const cx = width / 2;
        const cy = height / 2;
        const parallaxX = (mouseX - cx) * 0.08;
        const parallaxY = (mouseY - cy) * 0.08;

        stars.forEach(star => {
          star.y += star.speed;
          if (star.y > height) star.y = 0;

          const twinkle = Math.sin(time * 2 + star.x) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
          ctx.beginPath();
          ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (wallpaperType === 'developer-grid') {
        // Cyberpunk 3D perspective floor grid
        const horizon = height * 0.55;
        const gridSpeed = (time * 40) % 50;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.lineWidth = 1;

        // Perspective horizontal lines
        for (let y = horizon; y < height; y += (y - horizon) * 0.22 + 8) {
          ctx.beginPath();
          ctx.moveTo(0, y + (gridSpeed * (y - horizon)) / height);
          ctx.lineTo(width, y + (gridSpeed * (y - horizon)) / height);
          ctx.stroke();
        }

        // Perspective vertical vanishing rays
        const vanishingX = width / 2 + (mouseX - width / 2) * 0.15;
        for (let x = -width * 0.5; x <= width * 1.5; x += 70) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizon);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Laser scan line
        const scanY = ((Math.sin(time) + 1) / 2) * height;
        const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
        gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 20, width, 40);
      } else if (wallpaperType === 'neural') {
        // Interactive Synaptic Nodes
        nodes.forEach((node, i) => {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // React slightly to mouse
          const dxMouse = mouseX - node.x;
          const dyMouse = mouseY - node.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 140) {
            node.x -= (dxMouse / distMouse) * 1.2;
            node.y -= (dyMouse / distMouse) * 1.2;
          }

          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect adjacent nodes
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.25;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      } else if (wallpaperType === 'cosmic-flow') {
        // Swirling particle flow ribbons
        stars.forEach(star => {
          star.x += Math.sin(star.y * 0.005 + time) * 0.8;
          star.y -= star.speed * 0.7;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(168, 85, 247, ${star.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (wallpaperType === 'black-hole') {
        // Swirling gravitational accretion ring around center
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.22;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.2);

        for (let ring = 0; ring < 3; ring++) {
          const r = radius + ring * 25;
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.4, time * 0.1 * (ring + 1), 0, Math.PI * 2);
          ctx.strokeStyle = ring === 0 ? 'rgba(249, 115, 22, 0.25)' : 'rgba(234, 88, 12, 0.12)';
          ctx.lineWidth = 14 - ring * 3;
          ctx.stroke();
        }

        ctx.restore();
      } else if (wallpaperType === 'liquid-glass') {
        // Soft refracted chromatic waves
        const gradient = ctx.createRadialGradient(
          mouseX,
          mouseY,
          50,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.6
        );
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentWallpaper.type, shouldAnimate, settings.performanceMode]);

  return (
    <>
      {currentWallpaper.type === 'video' && currentWallpaper.videoUrl && (
        <video
          key={currentWallpaper.videoUrl}
          src={currentWallpaper.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover pointer-events-none z-0"
        />
      )}
      {shouldAnimate && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ opacity: settings.performanceMode === 'performance' ? 0.3 : 0.8 }}
        />
      )}

      {/* Global Brightness & Focus Mode Overlays */}
      {settings.brightness < 100 && (
        <div
          className="absolute inset-0 pointer-events-none z-8500 bg-black transition-opacity"
          style={{ opacity: (100 - settings.brightness) / 100 * 0.7 }}
        />
      )}
      {settings.focusMode && (
        <div className="absolute inset-0 pointer-events-none z-8500 backdrop-saturate-75 bg-slate-950/20" />
      )}
    </>
  );
};
