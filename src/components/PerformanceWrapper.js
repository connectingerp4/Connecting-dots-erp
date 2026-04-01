"use client";

import { useEffect } from "react";

/**
 * Client-side wrapper component for performance optimization
 * Handles scroll throttling, resize debouncing, and DOM writes
 */
export default function PerformanceWrapper({ children }) {
  useEffect(() => {
    let ticking = false;

    // Scroll Throttle (Prevents layout thrashing)
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.body.dataset.scrollY = window.scrollY.toString();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let resizeTimeout = null;

    // Resize Debounce (Prevents repeated reflows)
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        document.body.dataset.windowWidth = window.innerWidth.toString();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Initial layout update
    const updateLayout = () => {
      document.body.dataset.scrollY = window.scrollY.toString();
      document.body.dataset.windowWidth = window.innerWidth.toString();
    };

    const raf = requestAnimationFrame(updateLayout);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <>{children}</>;
}
