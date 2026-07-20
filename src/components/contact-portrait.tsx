"use client";

import { useEffect, useRef } from "react";

function containRect(iW: number, iH: number, cW: number, cH: number) {
  const a = iW / iH;
  const b = cW / cH;
  return a > b
    ? {
        x: 0,
        y: Math.round((cH - cW / a) / 2),
        w: cW,
        h: Math.round(cW / a),
      }
    : {
        x: Math.round((cW - cH * a) / 2),
        y: 0,
        w: Math.round(cH * a),
        h: cH,
      };
}

function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [items[index], items[target]] = [items[target], items[index]];
  }
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  homeX: number;
  homeY: number;
  r: number;
  g: number;
  b: number;
  a: number;
};

interface ContactPortraitProps {
  src: string;
  alt: string;
}

export default function ContactPortrait({ src, alt }: ContactPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let disposed = false;
    const image = new window.Image();
    image.crossOrigin = "anonymous";

    const resizeAndBuild = () => {
      const width = container.clientWidth || 1;
      const height = Math.round(width * 1.25);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!image.naturalWidth || !image.naturalHeight) return;

      const fit = containRect(
        image.naturalWidth,
        image.naturalHeight,
        width,
        height
      );

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offContext = offscreen.getContext("2d");
      if (!offContext) return;

      offContext.clearRect(0, 0, width, height);
      offContext.drawImage(image, fit.x, fit.y, fit.w, fit.h);

      let pixels: Uint8ClampedArray;
      try {
        pixels = offContext.getImageData(0, 0, width, height).data;
      } catch {
        return;
      }

      const targetParticleCount = 37;
      const gap = Math.max(2, Math.round(150 / Math.max(1, targetParticleCount)));
      const sourceParticles: Array<{
        homeX: number;
        homeY: number;
        r: number;
        g: number;
        b: number;
        a: number;
      }> = [];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          if (pixels[index + 3] < 20) continue;
          sourceParticles.push({
            homeX: x,
            homeY: y,
            r: pixels[index],
            g: pixels[index + 1],
            b: pixels[index + 2],
            a: pixels[index + 3],
          });
        }
      }

      shuffle(sourceParticles);

      particlesRef.current = sourceParticles.map((particle) => ({
        x: particle.homeX,
        y: particle.homeY,
        vx: 0,
        vy: 0,
        startX: particle.homeX,
        startY: particle.homeY,
        homeX: particle.homeX,
        homeY: particle.homeY,
        r: particle.r,
        g: particle.g,
        b: particle.b,
        a: particle.a,
      }));
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      if (!width || !height) return;

      context.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      if (!particles.length) return;

      const radius = 3.5;
      const time = performance.now() * 0.001;
      const mouse = mouseRef.current;

      for (const particle of particles) {
        const dx = particle.homeX - particle.x;
        const dy = particle.homeY - particle.y;
        const mx = particle.x - mouse.x;
        const my = particle.y - mouse.y;
        const mouseDistance = Math.hypot(mx, my);

        if (mouse.active && mouseDistance < 120) {
          const repel = (1 - mouseDistance / 120) * 1.6;
          particle.vx += (mx / Math.max(mouseDistance, 0.001)) * repel;
          particle.vy += (my / Math.max(mouseDistance, 0.001)) * repel;
        }

        particle.vx += dx * 0.012;
        particle.vy += dy * 0.012;
        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const wobble = 0.5 + Math.sin((particle.homeX + particle.homeY) * 0.02 + time) * 0.12;
        context.fillStyle = `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${particle.a / 255})`;
        context.beginPath();
        context.arc(particle.x, particle.y, radius * wobble, 0, Math.PI * 2);
        context.fill();
      }
    };

    const onResize = () => resizeAndBuild();
    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    image.onload = () => {
      if (disposed) return;
      resizeAndBuild();
      draw();
    };
    image.src = src;

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-3 shadow-[0_25px_90px_rgba(0,0,0,0.35)]"
      aria-label={alt}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.24),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_38%)]" />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/30">
        <canvas ref={canvasRef} className="block h-auto w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      
    </div>
  );
}