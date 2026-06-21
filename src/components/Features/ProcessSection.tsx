"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* â”€â”€â”€ Slide Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const slides = [
  {
    id: 0,
    name: "Discover",
    titleHtml: "<i>Dis</i>cover",
    description:
      "Understanding business challenges and identifying opportunities. We research, analyze, and map complex digital landscapes to uncover the right path forward.",
    mainImg: "/process_discover_main.jpg",
    subImg: "/process_discover_sub.jpg",
    accentColor: "#6E7BFF",
    features: [
      "Business Landscape Analysis",
      "Digital Strategy",
      "Opportunity Mapping",
      "Consulting & Research",
    ],
  },
  {
    id: 1,
    name: "Engineer",
    titleHtml: "<i>Engi</i>neer",
    description:
      "Building scalable digital products and enterprise solutions. Our engineers craft production-grade systems, platforms, and APIs designed to evolve with your business.",
    mainImg: "/process_engineer_main.jpg",
    subImg: "/process_engineer_sub.jpg",
    accentColor: "#818CF8",
    features: [
      "Software Engineering",
      "Product Development",
      "Enterprise Platforms",
      "Scalable Architecture",
    ],
  },
  {
    id: 2,
    name: "Accelerate",
    titleHtml: "<i>Accel</i>erate",
    description:
      "Driving growth through automation, optimization, and innovation. We embed AI-powered workflows, accelerate pipelines, and help your organization move at market speed.",
    mainImg: "/process_accelerate_main.jpg",
    subImg: "/process_accelerate_sub.jpg",
    accentColor: "#A5B4FC",
    features: [
      "AI & Automation",
      "Growth Optimization",
      "Deployment Pipelines",
      "Innovation at Scale",
    ],
  },
];


export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();


      mm.add("(min-width: 1024px)", () => {
        // Master scroll timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "process-pin",
            trigger: containerRef.current,
            start: "top top",
            end: "+=200%", // stays pinned for 2 full viewport scrolls (1 per transition)
            scrub: 1,
            pin: pinRef.current, // Pin the inner element to prevent wrapping the root component
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(
                Math.floor(self.progress * slides.length),
                slides.length - 1
              );
              setActiveSlide(idx);
            },
          },
        });

        // Configure initial states for overlay elements (override CSS transition effects on desktop)
        gsap.set(".proc-floating-title", { transition: "none" });
        gsap.set(".proc-slide-content", { transition: "none" });
        gsap.set(".proc-indicator-item", { transition: "none" });

        const duration = 0.5;

        // Slide 0 â†’ 1 transition (t = 0.75 to 1.25)
        tl.to(".proc-main-image-wrap-1", { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration }, 0.75)
          .to(".proc-floating-title-0", { opacity: 0, y: -80, ease: "power2.inOut", duration }, 0.75)
          .to(".proc-floating-title-1", { opacity: 1, y: 0, ease: "power2.inOut", duration }, 0.75)
          .to(".proc-slide-content-0", { opacity: 0, y: -40, autoAlpha: 0, ease: "power2.inOut", duration }, 0.75)
          .to(".proc-slide-content-1", { opacity: 1, y: 0, autoAlpha: 1, ease: "power2.inOut", duration }, 0.75)
          .to(".proc-indicator-item-0", { opacity: 0.35, x: 0, color: "rgba(165,180,252,0.5)", ease: "power2.inOut", duration }, 0.75)
          .to(".proc-indicator-item-1", { opacity: 1, x: 12, color: "#ffffff", ease: "power2.inOut", duration }, 0.75);

        // Slide 1 â†’ 2 transition (t = 1.75 to 2.25)
        tl.to(".proc-main-image-wrap-2", { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration }, 1.75)
          .to(".proc-floating-title-1", { opacity: 0, y: -80, ease: "power2.inOut", duration }, 1.75)
          .to(".proc-floating-title-2", { opacity: 1, y: 0, ease: "power2.inOut", duration }, 1.75)
          .to(".proc-slide-content-1", { opacity: 0, y: -40, autoAlpha: 0, ease: "power2.inOut", duration }, 1.75)
          .to(".proc-slide-content-2", { opacity: 1, y: 0, autoAlpha: 1, ease: "power2.inOut", duration }, 1.75)
          .to(".proc-indicator-item-1", { opacity: 0.35, x: 0, color: "rgba(165,180,252,0.5)", ease: "power2.inOut", duration }, 1.75)
          .to(".proc-indicator-item-2", { opacity: 1, x: 12, color: "#ffffff", ease: "power2.inOut", duration }, 1.75);

        // Dummy tween to stretch timeline duration to exactly 3.0 units
        tl.set({}, {}, 3.0);

        // Background color transition for desktop (placed after pinning timeline to measure total height correctly)
        const bgTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 40%", // Ends when section bottom is 40% from top of viewport (i.e. moved 60% up)
            scrub: 1.2,
          }
        });
        bgTl.to([containerRef.current, rightColRef.current], {
          backgroundColor: "#FAF9F6",
          duration: 0.24,
          ease: "power1.out"
        })
          .to([containerRef.current, rightColRef.current], {
            backgroundColor: "#FAF9F6",
            duration: 0.59,
            ease: "none"
          })
          .to([containerRef.current, rightColRef.current], {
            backgroundColor: "#000000",
            duration: 0.17,
            ease: "power1.in"
          });
      });

      /* ——— Mobile (< 1024px): tab-click driven, no scroll triggers ── */
      mm.add("(max-width: 1023px)", () => {
        // No scroll triggers needed — images are hidden, slides are switched by tab clicks.
        // Background color transition only:
        const bgTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1.2,
          }
        });
        bgTl.to([containerRef.current, rightColRef.current], {
          backgroundColor: "#FAF9F6",
          duration: 0.24,
          ease: "power1.out"
        })
          .to([containerRef.current, rightColRef.current], {
            backgroundColor: "#FAF9F6",
            duration: 0.59,
            ease: "none"
          })
          .to([containerRef.current, rightColRef.current], {
            backgroundColor: "#000000",
            duration: 0.17,
            ease: "power1.in"
          });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleIndicatorClick = (index: number) => {
    if (window.innerWidth >= 1024) {
      const trigger = ScrollTrigger.getById("process-pin");
      if (trigger) {
        const start = trigger.start;
        const end = trigger.end;
        const targetScroll = start + (index / (slides.length - 1)) * (end - start);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    } else {
      // Mobile: directly switch slide â€” no scrolling needed (images hidden)
      setActiveSlide(index);
    }
  };

  return (
    <section
      ref={containerRef}
      id="solutions"
      style={{ position: "relative", width: "100%", backgroundColor: "#000000" }}
    >
      <div
        ref={pinRef}
        className="proc-pinned"
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          justifyContent: "space-between",
        }}
      >
        {/* â•â• LEFT COL: Full-bleed stacked images â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          className="proc-left-col"
          style={{
            width: "50%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Stacked images with clip-path wipe reveal */}
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`proc-main-image-wrap proc-main-image-wrap-${index}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: index + 1,
                  clipPath:
                    index === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  willChange: "clip-path",
                }}
              >
                <img
                  src={slide.mainImg}
                  alt={slide.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.75) saturate(1.1)",
                  }}
                />
              </div>
            ))}

            {/* Bottom gradient fade to black */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "60%",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.96) 100%)",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Bottom-left slide indicator nav */}
          <div
            className="proc-desktop-indicator"
            style={{
              position: "absolute",
              bottom: "4rem",
              left: "clamp(1.5rem, 5vw, 5rem)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                color: slides[activeSlide]?.accentColor ?? "#6E7BFF",
                letterSpacing: "0.18em",
                fontWeight: 700,
                marginBottom: "0.4rem",
                transition: "color 0.5s ease",
              }}
            >
              Our Process
            </span>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleIndicatorClick(index)}
                className={`proc-indicator-item proc-indicator-item-${index} ${activeSlide === index ? "active" : ""
                  }`}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: index === 0 ? "#ffffff" : "rgba(165,180,252,0.5)",
                  opacity: index === 0 ? 1 : 0.35,
                  transform: index === 0 ? "translateX(12px)" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  outline: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.name}
              </button>
            ))}
          </div>
        </div>

        {/* â•â• RIGHT COL: Content panel â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          ref={rightColRef}
          className="proc-right-col"
          style={{
            width: "38%",
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "4rem clamp(1.5rem, 4vw, 5rem) 4rem 2rem",
            backgroundColor: "#000000",
            boxSizing: "border-box",
          }}
        >
          {/* Mobile tab bar â€” shown only on <1024px */}
          <div className="proc-mobile-tabs">
            <span className="proc-mobile-label">Our Process</span>
            <div className="proc-mobile-tab-btns">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => handleIndicatorClick(index)}
                  className={`proc-mobile-tab-btn${activeSlide === index ? " active" : ""}`}
                  style={{ "--accent": slide.accentColor } as React.CSSProperties}
                >
                  {slide.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stacked content panels */}
          <div style={{ position: "relative", flex: 1, marginTop: "3rem", width: "100%" }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`proc-slide-content proc-slide-content-${index} ${activeSlide === index ? "active" : ""
                  }`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: index === 0 ? "visible" : "hidden",
                  transform: index === 0 ? "none" : "translateY(50px)",
                }}
              >
                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.975rem",
                    lineHeight: 1.65,
                    color: "#334155",
                    maxWidth: "90%",
                    marginBottom: "3rem",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {slide.description}
                </p>

                {/* Sub-details: mini image + features list */}
                <div style={{ display: "flex", gap: "3rem", width: "100%", alignItems: "flex-start" }}>
                  {/* Mini thumbnail */}
                  <div
                    style={{
                      width: "10rem",
                      height: "13rem",
                      overflow: "hidden",
                      flexShrink: 0,
                      borderRadius: 4,
                      border: `1px solid ${slide.accentColor}25`,
                      boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${slide.accentColor}15`,
                      position: "relative",
                    }}
                  >
                    <img
                      src={slide.subImg}
                      alt={slide.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.85) saturate(1.1)",
                      }}
                    />
                  </div>

                  {/* Features / capabilities list */}
                  <div
                    style={{
                      flex: 1,
                      borderTop: `1px solid rgba(165,180,252,0.12)`,
                    }}
                  >
                    {slide.features.map((feat, fIndex) => (
                      <div
                        key={fIndex}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1rem 0",
                          borderBottom: "1px solid rgba(165,180,252,0.08)",
                          color: "#475569",
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                          cursor: "default",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.color = slide.accentColor;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.color =
                            "#475569";
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "-0.01em" }}>
                          {feat}
                        </span>
                        <div style={{ width: "1rem", height: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M2 14L14 2M14 2H6M14 2V10"
                              stroke={slide.accentColor}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom-right pill CTA */}
          <a
            href="#contact"
            className="group"
            style={{
              alignSelf: "flex-end",
              marginTop: "auto",
              background: slides[activeSlide]?.accentColor ?? "#6E7BFF",
              color: "white",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              boxShadow: `0 4px 24px ${slides[activeSlide]?.accentColor ?? "#6E7BFF"}30`,
              transition: "background 0.5s ease, box-shadow 0.5s ease, transform 0.3s ease",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <div className="btn-text-flip">
              <span>Let&apos;s Build Together</span>
              <span aria-hidden="true">Let&apos;s Build Together</span>
            </div>
            <svg
              className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 14L14 2M14 2H6M14 2V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* â•â• FLOATING TITLE OVERLAY (Z-axis center, overlaps both cols) â•â• */}
        <div
          className="proc-floating-title-wrap"
          style={{
            position: "absolute",
            bottom: "4rem",
            left: "32%",
            width: "62%",
            height: "14rem",
            zIndex: 30,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {slides.map((slide, index) => (
            <h2
              key={slide.id}
              className={`proc-floating-title proc-floating-title-${index}`}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                fontFamily: "var(--font-playfair), var(--font-serif), Georgia, serif",
                fontSize: "clamp(5rem, 9vw, 8.5rem)",
                lineHeight: 0.85,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                color: "#1E293B",
                opacity: index === 0 ? 1 : 0,
                transform: index === 0 ? "none" : "translateY(100px)",
              }}
              dangerouslySetInnerHTML={{ __html: slide.titleHtml }}
            />
          ))}
        </div>
      </div>

      {/* Scoped CSS styling for desktop/mobile transition properties */}
      <style>{`
        /* â”€â”€ Shared â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .proc-slide-content {
          position: absolute;
          top: 5%;
          left: 0;
          width: 100%;
          height: 90%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease;
          pointer-events: none;
        }

        .proc-slide-content.active {
          pointer-events: auto !important;
        }

        .proc-floating-title {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .proc-indicator-item {
          transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s ease;
        }

        .proc-indicator-item.active {
          color: #ffffff !important;
          opacity: 1 !important;
          transform: translateX(12px) !important;
        }

        .proc-floating-title i {
          font-style: italic;
          color: ${slides[activeSlide]?.accentColor ?? "#6E7BFF"};
        }

        /* Mobile tab bar â€” hidden on desktop */
        .proc-mobile-tabs {
          display: none;
        }

        /* â”€â”€ Mobile: < 1024px â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        @media (max-width: 1023px) {

          /* Section container: single viewport, no scroll */
          #solutions {
            max-height: 100vh !important;
            overflow: hidden !important;
          }

          /* Pinned wrapper: full viewport, centered */
          .proc-pinned {
            height: 80vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Hide image column & floating title */
          .proc-left-col {
            display: none !important;
          }

          .proc-floating-title-wrap {
            display: none !important;
          }

          /* Right col becomes full viewport panel */
          .proc-right-col {
            width: 100% !important;
            height: 100% !important;
            padding: 2rem 1.5rem 1.5rem !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          /* Slide content: absolute stacking, tab-switch driven */
          .proc-slide-content {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            padding: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(24px) !important;
            pointer-events: none !important;
            transition: opacity 0.45s ease, transform 0.45s ease, visibility 0.45s ease !important;
          }

          .proc-slide-content.active {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            pointer-events: auto !important;
          }

          /* Content wrapper: takes remaining height */
          .proc-right-col > div:nth-child(2) {
            position: relative;
            flex: 1;
            width: 100%;
            overflow: hidden;
            margin-top: 0 !important;
          }

          /* Mobile tab bar */
          .proc-mobile-tabs {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            flex-shrink: 0;
            margin-bottom: 1.5rem;
          }

          .proc-mobile-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 700;
            color: ${slides[activeSlide]?.accentColor ?? "#6E7BFF"};
            font-family: var(--font-inter), system-ui, sans-serif;
            margin-bottom: 0.25rem;
            transition: color 0.4s ease;
          }

          .proc-mobile-tab-btns {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .proc-mobile-tab-btn {
            background: rgba(112, 112, 112, 0.15);
            border: 1px solid rgba(255,255,255,0.1);
            color: rgba(66, 69, 80, 0.55);
            font-family: var(--font-inter), system-ui, sans-serif;
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: -0.01em;
            padding: 0.45rem 1rem;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
          }

          .proc-mobile-tab-btn.active {
            background: var(--accent) !important;
            border-color: var(--accent) !important;
            color: #ffffff !important;
            box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 40%, transparent);
          }

          /* CTA: full-width on mobile */
          .proc-right-col > a {
            align-self: stretch !important;
            justify-content: center !important;
            margin-top: 1.5rem !important;
            flex-shrink: 0 !important;
          }

          /* Description: tighter on small screens */
          .proc-slide-content p {
            font-size: 0.875rem !important;
            margin-bottom: 1.5rem !important;
            max-width: 100% !important;
          }

          /* Sub-details: hide thumbnail on very small, tighten gap */
          .proc-slide-content > div > div:first-child {
            width: 7rem !important;
            height: 9rem !important;
          }

          .proc-slide-content > div {
            gap: 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          /* Hide thumbnail entirely on tiny screens to save space */
          .proc-slide-content > div > div:first-child {
            width: 6rem !important;
            height: 8rem !important;
          }
 
        }
      `}</style>
    </section>
  );
}
