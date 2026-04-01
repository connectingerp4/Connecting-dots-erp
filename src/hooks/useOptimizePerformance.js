"use client";

import { useEffect } from "react";

/**
 * Globally optimizes scroll + resize behavior
 * to reduce forced reflows, layout thrashing, and TBT.
 * Safe with Next.js App Router + Partytown scripts.
 */

export default function useOptimizePerformance() {

  // 🚀 Throttle Scroll + Avoid Layout Thrash
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Store only values, do NOT change layout!
          document.documentElement.dataset.scrollY = String(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // 📏 Debounce Resize Events
  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.dataset.windowWidth = String(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  // ✨ Set initial measurement instantly on mount
  useEffect(() => {
    document.documentElement.dataset.scrollY = String(window.scrollY);
    document.documentElement.dataset.windowWidth = String(window.innerWidth);
  }, []);
}
