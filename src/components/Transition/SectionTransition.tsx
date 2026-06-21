"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Particle convergence on scroll
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 200;

    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: canvas.width / 2,
      targetY: canvas.height / 2,
      vx: 0,
      vy: 0,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? "#2563EB" : "#38BDF8",
      convergeProgress: 0,
    }));

    let frame = 0;
    let converge = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.002 * converge;
        p.vy += dy * 0.002 * converge;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central beam glow
      if (converge > 0.3) {
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, 100 * converge
        );
        grad.addColorStop(0, `rgba(56,189,248,${0.3 * converge})`);
        grad.addColorStop(0.5, `rgba(37,99,235,${0.15 * converge})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    draw();

    // ScrollTrigger for convergence
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        converge = self.progress;

        // Beam expansion
        if (beamRef.current) {
          gsap.set(beamRef.current, {
            scaleX: 0.1 + self.progress * 1.5,
            opacity: self.progress * 0.9,
          });
        }

        // Grid collapse
        if (gridRef.current) {
          gsap.set(gridRef.current, {
            opacity: 1 - self.progress * 0.8,
            scale: 1 - self.progress * 0.05,
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-48 overflow-hidden flex items-center justify-center"
      style={{ background: "#020617" }}
    >
      {/* Collapsing grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Expanding light beam */}
      <div
        ref={beamRef}
        className="absolute top-1/2 -translate-y-1/2 h-0.5 pointer-events-none"
        style={{
          width: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, #38BDF8 20%, #2563EB 50%, #38BDF8 80%, transparent 100%)",
          boxShadow: "0 0 20px #2563EB, 0 0 60px rgba(37,99,235,0.4)",
          opacity: 0,
          transformOrigin: "center",
          transform: "scaleX(0.1)",
        }}
      />

      {/* Top and bottom fades */}
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }}
      />
    </div>
  );
}
