"use client";

import { useEffect, useRef } from "react";

export default function Chapter1Transform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const uiRef = useRef<SVGGElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    // Simple floating animation — GSAP ScrollTrigger controls progress externally
    const svg = svgRef.current;
    if (!svg) return;

    let frame = 0;
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.015;

      // Subtle float
      if (svg) {
        svg.style.transform = `translateY(${Math.sin(t) * 6}px)`;
      }
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 440 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md transition-transform"
        style={{ filter: "drop-shadow(0 0 40px rgba(37,99,235,0.25))" }}
      >
        {/* Blueprint grid */}
        <defs>
          <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2563EB" strokeWidth="0.3" opacity="0.4" />
          </pattern>
          <linearGradient id="uiGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="440" height="360" fill="#0A0F1E" rx="16" />
        <rect width="440" height="360" fill="url(#blueprintGrid)" rx="16" />

        {/* Blueprint measurement lines */}
        <line x1="40" y1="20" x2="40" y2="340" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
        <line x1="400" y1="20" x2="400" y2="340" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
        <line x1="20" y1="30" x2="420" y2="30" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
        <line x1="20" y1="330" x2="420" y2="330" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />

        {/* Dimension arrows */}
        <path d="M40 15 L44 20 L36 20 Z" fill="#38BDF8" opacity="0.5" />
        <path d="M40 345 L44 340 L36 340 Z" fill="#38BDF8" opacity="0.5" />
        <text x="20" y="185" fill="#38BDF8" fontSize="7" opacity="0.6" fontFamily="monospace">360px</text>

        {/* Sketch lines (blueprint state) */}
        <g opacity="0.5">
          <rect x="60" y="50" width="320" height="40" rx="4" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 3" />
          <rect x="60" y="110" width="140" height="80" rx="4" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 3" />
          <rect x="220" y="110" width="160" height="80" rx="4" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 3" />
          <rect x="60" y="210" width="320" height="100" rx="4" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 3" />
        </g>

        {/* Finished UI (assembled on top) */}
        {/* Navbar */}
        <rect x="60" y="50" width="320" height="40" rx="6" fill="url(#uiGrad)" stroke="#1E293B" strokeWidth="1" />
        <circle cx="80" cy="70" r="8" fill="#2563EB" opacity="0.9" />
        <rect x="96" y="65" width="40" height="4" rx="2" fill="#FFFFFF" opacity="0.7" />
        <rect x="200" y="65" width="28" height="4" rx="2" fill="#94A3B8" opacity="0.5" />
        <rect x="236" y="65" width="28" height="4" rx="2" fill="#94A3B8" opacity="0.5" />
        <rect x="272" y="65" width="28" height="4" rx="2" fill="#94A3B8" opacity="0.5" />
        <rect x="326" y="62" width="44" height="14" rx="4" fill="#2563EB" />
        <rect x="333" y="67" width="30" height="4" rx="2" fill="white" opacity="0.9" />

        {/* Left card */}
        <rect x="60" y="110" width="140" height="80" rx="6" fill="url(#uiGrad)" stroke="#1E293B" strokeWidth="1" />
        <rect x="74" y="124" width="50" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
        <rect x="74" y="134" width="80" height="3" rx="1.5" fill="#475569" opacity="0.6" />
        <rect x="74" y="141" width="64" height="3" rx="1.5" fill="#475569" opacity="0.6" />
        <rect x="74" y="155" width="40" height="18" rx="4" fill="#2563EB" opacity="0.8" />
        <rect x="78" y="161" width="32" height="3" rx="1.5" fill="white" opacity="0.9" />

        {/* Right card */}
        <rect x="220" y="110" width="160" height="80" rx="6" fill="url(#uiGrad)" stroke="#1E293B" strokeWidth="1" />
        <rect x="234" y="120" width="90" height="50" rx="4" fill="#0F172A" />
        {/* Mini chart bars */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={240 + i * 16}
            y={146 - [20, 30, 18, 38, 28][i]}
            width="10"
            height={[20, 30, 18, 38, 28][i]}
            rx="2"
            fill="url(#accentGrad)"
            opacity="0.85"
          />
        ))}
        <rect x="234" y="178" width="40" height="4" rx="2" fill="#FFFFFF" opacity="0.6" />
        <rect x="284" y="178" width="24" height="4" rx="2" fill="#38BDF8" opacity="0.5" />

        {/* Bottom panel */}
        <rect x="60" y="210" width="320" height="100" rx="6" fill="url(#uiGrad)" stroke="#1E293B" strokeWidth="1" />
        <rect x="74" y="224" width="80" height="5" rx="2.5" fill="#FFFFFF" opacity="0.8" />
        <rect x="74" y="236" width="200" height="3" rx="1.5" fill="#475569" opacity="0.5" />
        <rect x="74" y="243" width="160" height="3" rx="1.5" fill="#475569" opacity="0.5" />
        <rect x="74" y="250" width="180" height="3" rx="1.5" fill="#475569" opacity="0.5" />

        {/* Progress bar */}
        <rect x="74" y="268" width="200" height="6" rx="3" fill="#1E293B" />
        <rect x="74" y="268" width="140" height="6" rx="3" fill="url(#accentGrad)" />
        <circle cx="214" cy="271" r="5" fill="#38BDF8" filter="url(#glow1)" />
        <text x="284" y="274" fill="#38BDF8" fontSize="8" fontFamily="monospace">70%</text>

        {/* Assembly dots (connectors) */}
        {[[60,90],[200,90],[380,90],[60,190],[200,190],[380,190]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#38BDF8" opacity="0.6" filter="url(#glow1)" />
        ))}

        {/* Status label */}
        <rect x="154" y="8" width="132" height="18" rx="9" fill="#0F172A" stroke="#2563EB" strokeWidth="0.5" />
        <circle cx="166" cy="17" r="3" fill="#38BDF8" />
        <text x="173" y="20" fill="#94A3B8" fontSize="8" fontFamily="monospace">UI Assembled — Live</text>
      </svg>
    </div>
  );
}
