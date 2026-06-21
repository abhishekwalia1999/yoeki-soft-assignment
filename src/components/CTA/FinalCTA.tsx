"use client";

import { useEffect, useRef } from "react";
import { motion, px, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value: "150+",
    label: "Projects Delivered",
    icon: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Enterprise Clients",
    icon: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "99.9%",
    label: "Uptime SLA",
    icon: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    ),
  },
  {
    value: "8+",
    label: "Years of Excellence",
    icon: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!sectionRef.current) return;

    // Headline character reveal
    const chars = sectionRef.current.querySelectorAll(".cta-char");
    gsap.set(chars, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.025,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const headlineLines = ["Let's Build", "What's Next"];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-20 md:py-32 px-8 md:px-12 lg:px-16"
      style={{ background: "#000000", }}
    >
      <div
        className="relative z-10 mx-auto w-full py-16 px-6 sm:py-24 sm:px-12 lg:py-28 lg:px-16  text-center"
        style={{
          boxShadow: "0 24px 80px -20px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)",
          padding: "clamp(40px, 8vw, 96px) clamp(20px, 5.5vw, 88px) clamp(44px, 8vw, 100px)",
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0 w-full">
          {/* Large glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "800px",
              height: "400px",
              background: "radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "energyPulse 6s ease-in-out infinite",
            }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(37,99,235,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Corner glows */}
          <div
            className="absolute top-0 left-0 w-64 h-64"
            style={{
              background: "radial-gradient(ellipse at top left, rgba(56,189,248,0.06) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64"
            style={{
              background: "radial-gradient(ellipse at bottom right, rgba(129,140,248,0.06) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-mono uppercase tracking-[0.25em] flex items-center justify-center gap-2"
            style={{ color: "#38BDF8", marginBottom: "32px" }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#38BDF8", boxShadow: "0 0 6px #38BDF8", animation: "energyPulse 2s infinite" }}
            />
            Start Your Journey
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#38BDF8", boxShadow: "0 0 6px #38BDF8", animation: "energyPulse 2s infinite 0.5s" }}
            />
          </motion.p>

          {/* Main headline */}
          <h2
            ref={headlineRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.1]"
            style={{ marginBottom: "48px" }}
          >
            {headlineLines.map((line, li) => (
              <span key={li} className="block">
                {line.split(" ").map((word, wi, arr) => (
                  <span
                    key={wi}
                    className="inline-block whitespace-nowrap"
                    style={{ marginRight: wi < arr.length - 1 ? "16px" : "0" }}
                  >
                    {word.split("").map((char, ci) => (
                      <span
                        key={ci}
                        className="cta-char inline-block"
                        style={{
                          opacity: 0,
                          ...(line === "What's Next" ? {
                            background: "linear-gradient(135deg, #38BDF8 0%, #2563EB 50%, #818CF8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          } : {}),
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl leading-relaxed"
            style={{ color: "#94A3B8", marginBottom: "24px" }}
          >
            Partner with Yoeki to create digital products that scale, systems that <br /> last, and experiences that matter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
            style={{ marginBottom: "96px" }}
          >
            <a
              href="mailto:hello@yoekisoft.com"
              className="flex items-center gap-[7px] text-white text-[13.5px] font-medium tracking-[0.01em] transition-all duration-300 hover:opacity-90 group"
              style={{
                background: "#4f5dff",
                borderRadius: 999,
                padding: "12px 24px",
                boxShadow: "0 0 28px rgba(79,93,255,0.25)",
              }}
            >
              <div className="btn-text-flip">
                <span>Start Your Journey</span>
                <span aria-hidden="true">Start Your Journey</span>
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
              className="btn-secondary text-base rounded-full group text-[13.5px] font-medium tracking-[0.01em]"
              style={{
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                padding: "12px 24px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(110, 123, 255, 0.5)";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(110, 123, 255, 0.08)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255, 255, 255, 0.15)";
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              <div className="btn-text-flip">
                <span>View Case Studies</span>
                <span aria-hidden="true">View Case Studies</span>
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
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 lg:divide-x lg:divide-white/[0.06] mt-24"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-4 text-center">
                {/* Icon Box */}
                <div
                  className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.1)]"
                  style={{ marginBottom: "24px" }}
                >
                  {stat.icon}
                </div>
                {/* Value */}
                <p
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #FFFFFF, #94A3B8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "8px",
                  }}
                >
                  {stat.value}
                </p>
                {/* Label */}
                <p className="text-xs font-mono" style={{ color: "#94A3B8" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer strip */}
      <div
        className="relative z-10 mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "12px 80px"
        }}
      >
        <img
          src="/whiteLogo.png"
          alt="Yoeki"
          style={{
            width: "80px",
            height: "auto",
            objectFit: "contain",
          }}
        />


        <p className="text-xs text-center" style={{ color: "#334155" }}>
          © {new Date().getFullYear()} Yoeki Soft Pvt. Ltd. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs transition-colors duration-200 hover:text-white"
              style={{ color: "#334155" }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

    </section>
  );
}
