"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import IconCloud with no SSR and improved loading
const IconCloud = dynamic(() => import("./IconCloud"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-yellow-400"></div>
    </div>
  ),
});

// Dynamically import Btnform to prevent SSR-related issues
const Btnform = dynamic(() => import("../HomePage/Btnform"), {
  ssr: false,
});

export default function Hero() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop");
  const [scriptsLoaded, setScriptsLoaded] = useState({
    three: false,
    vanta: false,
  });

  // Form state management
  const [showForm, setShowForm] = useState(false);
  const handleButtonClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  // Enhanced screen size detection for better responsive handling
  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    let newSize;

    if (width < 640) newSize = "mobile";
    else if (width < 768) newSize = "sm";
    else if (width < 1024) newSize = "tablet";
    else if (width < 1280) newSize = "laptop";
    else if (width < 1536) newSize = "desktop";
    else newSize = "xl";

    setScreenSize((prev) => (prev !== newSize ? newSize : prev));
  }, []);

  // Enhanced Vanta configuration based on screen size
  const vantaConfig = useMemo(() => {
    const isMobile = ["mobile", "sm"].includes(screenSize);
    const isTablet = screenSize === "tablet";

    return {
      el: null,
      mouseControls: !isMobile,
      touchControls: true,
      gyroControls: false,
      minHeight: isMobile
        ? Math.min(window.innerHeight, 500)
        : isTablet
          ? 400
          : 200,
      minWidth: isMobile
        ? Math.min(window.innerWidth, 400)
        : isTablet
          ? 600
          : 200,
      scale: isMobile ? 0.6 : isTablet ? 0.8 : 1.0,
      scaleMobile: 0.6,
      color: 0x60707,
      shininess: isMobile ? 15 : isTablet ? 25 : 30,
      waveHeight: isMobile ? 8 : isTablet ? 15 : 20,
      waveSpeed: isMobile ? 0.7 : isTablet ? 0.85 : 1.0,
      zoom: isMobile ? 0.5 : isTablet ? 0.6 : 0.65,
    };
  }, [screenSize]);

  // Optimized script loading with caching and error handling
  const loadScript = useCallback(
    (src, name) => {
      return new Promise((resolve, reject) => {
        if (scriptsLoaded[name]) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          if (existingScript.dataset.loaded) {
            setScriptsLoaded((prev) => ({ ...prev, [name]: true }));
            resolve();
          } else {
            existingScript.addEventListener("load", () => {
              setScriptsLoaded((prev) => ({ ...prev, [name]: true }));
              resolve();
            });
          }
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.loaded = "false";

        script.onload = () => {
          script.dataset.loaded = "true";
          setScriptsLoaded((prev) => ({ ...prev, [name]: true }));
          resolve();
        };

        script.onerror = () => {
          console.warn(`Failed to load ${name} script`);
          reject(new Error(`Failed to load ${name}`));
        };

        document.head.appendChild(script);
      });
    },
    [scriptsLoaded]
  );

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    checkScreenSize();
    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [checkScreenSize]);

  // Vanta initialization with cleanup
  useEffect(() => {
    let mounted = true;
    let loadTimeout;

    const initializeVanta = async () => {
      const isMobile = ["mobile", "sm"].includes(screenSize);

      if (isMobile && window.navigator?.connection?.effectiveType === "2g") {
        setVantaLoaded(true);
        return;
      }

      try {
        await Promise.race([
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
            "three"
          ),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          ),
        ]);

        if (!mounted) return;

        await Promise.race([
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js",
            "vanta"
          ),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          ),
        ]);

        if (!mounted || !window.VANTA || !vantaRef.current) return;

        if (vantaEffect.current) {
          vantaEffect.current.destroy();
        }

        vantaEffect.current = window.VANTA.WAVES({
          ...vantaConfig,
          el: vantaRef.current,
        });

        if (mounted) {
          setVantaLoaded(true);
        }
      } catch (error) {
        console.warn("Vanta.js initialization failed:", error);
        if (mounted) {
          setVantaLoaded(true);
        }
      }
    };

    if ("requestIdleCallback" in window) {
      loadTimeout = requestIdleCallback(initializeVanta, { timeout: 2000 });
    } else {
      loadTimeout = setTimeout(initializeVanta, 100);
    }

    return () => {
      mounted = false;
      if ("requestIdleCallback" in window) {
        cancelIdleCallback(loadTimeout);
      } else {
        clearTimeout(loadTimeout);
      }
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [vantaConfig, loadScript]);

  // Dynamic icon cloud props based on screen size - SIGNIFICANTLY INCREASED MOBILE SIZES
  const getIconCloudProps = useMemo(() => {
    const props = {
      mobile: {
        size: 25, // Increased from 35 to 65 (85% increase)
        height: 220, // Increased from 280 to 350
        rotationSpeed: 0.6,
        radius: 180, // Added radius for better control
        maxSpeed: 0.05, // Added for smoother animation
        initialSpeed: 0.02, // Added for initial animation speed
      },
      sm: {
        size: 30, // Increased from 40 to 70 (75% increase)
        height: 260, // Increased from 320 to 380
        rotationSpeed: 0.65,
        radius: 190,
        maxSpeed: 0.05,
        initialSpeed: 0.02,
      },
      tablet: {
        size: 45,
        height: 300,
        rotationSpeed: 0.75,
        radius: 150,
        maxSpeed: 0.04,
        initialSpeed: 0.02,
      },
      laptop: {
        size: 42,
        height: 350,
        rotationSpeed: 0.8,
        radius: 170,
        maxSpeed: 0.04,
        initialSpeed: 0.02,
      },
      desktop: {
        size: 48,
        height: 400,
        rotationSpeed: 0.85,
        radius: 200,
        maxSpeed: 0.04,
        initialSpeed: 0.02,
      },
      xl: {
        size: 55,
        height: 450,
        rotationSpeed: 0.9,
        radius: 225,
        maxSpeed: 0.04,
        initialSpeed: 0.02,
      },
    };

    return {
      ...props[screenSize],
      bgColor: "transparent",
      glowEffect: true,
      // Additional props for better visibility
      iconOpacity: 0.9,
      cloudRadius: props[screenSize].radius || 180,
      minDistance: 50,
      maxDistance: props[screenSize].radius || 180,
    };
  }, [screenSize]);

  return (
    <div className="relative overflow-hidden bg-[#1a1f36] min-h-screen">
      {/* Vanta.js WAVES Background */}
      <div
        ref={vantaRef}
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${
          vantaLoaded ? "opacity-100" : "opacity-0"
        } w-full h-full`}
        style={{ willChange: "opacity" }}
      />

      {/* Fallback gradient background */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br from-[#1a1f36] via-[#2a2d47] to-[#1a1f36] w-full h-full transition-opacity duration-500 ${
          vantaLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{ willChange: "opacity" }}
      />

      {/* Floating particles for enhanced visual effect */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Desktop/Laptop Icon Cloud */}
      <div className="absolute right-18 sm:right-20 md:right-24 lg:right-28 xl:right-32 top-72 transform -translate-y-1/2 w-1/3 sm:w-1/4 md:w-1/3 lg:w-2/5 xl:w-1/3 z-10 opacity-90 hidden lg:block">
        <div
          className="flex items-center justify-center h-full"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg">
            <IconCloud {...getIconCloudProps} />
          </div>
        </div>
      </div>

      <main className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              {/* Brand Badge */}
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-sm">
                <span className="text-yellow-400 text-xs sm:text-sm font-medium">
                  🏆 #1 SAP Training Institute
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  <span className="mr-2">Connecting</span>
                  <span className="text-yellow-400">Dots ERP</span>
                </h1>

                {/* Animated accent line */}
                <div className="relative">
                  <div className="w-16 sm:w-20 md:w-24 lg:w-28 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-4 h-1 bg-white rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Transform your career with industry-leading SAP training.
                <span className="text-yellow-400 font-semibold">
                  {" "}
                  Expert-led courses
                </span>{" "}
                with
                <span className="text-yellow-400 font-semibold">
                  {" "}
                  hands-on experience
                </span>{" "}
                to excel in the ERP industry.
              </p>

              {/* Mobile/Tablet Icon Cloud - Much larger container for better visibility */}
              <div className="block pt-16 lg:hidden">
                <div className="flex justify-center">
                  <div
                    className="relative"
                    style={{
                      width: `${Math.min(getIconCloudProps.height * 1.4, 400)}px`, // Even larger container
                      height: `${getIconCloudProps.height + 40}px`, // Added extra padding
                      transform: "translateZ(0)",
                    }}
                  >
                    <IconCloud {...getIconCloudProps} />
                  </div>
                </div>
              </div>

              {/* Stats Section - Enhanced and Compact */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6">
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    No.1
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-400 leading-tight">
                    Training Center
                  </div>
                </div>

                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    5K+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-400 leading-tight">
                    Students Trained
                  </div>
                </div>

                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                    10+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-400 leading-tight">
                    Years Experience
                  </div>
                </div>
              </div>

              {/* CTA Button - Enhanced */}
              <div className="flex justify-center md:justify-end lg:justify-end xl:justify-end sm:flex-row gap-4 pt-2">
                <button
                  className="group relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transform hover:scale-105 hover:-translate-y-1 active:scale-95"
                  onClick={handleButtonClick}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>

                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    🚀 Enroll Now
                  </span>

                  <svg
                    className="w-5 h-5 relative z-10 transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-yellow-400/50 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>100% Placement Support</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>Industry Experts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>Live Projects</span>
                </div>
              </div>
            </div>

            {/* Right Content - Empty for mobile, reserved for desktop */}
            <div className="hidden lg:block">
              {/* This space is used by the absolutely positioned desktop icon cloud */}
            </div>
          </div>
        </div>
      </main>

      {/* Form Modal with proper z-index and backdrop */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseForm}
          ></div>

          {/* Modal Content */}
          <div className="relative z-[10000] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Btnform onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
}
