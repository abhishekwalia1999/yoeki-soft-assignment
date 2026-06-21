"use client";

import { useEffect, useRef } from "react";

interface Stream {
  x: number;
  y: number;
  speed: number;
  width: number;
  hue: number;
  opacity: number;
  length: number;
  offset: number;
}

export default function Chapter3Accelerate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = 480);
    const H = (canvas.height = 380);

    const STREAM_COUNT = 28;

    // Energy streams
    const streams: Stream[] = Array.from({ length: STREAM_COUNT }, (_, i) => ({
      x: -100 + Math.random() * 50,
      y: (i / STREAM_COUNT) * H + Math.random() * 20 - 10,
      speed: 2 + Math.random() * 6,
      width: 0.5 + Math.random() * 3,
      hue: 210 + Math.random() * 60,
      opacity: 0.2 + Math.random() * 0.7,
      length: 80 + Math.random() * 200,
      offset: Math.random() * W,
    }));

    // Warp lines (thin background speed lines)
    const warpLines = Array.from({ length: 60 }, (_, i) => ({
      y: (i / 60) * H,
      speed: 1 + Math.random() * 3,
      opacity: 0.03 + Math.random() * 0.05,
      x: Math.random() * W,
      length: 20 + Math.random() * 80,
    }));

    let frame = 0;

    const draw = () => {
      requestAnimationFrame(draw);
      frame++;

      // Background with trail
      ctx.fillStyle = "rgba(8, 14, 30, 0.15)";
      ctx.fillRect(0, 0, W, H);

      // Full bg for clear frame
      if (frame === 1) {
        ctx.fillStyle = "#080E1E";
        ctx.fillRect(0, 0, W, H);
      }

      // Warp lines (background)
      warpLines.forEach((line) => {
        line.x = (line.x + line.speed) % W;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x - line.length, line.y);
        ctx.strokeStyle = `rgba(37,99,235,${line.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Central energy beam
      const beamPulse = 0.5 + Math.sin(frame * 0.04) * 0.5;
      const beamGrad = ctx.createLinearGradient(0, H * 0.5 - 30, W, H * 0.5 + 30);
      beamGrad.addColorStop(0, "transparent");
      beamGrad.addColorStop(0.3, `rgba(37,99,235,${0.06 * beamPulse})`);
      beamGrad.addColorStop(0.5, `rgba(56,189,248,${0.12 * beamPulse})`);
      beamGrad.addColorStop(0.7, `rgba(37,99,235,${0.06 * beamPulse})`);
      beamGrad.addColorStop(1, "transparent");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, H * 0.5 - 60, W, 120);

      // Energy streams
      streams.forEach((s) => {
        s.x = (s.x + s.speed + s.offset * 0.01) % (W + s.length + 100);
        if (s.x > W + s.length) s.x = -s.length;

        const tailX = s.x - s.length;

        // Stream gradient
        const grad = ctx.createLinearGradient(tailX, s.y, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, `hsla(${s.hue}, 80%, 65%, ${s.opacity * 0.5})`);
        grad.addColorStop(0.85, `hsla(${s.hue}, 90%, 70%, ${s.opacity})`);
        grad.addColorStop(1, "white");

        ctx.beginPath();
        ctx.moveTo(tailX, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.shadowBlur = s.width > 2 ? 12 : 4;
        ctx.shadowColor = `hsla(${s.hue}, 80%, 65%, 0.8)`;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Leading particle burst
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${s.opacity})`;
        ctx.fill();
      });

      // Central convergence point glow
      const cx = W * 0.55;
      const cy = H * 0.5;
      const glowR = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 + Math.sin(frame * 0.05) * 20);
      glowR.addColorStop(0, `rgba(56,189,248,${0.15 + Math.sin(frame * 0.05) * 0.05})`);
      glowR.addColorStop(0.4, `rgba(37,99,235,0.08)`);
      glowR.addColorStop(1, "transparent");
      ctx.fillStyle = glowR;
      ctx.fillRect(0, 0, W, H);

      // Speedometer ring
      const ringX = W * 0.55;
      const ringY = H * 0.5;
      const ringR = 60;
      const speed = (frame % 360) * (Math.PI / 180);

      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, -Math.PI * 0.75, -Math.PI * 0.75 + speed % (Math.PI * 2), false);
      ctx.strokeStyle = "rgba(56,189,248,0.6)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      // Ring tick marks
      for (let i = 0; i < 12; i++) {
        const angle = -Math.PI * 0.75 + (i / 12) * Math.PI * 1.5;
        const inner = ringR - 6;
        const outer = ringR;
        ctx.beginPath();
        ctx.moveTo(ringX + Math.cos(angle) * inner, ringY + Math.sin(angle) * inner);
        ctx.lineTo(ringX + Math.cos(angle) * outer, ringY + Math.sin(angle) * outer);
        ctx.strokeStyle = "rgba(148,163,184,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Speed text in center
      const spd = Math.floor(80 + Math.sin(frame * 0.03) * 15);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${spd}x`, ringX, ringY);

      ctx.fillStyle = "#38BDF8";
      ctx.font = "8px monospace";
      ctx.fillText("VELOCITY", ringX, ringY + 16);
    };

    draw();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-md rounded-xl"
        style={{
          border: "1px solid rgba(56,189,248,0.15)",
          filter: "drop-shadow(0 0 40px rgba(56,189,248,0.15))",
        }}
      />
    </div>
  );
}
