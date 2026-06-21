"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Who We Are", href: "#who-we-are" },
  { label: "What We Do", href: "#what-we-do" },
  { label: "Our Work", href: "#our-work" },
  { label: "Insights", href: "#insights" },
  { label: "Careers", href: "#careers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const hasScrolled = useRef(false); // don't hide until user has scrolled past threshold

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Background blur triggers at 20px
      setScrolled(currentY > 20);

      // Only start tracking hide/show after scrolling past 80px
      if (currentY > 80) {
        hasScrolled.current = true;
      }

      if (hasScrolled.current) {
        if (delta > 6) {
          // Scrolling DOWN â€” hide navbar
          setHidden(true);
          setMenuOpen(false); // close mobile menu when hiding
        } else if (delta < -4) {
          // Scrolling UP â€” reveal navbar
          setHidden(false);
        }
      }

      // At the very top â€” always show
      if (currentY <= 10) {
        setHidden(false);
        hasScrolled.current = false;
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: hidden ? "-100%" : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed top-0 left-0 right-0 z-50 ${scrolled
        ? "bg-[#000000]/90 backdrop-blur-2xl border-b border-white/[0.06]"
        : "bg-transparent"
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Nav inner â€” matches hero content width */}
      <div className="w-full flex items-center justify-between" style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "clamp(16px, 5.5vw, 80px)", paddingRight: "clamp(16px, 5.5vw, 80px)" }}>

        {/* â”€â”€ Logo â”€â”€ */}
        <a
          href="#"
          className="flex items-center gap-[10px] shrink-0"
          aria-label="Yoeki Soft home"
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
        </a>

        {/* â”€â”€ Center nav links â”€â”€ */}
        <div
          className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2"
          role="menubar"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              role="menuitem"
              className="text-[13px] text-[#c8ccd8] hover:text-white transition-colors duration-300 font-normal tracking-[0.01em] whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* â”€â”€ Right CTA â”€â”€ */}
        <div className="hidden md:flex items-center shrink-0">

          <a
            href="#contact"
            className="btn-secondary text-base rounded-full group !text-[13.5px] !font-medium "
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
              <span>Let's Connect</span>
              <span aria-hidden="true">Let's Connect</span>
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

        {/* â”€â”€ Mobile toggle â”€â”€ */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden p-2 text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* â”€â”€ Mobile menu â”€â”€ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-black/98 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="flex flex-col gap-5 px-8 py-7" style={{ padding: "clamp(16px, 5.5vw, 80px)" }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#c8ccd8] hover:text-white text-[14px] font-normal transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div>
                <a
                  href="#contact"
                  className="btn-secondary text-base rounded-full group !text-[13.5px] !font-medium "
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                  }}
                >
                  Let's Connect
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

