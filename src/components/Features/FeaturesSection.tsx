"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Chapter1 = lazy(() => import("./Chapter1Transform"));
const Chapter2 = lazy(() => import("./Chapter2Engineer"));
const Chapter3 = lazy(() => import("./Chapter3Accelerate"));

const CHAPTERS = [
  {
    id: 1,
    number: "01",
    title: "Discover",
    tagline: "Ideas and systems connect.",
    description:
      "Research, consulting, and digital strategy. We map complex business landscapes to uncover opportunities, define product vision, and connect the right ideas to the right systems.",
    keywords: ["Digital Strategy", "Research", "Consulting"],
    accentColor: "#6E7BFF",
    accentLight: "rgba(110,123,255,0.10)",
    accentBorder: "rgba(110,123,255,0.18)",
    Visual: Chapter1,
  },
  {
    id: 2,
    number: "02",
    title: "Engineer",
    tagline: "Blueprint evolves into digital product.",
    description:
      "Software engineering, product development, and platform creation. Our teams build scalable architecture and ship production-grade systems that evolve with your business.",
    keywords: ["Software Engineering", "Product Dev", "Platforms"],
    accentColor: "#818CF8",
    accentLight: "rgba(129,140,248,0.10)",
    accentBorder: "rgba(129,140,248,0.18)",
    Visual: Chapter2,
  },
  {
    id: 3,
    number: "03",
    title: "Accelerate",
    tagline: "Network expands globally.",
    description:
      "Scale operations through automation and innovation. We embed AI-powered workflows, accelerate deployment pipelines, and help your organization move at the speed of the market.",
    keywords: ["AI Automation", "Global Scale", "Innovation"],
    accentColor: "#A5B4FC",
    accentLight: "rgba(165,180,252,0.10)",
    accentBorder: "rgba(165,180,252,0.20)",
    Visual: Chapter3,
  },
];

const SCROLL_PER_CHAPTER = 700;

export default function FeaturesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    if (!wrapperRef.current || !stickyRef.current) return;

    const totalScroll = SCROLL_PER_CHAPTER * CHAPTERS.length;

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: `+=${totalScroll}`,
      pin: stickyRef.current,
      pinSpacing: true,
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const rawChapter = progress * CHAPTERS.length;
        const chapter = Math.min(Math.floor(rawChapter), CHAPTERS.length - 1);
        const chapterProg = rawChapter - Math.floor(rawChapter);

        setActiveChapter(chapter);
        setChapterProgress(chapterProg);

        // Progress bar
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, {
            scaleY: progress,
            transformOrigin: "top",
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const activeChapterData = CHAPTERS[activeChapter];

  return (
    <div
      ref={wrapperRef}
      id="solutions"
      style={{ height: `${SCROLL_PER_CHAPTER * CHAPTERS.length + vh}px` }}
    >
      {/* Sticky container */}
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden"
        style={{
          height: "100vh",
          background: "linear-gradient(175deg, #F8FAFF 0%, #EEF2FF 60%, #E0E7FF 100%)",
        }}
      >
        {/* Ambient mesh blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="mesh-blob"
            style={{
              width: 600,
              height: 600,
              right: "-5%",
              top: "-10%",
              background: `radial-gradient(ellipse, ${activeChapterData?.accentColor}18 0%, transparent 70%)`,
              transition: "background 1s ease",
              animationDelay: "0s",
            }}
          />
          <div
            className="mesh-blob"
            style={{
              width: 400,
              height: 400,
              left: "-8%",
              bottom: "0",
              background: "radial-gradient(ellipse, rgba(199,210,254,0.15) 0%, transparent 70%)",
              animationDelay: "-5s",
            }}
          />
        </div>

        {/* Section header */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <p
            className="text-[11px] font-mono uppercase tracking-[0.22em] mb-2"
            style={{ color: "#6E7BFF" }}
          >
            Our Process
          </p>
          <h2 className="text-xl font-bold" style={{ color: "#1E293B" }}>
            A Story in Three Acts
          </h2>
        </div>

        {/* Progress indicator (right side) */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4"
          aria-label="Chapter progress"
          role="progressbar"
        >
          <div
            className="relative w-0.5 h-16 rounded-full overflow-hidden"
            style={{ background: "rgba(110,123,255,0.12)" }}
          >
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full h-full rounded-full"
              style={{
                background: "linear-gradient(to bottom, #6E7BFF, #A5B4FC)",
                transform: "scaleY(0)",
                transformOrigin: "top",
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {CHAPTERS.map((ch, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="transition-all duration-500"
                  style={{
                    width: activeChapter === i ? "18px" : "5px",
                    height: "5px",
                    borderRadius: "3px",
                    background:
                      activeChapter === i ? ch.accentColor : "rgba(110,123,255,0.2)",
                    boxShadow:
                      activeChapter === i
                        ? `0 0 8px ${ch.accentColor}80`
                        : "none",
                  }}
                />
                {activeChapter === i && (
                  <span
                    className="text-[9px] font-mono hidden lg:block"
                    style={{ color: ch.accentColor }}
                  >
                    {ch.number}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter panels (all stacked, driven by scroll progress state) */}
        {CHAPTERS.map((chapter, i) => {
          const Visual = chapter.Visual;

          // Calculate opacity and translation based on progress
          const progress = (activeChapter + chapterProgress) / CHAPTERS.length;
          const start = i / CHAPTERS.length;
          const end = (i + 1) / CHAPTERS.length;
          const buffer = 0.06;

          let alpha = 0;
          if (i === 0 && progress < end - buffer) {
            const fadeIn = Math.min(1, progress / 0.05);
            const fadeOut =
              progress > end - buffer * 2
                ? Math.max(0, 1 - (progress - (end - buffer * 2)) / (buffer * 2))
                : 1;
            alpha = fadeIn * fadeOut;
          } else if (progress >= start - buffer && progress <= end + buffer) {
            const localP = (progress - start) / (end - start);
            alpha = Math.sin(Math.max(0, Math.min(1, localP)) * Math.PI);
          }

          const y = (1 - Math.max(0, Math.min(1, (progress - start + buffer) / 0.2))) * 28;

          return (
            <div
              key={chapter.id}
              id={`chapter-panel-${i}`}
              className="absolute inset-0 flex items-center pt-20"
              style={{
                opacity: alpha,
                transform: `translateY(${y}px)`,
                pointerEvents: i === activeChapter ? "auto" : "none",
              }}
              aria-hidden={i !== activeChapter}
            >
              <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left: Text */}
                <div className="flex flex-col gap-5">
                  {/* Chapter number */}
                  <div className="flex items-center gap-3">
                    <span
                      className="text-7xl font-black font-mono leading-none"
                      style={{ color: chapter.accentColor, opacity: 0.1 }}
                    >
                      {chapter.number}
                    </span>
                    <div
                      className="h-px w-10"
                      style={{ background: chapter.accentBorder }}
                    />
                  </div>

                  <p
                    className="text-xs font-mono uppercase tracking-[0.2em]"
                    style={{ color: chapter.accentColor }}
                  >
                    {chapter.tagline}
                  </p>

                  <h2
                    className="text-5xl sm:text-6xl font-extrabold tracking-tight"
                    style={{ color: "#1E293B", lineHeight: 1.05 }}
                  >
                    {chapter.title}
                  </h2>

                  <p
                    className="text-base leading-relaxed max-w-md"
                    style={{ color: "#475569" }}
                  >
                    {chapter.description}
                  </p>

                  {/* Keyword tags */}
                  <div className="flex flex-wrap gap-2">
                    {chapter.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium"
                        style={{
                          color: chapter.accentColor,
                          border: `1px solid ${chapter.accentBorder}`,
                          background: chapter.accentLight,
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Chapter micro-progress */}
                  <div className="flex items-center gap-3">
                    <div
                      className="h-0.5 flex-1 max-w-[100px] rounded-full overflow-hidden"
                      style={{ background: "rgba(110,123,255,0.12)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: activeChapter === i ? `${chapterProgress * 100}%` : "0%",
                          background: chapter.accentColor,
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: `${chapter.accentColor}80` }}
                    >
                      {chapter.number} / {String(CHAPTERS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Right: Chapter visual */}
                <div className="relative h-72 lg:h-96">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-t-transparent"
                          style={{
                            borderColor: `${chapter.accentColor}40`,
                            borderTopColor: chapter.accentColor,
                            animation: "spin 1.5s linear infinite",
                          }}
                          aria-label="Loading"
                        />
                      </div>
                    }
                  >
                    <Visual />
                  </Suspense>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom fade to white */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, transparent, #F8FAFF)" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
