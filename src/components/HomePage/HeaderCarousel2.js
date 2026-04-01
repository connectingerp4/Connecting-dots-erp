"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatedBeamDemo } from "../magicui/beam";
import Image from 'next/image';

const CareerMentorsComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationState, setAnimationState] = useState('stacked');
  
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1280, height: 800 };
  });
  
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  // Memoized companies data with optimized Cloudinary URLs
  const companies = useMemo(() => [
    { 
      name: 'Cisco', 
      mentors: 8, 
      experience: '12+',
      color: '#1e3a8a',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119549/A_czofnz.avif'
    },
    { 
      name: 'Accenture', 
      mentors: 12, 
      experience: '11+',
      color: '#5b21b6',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119549/B_ur486e.avif'
    },
    { 
      name: 'Amdocs', 
      mentors: 6, 
      experience: '13+',
      color: '#1f2937',
      logo: 'https://res.cloudinary.com/duz9xipfm/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1762153226/DOX-148df523_n8rgrn_hffbit.avif'
    },
    { 
      name: 'Cognizant', 
      mentors: 7, 
      experience: '9+',
      color: '#1d4ed8',
      logo: 'https://res.cloudinary.com/duz9xipfm/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1762153105/CTSH-82a8444b_s0dbpx_gxn6sj.avif'
    },
    { 
      name: 'Infosys', 
      mentors: 5, 
      experience: '8+',
      color: '#b91c1c',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119548/F_ik0hbh.avif'
    },
    { 
      name: 'Wipro', 
      mentors: 4, 
      experience: '14+',
      color: '#7f1d1d',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119538/G_ea3rjb.avif'
    },
    { 
      name: 'IBM', 
      mentors: 6, 
      experience: '7+',
      color: '#047857',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119538/H_ulxtbz.avif'
    },
    { 
      name: 'TCS', 
      mentors: 8, 
      experience: '11+',
      color: '#b91c1c',
      logo: 'https://res.cloudinary.com/duz9xipfm/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1762153488/TCS_wordmark_2020_coekk1_rkyfry.avif'
    },
    { 
      name: 'BMW', 
      mentors: 9, 
      experience: '10+',
      color: '#0369a1',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119537/J_nek9z0.avif'
    },
    { 
      name: 'L&T ', 
      mentors: 5, 
      experience: '8+',
      color: '#111827',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119537/K_vfcxtt.avif'
    },
    { 
      name: 'Deloitte', 
      mentors: 7, 
      experience: '9+',
      color: '#be123c',
      logo: 'https://res.cloudinary.com/drvug594q/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1754119537/L_mq7q48.avif'
    }
  ], []);

  // Handle window resize with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // Animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationState('expanding');
    }, 1000);

    const timer2 = setTimeout(() => {
      setAnimationState('complete');
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Mouse move handler - only for desktop
  const handleMouseMove = useCallback((e) => {
    if (containerRef.current && animationState === 'complete' && isDesktop) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: (e.clientX - centerX) / (rect.width / 2),
        y: (e.clientY - centerY) / (rect.height / 2)
      });
    }
  }, [animationState, isDesktop]);

  // Smooth mouse move with RAF
  useEffect(() => {
    const smoothMouseMove = (e) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => handleMouseMove(e));
    };
    
    window.addEventListener('mousemove', smoothMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', smoothMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  // Position calculations
  const getLogoPosition = useCallback((index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    let radius;
    
    if (isTablet) radius = 150;
    else if (isDesktop) {
      if (windowSize.width < 1280) radius = 180;
      else radius = 200;
    }
    else radius = 120;
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }, [isTablet, isDesktop, windowSize.width]);

  // Mouse influence calculation
  const getMouseInfluence = useCallback((logoX, logoY) => {
    if (animationState !== 'complete' || !isDesktop) 
      return { x: 0, y: 0, scale: 1 };
    
    const mouseInfluence = 0.08;
    const distance = Math.sqrt(
      Math.pow(mousePosition.x * 200 - logoX, 2) + 
      Math.pow(mousePosition.y * 200 - logoY, 2)
    );
    
    const maxDistance = 180;
    const influence = Math.max(0, 1 - Math.pow(distance / maxDistance, 1.5));
    
    return {
      x: mousePosition.x * mouseInfluence * influence * 25,
      y: mousePosition.y * mouseInfluence * influence * 25,
      scale: 1 + influence * 0.08
    };
  }, [animationState, isDesktop, mousePosition]);

  // Transform calculation
  const getLogoTransform = useCallback((index) => {
    const position = getLogoPosition(index, companies.length);
    const mouseInfluence = getMouseInfluence(position.x, position.y);
    
    switch (animationState) {
      case 'stacked':
        return {
          transform: `translate3d(0px, 0px, 0) scale(0.8)`,
          opacity: 0.5,
          zIndex: companies.length - index
        };
      
      case 'expanding':
        return {
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(1)`,
          opacity: 1,
          zIndex: 10,
          transition: `all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
          transitionDelay: `${index * 100}ms`
        };
      
      case 'complete':
        return {
          transform: `translate3d(${position.x + mouseInfluence.x}px, ${position.y + mouseInfluence.y}px, 0) scale(${mouseInfluence.scale})`,
          opacity: 1,
          zIndex: 10,
          transition: isDesktop ? 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          willChange: 'transform'
        };
      
      default:
        return {};
    }
  }, [getLogoPosition, getMouseInfluence, animationState, companies.length, isDesktop]);

  // Size calculations
  const logoSize = useMemo(() => {
    if (isTablet) return { className: 'w-18 h-18', width: 72, height: 72 };
    if (isDesktop) return { className: 'w-20 h-20 lg:w-24 lg:h-24', width: 96, height: 96 };
    return { className: 'w-16 h-16', width: 64, height: 64 };
  }, [isTablet, isDesktop]);

  const centralHubSize = useMemo(() => {
    if (isTablet) return 'w-32 h-28';
    if (isDesktop) return 'w-36 h-32 lg:w-40 lg:h-36';
    return 'w-28 h-24';
  }, [isTablet, isDesktop]);

  // PlacementBadge component with optimized image
  const PlacementBadge = useMemo(() => (
    <div className="relative group max-w-md mx-auto lg:mx-0 overflow-visible">
      <div className="absolute inset-1 sm:inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-10 sm:opacity-15 group-hover:opacity-20 sm:group-hover:opacity-25 transition-opacity duration-500"></div>
      <div className="absolute inset-1 sm:inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-5 sm:opacity-10 group-hover:opacity-10 sm:group-hover:opacity-15 transition-opacity duration-700"></div>

      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-2xl border border-white/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl"></div>

        <div className="relative flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl p-1.5 sm:p-2 backdrop-blur-sm">
              <Image
                src="https://res.cloudinary.com/dujs6xvde/image/upload/w_100,h_100,c_fit,q_auto,f_auto/v1760087082/medal_lyetf6_compressed_mb40gt.avif"
                alt="Medal icon"
                width={48}
                height={48}
                sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
                className="w-full h-full object-contain filter brightness-110"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-white/15 rounded-xl animate-ping opacity-20"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 drop-shadow-sm">
              Assured Placement Opportunity
            </p>
            <p className="text-gray-100 text-xs sm:text-sm drop-shadow-sm">
              Career Support Program
            </p>
            <div className="mt-2 w-16 h-0.5 bg-white/30 rounded-full"></div>
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-200 rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  ), []);

  // Company logo components with proper Image optimization
  const companyLogos = useMemo(() => 
    companies.map((company, index) => {
      const logoStyle = getLogoTransform(index);
      
      return (
        <div
          key={`${company.name}-${index}`}
          className="absolute cursor-pointer group items-center justify-center"
          style={{
            ...logoStyle,
            willChange: 'transform'
          }}
        >
          <div className="relative flex items-center justify-center">
            <div 
              className={`${logoSize.className} rounded-full flex items-center justify-center shadow-lg transition-all duration-200 bg-blue-200 group-hover:scale-105 border-2`}
              style={{
                borderColor: `${company.color}40`,
                boxShadow: `0 4px 20px ${company.color}15, 0 2px 10px rgba(0,0,0,0.1)`
              }}
            > 
              <div className="relative w-3/4 h-3/4 flex items-center justify-center">
                <Image 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  width={logoSize.width}
                  height={logoSize.height}
                  sizes="(max-width: 768px) 64px, (max-width: 1024px) 72px, 96px"
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                  loading={index < 5 ? "eager" : "lazy"}
                  priority={index < 3}
                />
              </div>
            </div>

            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl"
              style={{
                background: `radial-gradient(circle at center, ${company.color}, transparent 70%)`,
              }}
            ></div>
          </div>
        </div>
      );
    }), [companies, getLogoTransform, logoSize]
  );

  // Connection lines (rest of the component remains the same)
  const connectionLines = useMemo(() => {
    if (animationState !== 'complete') return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" style={{ zIndex: 1 }}>
        <defs>
          <radialGradient id="connectionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)"/>
            <stop offset="80%" stopColor="rgba(59, 130, 246, 0.1)"/>
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)"/>
          </radialGradient>
        </defs>
        {companies.map((_, index) => {
          const position = getLogoPosition(index, companies.length);
          return (
            <line
              key={`line-${index}`}
              x1="50%"
              y1="50%"
              x2={`${50 + (position.x / 4)}%`}
              y2={`${50 + (position.y / 4)}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
      </svg>
    );
  }, [animationState, companies, getLogoPosition]);

return (
    <div className="relative w-full min-h-* overflow-hidden flex">

      <div
  className="
    absolute inset-0 
    bg-white 
    sm:bg-gradient-to-r sm:from-[#182E4A] sm:via-[#182E4A] sm:to-[#182E4A]
  "
>
  
  
    <svg
          className="absolute bottom-50 left-0 w-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          style={{ height: '58%', rotate: '180deg' }}
        >
          <path
            d="M0,900 L300,900 Q500,750 700,550 Q900,400 1100,480 Q1300,560 1440,450 L1440,900 Z"
            fill="#ffffff"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          style={{ height: '58%' }}
        >
          <path
            d="M0,900 L300,900 Q500,750 700,550 Q900,400 1100,480 Q1300,560 1440,450 L1440,900 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8 md:py-16 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex flex-col justify-center">
        
        {/* Mobile Layout */}
        {isMobile && (
          
          <div className="space-y-2 sm:space-y-4 md:space-y-6 pb-12 overflow-visible min-h-[600px] z-50">
            <div className="text-center px-5 mt-12 ">
              <div className="relative inline-block">
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-gray-800 z-50">
                  <span className="text-black sm:text-white">Job-Oriented </span>   
                  <span className="text-gray-800 sm:text-[#8dacbb]">Training That </span>
                  <span className="text-black sm:text-white">Gets You Hired</span>
                </h2>
                
                <div className="absolute -left-2 sm:-left-4 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full">
                  <div className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-black leading-relaxed mt-0 mb-0 z-50">
                From <span className="font-bold text-blue-600">Industry Experts</span>
              </p>
            </div>

            <div className="w-full max-w-lg z-50">
                <AnimatedBeamDemo />
              </div>

            <div className="flex justify-center mt-[-30px]">
              
              

              {/* Mobile - Straight lines */}
              <svg
                className="sm:hidden absolute top-0 right-1 w-full"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                style={{ height: '80%', width: '250%', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}
              >
                <path
                  d="M0,0 L1440,0 L1440,100 L0,100 Z"
                  fill="#182E4A"
                />
              </svg>

              <svg
                className="sm:hidden absolute top-50 right-1 w-full"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                style={{ height: '0.5%', width: '137%', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}
              >
                <path
                  d="M0,0 L1440,0 L1440,100 L0,100 Z"
                  fill="#182E4A"
                />
              </svg>

              <svg
                className="sm:hidden absolute top-50 right-40"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                style={{
                  height: '80%',
                  width: '30%',
                  transform: 'rotate(45deg)',
                  transformOrigin: 'bottom right',
                }}
              >
                <path
                  d="M0,0 L1440,0 L1440,100 L0,100 Z"
                  fill="#182E4A"
                />
              </svg>

              <svg
                className="sm:hidden absolute top-50 right-40"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                style={{
                  height: '50%',
                  width: '0.5%',
                  transform: 'rotate(45deg)',
                  transformOrigin: 'bottom right',
                }}
              >
                <path
                  d="M0,0 L1440,0 L1440,100 L0,100 Z"
                  fill="#182E4A"
                />
              </svg>

              {/* Desktop - Top wave (hidden on mobile) */}
              <svg
                className="hidden sm:block absolute bottom-50 left-0 w-full"
                viewBox="0 0 1440 800"
                preserveAspectRatio="none"
                style={{ height: '58%', rotate: '180deg' }}
              >
                <path
                  d="M0,900 L300,900 Q500,750 700,550 Q900,400 1100,480 Q1300,560 1440,450 L1440,900 Z"
                  fill="#ffffff"
                />
              </svg>

              {/* Desktop - Bottom wave (hidden on mobile) */}
              <svg
                className="hidden sm:block absolute bottom-0 left-0 w-full"
                viewBox="0 0 1440 800"
                preserveAspectRatio="none"
                style={{ height: '58%' }}
              >
                <path
                  d="M0,0 L300,0 Q500,150 700,350 Q900,500 1100,420 Q1300,340 1440,450 L1440,0 Z"
                  fill="#ffffff"
                />
              </svg>

              
            </div>
            <div className="overflow-visible">
                {PlacementBadge}
              </div>
          </div>
        )}

        {/* Tablet Layout */}
        {isTablet && (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center px-4 py-6 flex-shrink-0">
              <div className="relative inline-block">
                <h2 className="text-2xl md:text-4xl font-black leading-tight text-gray-800">
                  <span className="text-white">Job-Oriented </span>
                  <span className="text-[#8dacbb]">Training That </span>
                  <span className="text-white">Gets You Hired</span>
                </h2>
                
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full">
                  <div className="absolute top-0 left-0 w-full h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-base md:text-lg text-gray-100 leading-relaxed mt-4">
                From <span className="font-bold text-blue-600">Industry Experts</span>
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
              <div className="relative w-full max-w-2xl" style={{ height: '450px' }} ref={containerRef}>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div 
                    className={`${centralHubSize} bg-white/80 backdrop-blur-xl border border-blue-200/30 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-1000 ${
                      animationState === 'stacked' ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                    }`}
                  >
                    <div className="text-center p-3">
                      <div className="text-gray-800 font-bold text-lg mb-2">
                        Our Mentors
                      </div>
                      <div className="text-blue-600 font-semibold text-base">
                        Come From
                      </div>
                      <div className="mt-2 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  {companyLogos}
                </div>

                {connectionLines}
              </div>
            </div>

            <div className="px-6 py-4 flex-shrink-0">
              {PlacementBadge}
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        {isDesktop && (
          <div className="h-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            <div className="space-y-8 lg:pr-12">
              
              <div className="space-y-6">
                <div className="relative">
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
                    <span className="block text-white mb-3 lg:mb-4">
                    Job-Oriented
                    </span>
                    <span className="block text-[#93C5FD] bg-clip-text mb-3 lg:mb-4">
                    Training That 
                    </span>
                    <span className="block text-white text-3xl lg:text-4xl xl:text-5xl">
                    Gets You Hired
                    </span>
                  </h2>
                  
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full">
                    <div className="absolute top-0 left-0 w-full h-6 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <p className="text-lg lg:text-xl text-gray-100 leading-relaxed">
                Learn SAP with real-time projects, expert mentors & placement support
                </p>
                
                <div className="mr-40 flex-shrink-0">
                  {PlacementBadge}
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full" style={{ height: '550px', minHeight: '400px' }} ref={containerRef}>
              
              <div className="relative z-30">
                <div 
                  className={`${centralHubSize} bg-white backdrop-blur-sm border border-blue-200/30 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-1000 ${
                    animationState === 'stacked' ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                  }`}
                >
                  <div className="text-center p-4">
                    <div className="text-gray-800 font-bold text-xl mb-2">
                      Our Mentors
                    </div>
                    <div className="text-blue-600 font-semibold text-lg">
                      Come From
                    </div>
                    <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {companyLogos}
              </div>

              {connectionLines}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default CareerMentorsComponent;
