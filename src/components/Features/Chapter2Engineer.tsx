"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Edge {
  from: number;
  to: number;
  progress: number;
  speed: number;
  particlePos: number;
}

const NODE_DATA = [
  { x: 0.5, y: 0.5, label: "Core", color: "#2563EB", radius: 18 },
  { x: 0.15, y: 0.25, label: "Auth", color: "#38BDF8", radius: 11 },
  { x: 0.82, y: 0.2, label: "API", color: "#818CF8", radius: 13 },
  { x: 0.12, y: 0.72, label: "DB", color: "#38BDF8", radius: 12 },
  { x: 0.85, y: 0.78, label: "ML", color: "#F472B6", radius: 14 },
  { x: 0.35, y: 0.15, label: "Cache", color: "#34D399", radius: 10 },
  { x: 0.72, y: 0.5, label: "Queue", color: "#FBBF24", radius: 11 },
  { x: 0.28, y: 0.82, label: "CDN", color: "#38BDF8", radius: 10 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
  { from: 0, to: 7 }, { from: 1, to: 5 }, { from: 2, to: 6 },
  { from: 3, to: 7 }, { from: 4, to: 6 },
];

export default function Chapter2Engineer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = 480;
    const H = canvas.height = 380;

    // Initialize nodes
    const nodes: Node[] = NODE_DATA.map((n) => ({
      x: n.x * W,
      y: n.y * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: n.radius,
      label: n.label,
      color: n.color,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));

    // Initialize edges with particle flow
    const edges: Edge[] = EDGES.map((e) => ({
      ...e,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      particlePos: Math.random(),
    }));

    let frame = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      frame++;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#080E1E";
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(37,99,235,0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Float nodes gently
      nodes.forEach((n, i) => {
        if (i === 0) return; // Core stays central
        n.x += Math.sin(frame * 0.008 + i * 1.2) * 0.3;
        n.y += Math.cos(frame * 0.006 + i * 0.8) * 0.25;
        n.pulse += n.pulseSpeed;

        // Keep within bounds
        const pad = n.radius + 10;
        n.x = Math.max(pad, Math.min(W - pad, n.x));
        n.y = Math.max(pad, Math.min(H - pad, n.y));
      });

      // Draw edges
      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        edge.particlePos = (edge.particlePos + edge.speed) % 1;

        // Gradient line
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `${from.color}30`);
        grad.addColorStop(1, `${to.color}30`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Flowing particle along edge
        const px = from.x + (to.x - from.x) * edge.particlePos;
        const py = from.y + (to.y - from.y) * edge.particlePos;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = from.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = from.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulse) * 0.15 + 1;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}10`;
        ctx.fill();

        // Mid ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}15`;
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 1, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + "60";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core fill
        const radialGrad = ctx.createRadialGradient(n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0, n.x, n.y, n.radius);
        radialGrad.addColorStop(0, n.color + "DD");
        radialGrad.addColorStop(1, n.color + "44");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = radialGrad;
        ctx.shadowBlur = 15;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${n.radius > 14 ? 10 : 8}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y);
      });

      // Data pulse rings from core
      if (frame % 90 < 60) {
        const progress = (frame % 90) / 60;
        const core = nodes[0];
        ctx.beginPath();
        ctx.arc(core.x, core.y, 18 + progress * 80, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37,99,235,${0.4 * (1 - progress)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      if (frame % 90 < 30) {
        const progress = (frame % 90) / 30;
        const core = nodes[0];
        ctx.beginPath();
        ctx.arc(core.x, core.y, 18 + progress * 80, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56,189,248,${0.3 * (1 - progress)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    draw();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-md rounded-xl"
        style={{
          border: "1px solid rgba(37,99,235,0.15)",
          filter: "drop-shadow(0 0 40px rgba(37,99,235,0.2))",
        }}
      />
    </div>
  );
}
