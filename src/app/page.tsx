"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dynamically import heavy components (no SSR for WebGL/GSAP)
const HeroSection = dynamic(() => import("@/components/Hero/HeroSection"), {
  ssr: false,
});
const ProcessSection = dynamic(
  () => import("@/components/Features/ProcessSection"),
  { ssr: false }
);
const FinalCTA = dynamic(() => import("@/components/CTA/FinalCTA"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis frame loop with GSAP ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return (
    <main style={{ background: "#000000" }}>
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <FinalCTA />
    </main>
  );
}
