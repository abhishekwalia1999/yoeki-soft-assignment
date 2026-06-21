"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleField from "./ParticleField";

gsap.registerPlugin(ScrollTrigger);

interface WaterNode {
  x: number;
  y: number;
  r: number;
  opacity: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trustCardRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoFloatRef = useRef<HTMLDivElement>(null);
  const logoTiltRef = useRef<HTMLDivElement>(null);

  const waterCanvasRef = useRef<HTMLCanvasElement>(null);
  const displacementRef = useRef<any>(null);
  const turbulenceRef = useRef<any>(null);
  const waterNodesRef = useRef<WaterNode[]>([]);
  const isHoveredRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const warpScaleRef = useRef(0);
  const targetWarpScaleRef = useRef(0);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    targetWarpScaleRef.current = 28;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    targetWarpScaleRef.current = 0;
  };

  const handleMouseMoveVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastMousePosRef.current.x;
    const dy = y - lastMousePosRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    lastMousePosRef.current = { x, y };

    if (isHoveredRef.current) {
      targetWarpScaleRef.current = Math.min(28 + speed * 0.8, 65);
    }

    const canvas = waterCanvasRef.current;
    if (canvas && speed > 1) {
      waterNodesRef.current.push({
        x,
        y,
        r: 4,
        opacity: 0.85,
        life: 0,
        maxLife: 55 + Math.random() * 15,
        vx: 0,
        vy: 0,
      });
    }
  };

  useEffect(() => {
    /* ── Initial hidden states ─────────────────────────────── */
    gsap.set(logoWrapRef.current, { opacity: 0, scale: 0.86, rotate: -2 });
    gsap.set(taglineRef.current, { opacity: 0, x: -24 });
    gsap.set(".hero-line", { opacity: 0, y: 60 });
    gsap.set(subheadRef.current, { opacity: 0, y: 20 });
    gsap.set(ctaRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollRef.current, { opacity: 0 });
    gsap.set(trustCardRef.current, { opacity: 0, y: 16 });

    /* ── Master entrance timeline ──────────────────────────── */
    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(logoWrapRef.current, {
      opacity: 1, scale: 1, rotate: 0,
      duration: 2, ease: "power4.out",
    })
      .to(taglineRef.current, {
        opacity: 1, x: 0,
        duration: 0.8, ease: "power3.out",
      }, "-=1.6")
      .to(".hero-line", {
        opacity: 1, y: 0,
        duration: 1.0, stagger: 0.14,
        ease: "power4.out",
      }, "-=1.4")
      .to(subheadRef.current, {
        opacity: 1, y: 0,
        duration: 0.8, ease: "power3.out",
      }, "-=0.5")
      .to(ctaRef.current, {
        opacity: 1, y: 0,
        duration: 0.8, ease: "power3.out",
      }, "-=0.5")
      .to([scrollRef.current, trustCardRef.current], {
        opacity: 1, y: 0,
        duration: 1.0, stagger: 0.12,
        ease: "power3.out",
      }, "-=0.3");

    /* ── Continuous float ──────────────────────────────────── */
    const floatTl = gsap.to(logoFloatRef.current, {
      y: "-22px", rotation: 1.2,
      duration: 5.5, ease: "sine.inOut",
      yoyo: true, repeat: -1,
    });

    /* ── Mouse parallax / 3-D tilt ────────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5);
      const my = (e.clientY / window.innerHeight - 0.5);
      if (!logoTiltRef.current) return;
      gsap.to(logoTiltRef.current, {
        rotateY: mx * 18,
        rotateX: -my * 14,
        x: mx * 24,
        y: my * 24,
        duration: 1.6, ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /* ── Scroll parallax on logo ───────────────────────────── */
    let st: ScrollTrigger | null = null;
    if (sectionRef.current) {
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (s) => {
          gsap.set(logoWrapRef.current, {
            y: s.progress * 140,
            scale: 1 - s.progress * 0.06,
            opacity: 1 - s.progress * 0.5,
          });
        },
      });
    }

    let time = 0;
    let waterRafId: number;

    const animateWater = () => {
      time++;
      waterRafId = requestAnimationFrame(animateWater);

      // Canvas resizing check (resolves first-load 0-dimension bugs)
      const canvas = waterCanvasRef.current;
      if (canvas) {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }

      // Lerp SVG displacement scale
      warpScaleRef.current += (targetWarpScaleRef.current - warpScaleRef.current) * 0.085;
      if (displacementRef.current) {
        displacementRef.current.setAttribute("scale", warpScaleRef.current.toFixed(2));
      }

      // Animate turbulence baseFrequency for underwater current feel
      if (turbulenceRef.current) {
        const baseValX = 0.012 + Math.sin(time * 0.015) * 0.003;
        const baseValY = 0.015 + Math.cos(time * 0.02) * 0.003;
        turbulenceRef.current.setAttribute("baseFrequency", `${baseValX} ${baseValY}`);
      }

      // Draw droplets on canvas
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = waterNodesRef.current;
      waterNodesRef.current = nodes.filter((node) => {
        node.life++;
        if (node.life >= node.maxLife) return false;

        const ratio = node.life / node.maxLife;
        node.r += 2.4; // expand ripple wave
        node.opacity = 0.85 * Math.sin((1 - ratio) * Math.PI * 0.5);

        // Draw primary ripple ring
        ctx.strokeStyle = `rgba(123, 143, 245, ${0.22 * node.opacity})`;
        ctx.lineWidth = 1.8 * (1 - ratio);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.stroke();

        // Draw secondary concentric ring
        if (node.r > 15) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * node.opacity})`;
          ctx.lineWidth = 1.0 * (1 - ratio);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r - 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        return true;
      });
    };

    animateWater();

    return () => {
      tl.kill();
      floatTl.kill();
      window.removeEventListener("mousemove", onMouseMove);
      if (st) st.kill();
      cancelAnimationFrame(waterRafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative w-full overflow-hidden"
      style={{
        minHeight: "100svh",
        background: "#000000",
      }}
      aria-label="Hero section"
    >
      {/* ── Subtle background glow blobs ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Violet glow — sits behind the sculpture */}
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 900,
            right: "-5%", top: "5%",
            background: "radial-gradient(circle, rgba(109,40,217,0.13) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        {/* Warm orange undertone — bottom-left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            left: "-8%", bottom: "-8%",
            background: "radial-gradient(circle, rgba(234,88,12,0.07) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Particle dust ─────────────────────────────────── */}
      <ParticleField />

      {/* ════════════════════════════════════════════════════
          LEFT  –  text content
      ════════════════════════════════════════════════════ */}
      <div
        className="hero-text-col relative z-20 flex flex-col justify-center pointer-events-none"
        style={{ padding: "clamp(24px, 5.5vw, 88px)", paddingTop: "88px", paddingBottom: "48px" }}
      >
        {/* Tagline */}
        <div
          ref={taglineRef}
          className="flex items-center gap-3 mb-9"
        >
          <span
            className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#6c77b8]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", marginBottom: "16px" }}
          >
            Digital Transformation Partner
          </span>
          <span className="block h-px w-14 bg-[#6c77b8]/40" />
        </div>

        {/* Main heading */}
        <h1
          ref={headlineRef}
          className="font-serif font-light leading-[1.05] tracking-[-0.01em] text-white mb-9 select-none"
          style={{ fontSize: "clamp(46px, 5vw, 80px)" }}
        >
          <span className="hero-line block">Engineering</span>
          <span className="hero-line block whitespace-nowrap">Digital Transformation</span>
          <span
            className="hero-line block italic whitespace-nowrap mt-1"
            style={{ color: "#7b8ff5", marginBottom: "24px" }}
          >
            For The Next Generation
          </span>
        </h1>

        {/* Description */}
        <p
          ref={subheadRef}
          className="text-[15px] leading-[1.75] font-light text-[#8a90a6] mb-9 select-none"
          style={{ maxWidth: 490, marginBottom: "24px" }}
        >
          Building scalable software, intelligent platforms,
          and enterprise solutions that help organizations
          innovate with confidence.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex items-center gap-7 pointer-events-auto">
          {/* Primary filled pill */}
          <a
            href="#solutions"
            className="flex items-center gap-[7px] text-white text-[13.5px] font-medium tracking-[0.01em] transition-all duration-300 hover:opacity-90 group"
            style={{
              background: "#4f5dff",
              borderRadius: 999,
              padding: "12px 24px",
              boxShadow: "0 0 28px rgba(79,93,255,0.25)",
            }}
          >
            <div className="btn-text-flip">
              <span>Explore Solutions</span>
              <span aria-hidden="true">Explore Solutions</span>
            </div>
            <svg
              className="group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-300"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>


          <a
            href="#"
            className="btn-secondary text-base rounded-full group !text-[13.5px] !font-medium "
            style={{
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              padding: "12px 24px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(110, 123, 255, 0.5)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(110, 123, 255, 0.08)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.15)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <div className="btn-text-flip">
              <span>View Capabilities</span>
              <span aria-hidden="true">View Capabilities</span>
            </div>
            <svg
              className="group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-300"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT  –  3-D sculpture (absolute, overflows edges)
      ════════════════════════════════════════════════════ */}
      <div
        ref={logoWrapRef}
        className="hero-logo-wrap absolute select-none pointer-events-auto"
        style={{
          /* Vertically centered using calc to avoid GSAP transform override conflicts */
          top: "calc(50% - clamp(320px, 50vw, 960px) / 2)",
          right: "2vw",
          width: "clamp(320px, 50vw, 960px)",
          height: "clamp(320px, 50vw, 960px)",
          perspective: 1200,
          zIndex: 15,
        }}
      >
        {/* Flat transparent mouse interaction overlay to bypass 3D transform projection blocking */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            cursor: "pointer",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMoveVideo}
          onMouseLeave={handleMouseLeave}
        />

        <div
          ref={logoFloatRef}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <div
            ref={logoTiltRef}
            style={{
              width: "100%", height: "100%", position: "relative",
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))",
            }}
          >
            <video
              src="/yoeki-logo-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: "translateZ(40px)",
                filter: "url(#water-warp)",
                mixBlendMode: "screen",
              }}
            />
            <canvas
              ref={waterCanvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: "translateZ(41px)",
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          SCROLL indicator  –  far left, vertical
      ════════════════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        className="hero-scroll-indicator absolute z-20 flex flex-col items-center gap-3"
        style={{ left: 36, bottom: 44 }}
      >
        <span
          className="text-[8.5px] font-mono uppercase tracking-[0.28em] text-[#475069] select-none"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          Scroll to Explore
        </span>
        {/* Thin line then glowing dot */}
        <span
          className="block w-px bg-[#222540]"
          style={{ height: 38 }}
        />
        <span
          className="block rounded-full bg-[#4f5dff]"
          style={{ width: 5, height: 5, boxShadow: "0 0 8px 2px rgba(79,93,255,0.55)" }}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          TRUST card  –  bottom right
      ════════════════════════════════════════════════════ */}
      <div
        ref={trustCardRef}
        className="hero-trust-card absolute z-20 select-none"
        style={{
          bottom: 80,
          right: "clamp(32px, 4vw, 80px)",
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "18px 22px",
          width: "320px",
          overflow: "hidden",
        }}
      >
        {/* Caption row */}
        <div className="flex items-start gap-2" style={{ marginBottom: "16px" }}>
          <span
            className="rounded-full bg-[#4f5dff] mt-[3px] shrink-0"
            style={{ width: 6, height: 6, boxShadow: "0 0 7px 2px rgba(79,93,255,0.6)" }}
          />
          <p className="text-[11.5px] text-[#7a8099] font-light leading-[1.55]">
            Trusted by forward-thinking<br />businesses worldwide.
          </p>
        </div>

        {/* Brand logos row with infinite horizontal scroll */}
        <div
          className="relative w-full overflow-hidden py-1"
          style={{
            maskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)"
          }}
        >
          <div className="flex w-max">
            {/* Wrapper 1 */}
            <div className="flex items-center gap-12 pr-12 shrink-0 animate-ticker">
              {/* adani | Capital */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="96" height="20" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18C4 18 8 10 14 10C20 10 22 16 26 16C30 16 32 12 32 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="38" y="16" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="-0.02em">adani</text>
                  <line x1="76" y1="6" x2="76" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
                  <text x="82" y="16" fill="white" fontSize="10" fontWeight="normal" fontFamily="system-ui, sans-serif" opacity="0.8">Capital</text>
                </svg>
              </div>

              {/* Hero Fincorp */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="86" height="20" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L9 6V18L4 20V4Z" fill="#00E676" />
                  <path d="M11 6L16 4V20L11 18V6Z" fill="#00E676" />
                  <text x="22" y="13" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="-0.01em">Hero</text>
                  <text x="22" y="21" fill="white" fontSize="7.5" fontWeight="light" fontFamily="system-ui, sans-serif" letterSpacing="0.08em">FINCORP</text>
                </svg>
              </div>

              {/* Moneyboxx */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="90" height="20" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 14H16V18H4V14Z" stroke="white" strokeWidth="1.5" />
                  <path d="M7 10H13V14H7V10Z" stroke="white" strokeWidth="1.5" />
                  <circle cx="10" cy="6" r="1.5" fill="#E53935" />
                  <text x="22" y="16" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">MONEYBOXX</text>
                </svg>
              </div>

              {/* IDFC First Bank */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="98" height="20" viewBox="0 0 115 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#B71C1C" />
                  <path d="M8 8H16M8 12H13M8 8V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="26" y="12" fill="white" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">IDFC FIRST</text>
                  <text x="26" y="20" fill="white" fontSize="8.5" fontWeight="light" fontFamily="system-ui, sans-serif" letterSpacing="0.02em">Bank</text>
                </svg>
              </div>

              {/* HDFC Bank */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="90" height="20" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" fill="#0D47A1" />
                  <rect x="7" y="7" width="10" height="10" fill="white" />
                  <rect x="11" y="3" width="2" height="18" fill="#0D47A1" />
                  <rect x="3" y="11" width="18" height="2" fill="#0D47A1" />
                  <text x="26" y="16" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.01em">HDFC BANK</text>
                </svg>
              </div>

              {/* Mufin */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="76" height="20" viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#00C853" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 15V9L12 12L16 9V15" stroke="#00C853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="26" y="16" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">MUFIN</text>
                </svg>
              </div>
            </div>

            {/* Wrapper 2 (seamless duplication) */}
            <div className="flex items-center gap-12 pr-12 shrink-0 animate-ticker" aria-hidden="true">
              {/* adani | Capital */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="96" height="20" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18C4 18 8 10 14 10C20 10 22 16 26 16C30 16 32 12 32 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="38" y="16" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="-0.02em">adani</text>
                  <line x1="76" y1="6" x2="76" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
                  <text x="82" y="16" fill="white" fontSize="10" fontWeight="normal" fontFamily="system-ui, sans-serif" opacity="0.8">Capital</text>
                </svg>
              </div>

              {/* Hero Fincorp */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="86" height="20" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L9 6V18L4 20V4Z" fill="#00E676" />
                  <path d="M11 6L16 4V20L11 18V6Z" fill="#00E676" />
                  <text x="22" y="13" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="-0.01em">Hero</text>
                  <text x="22" y="21" fill="white" fontSize="7.5" fontWeight="light" fontFamily="system-ui, sans-serif" letterSpacing="0.08em">FINCORP</text>
                </svg>
              </div>

              {/* Moneyboxx */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="90" height="20" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 14H16V18H4V14Z" stroke="white" strokeWidth="1.5" />
                  <path d="M7 10H13V14H7V10Z" stroke="white" strokeWidth="1.5" />
                  <circle cx="10" cy="6" r="1.5" fill="#E53935" />
                  <text x="22" y="16" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">MONEYBOXX</text>
                </svg>
              </div>

              {/* IDFC First Bank */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="98" height="20" viewBox="0 0 115 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#B71C1C" />
                  <path d="M8 8H16M8 12H13M8 8V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="26" y="12" fill="white" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">IDFC FIRST</text>
                  <text x="26" y="20" fill="white" fontSize="8.5" fontWeight="light" fontFamily="system-ui, sans-serif" letterSpacing="0.02em">Bank</text>
                </svg>
              </div>

              {/* HDFC Bank */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="90" height="20" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" fill="#0D47A1" />
                  <rect x="7" y="7" width="10" height="10" fill="white" />
                  <rect x="11" y="3" width="2" height="18" fill="#0D47A1" />
                  <rect x="3" y="11" width="18" height="2" fill="#0D47A1" />
                  <text x="26" y="16" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.01em">HDFC BANK</text>
                </svg>
              </div>

              {/* Mufin */}
              <div className="flex items-center shrink-0" style={{ height: "20px" }}>
                <svg width="76" height="20" viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#00C853" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 15V9L12 12L16 9V15" stroke="#00C853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="26" y="16" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">MUFIN</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden SVG Water Warp Filter ────────────────── */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id="water-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="1"
              result="noise"
              ref={turbulenceRef}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              ref={displacementRef}
            />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-ticker {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding-right: 3rem;
          animation: ticker 20s linear infinite;
          will-change: transform;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }

        @media (min-width: 900px) {
        .hero-text-col {
            min-height: 800px !important; 
          }
        }

        /* ─── Mobile: stacked layout ─────────────────── */
        @media (max-width: 900px) {
          .hero-section {
            min-height: unset !important;
            display: flex;
            flex-direction: column;
          }

          .hero-text-col {
            min-height: unset !important;
            padding-top: 100px !important;
            padding-bottom: 32px !important;
            order: 1;
            z-index: 20;
            position: relative !important;
          }

          .hero-logo-wrap {
            position: relative !important;
            top: unset !important;
            right: unset !important;
            width: 100% !important;
            height: clamp(280px, 80vw, 480px) !important;
            perspective: 800px;
            order: 2;
            z-index: 10;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .hero-logo-wrap > div,
          .hero-logo-wrap > div > div {
            width: 100% !important;
            height: 100% !important;
          }
        }

        @media (max-width: 640px) {
          .hero-text-col h1 {
            font-size: clamp(32px, 8vw, 52px) !important;
          }
          .hero-scroll-indicator,
          .hero-trust-card {
            display: none !important;
          }
        }

        @media (max-width: 900px) {
          .hero-scroll-indicator {
            display: none !important;
          }
          .hero-trust-card {
            position: relative !important;
            bottom: unset !important;
            right: unset !important;
            width: 100% !important;
            max-width: 380px !important;
            margin: 0 auto 32px auto !important;
            order: 3;
          }
        }
      `}</style>

    </section>
  );
}
