"use client";
import React, { useState, useEffect } from 'react';

const CareerHeroSlide = ({ onOpenForm }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleButtonClick = () => {
    if (onOpenForm) onOpenForm();
  };

  return (
    // ✅ FIXED: Standardized carousel height matching other carousels
    <div className="relative w-full min-h-[650px] sm:min-h-[700px] md:min-h-[750px] lg:min-h-[800px]">
      
      {/* Wave Background */}
      <div className="absolute inset-0 sm:bg-[#182E4A]">
        {/* Mobile - Straight lines */}
        <svg
          className="sm:hidden absolute top-0 right-1 w-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ height: '80%', width: '250%', transform: 'rotate(-45deg)', transformOrigin: 'top left'}}
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
          style={{ height: '0.5%', width: '137%', transform: 'rotate(-45deg)', transformOrigin: 'top left'}}
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
            d="M0,900 L300,900 Q500,750 700,550 Q900,400 1100,480 Q1300,560 1440,450 L1440,900 Z"
            fill="#ffffff"
          />
        </svg>

      </div>

      {/* ✅ FIXED: Optimized content container with proper height */}
      <div className="relative z-10 w-full px-3 sm:px-4 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-16 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Content - OPTIMIZED */}
            <div className={`space-y-3 sm:space-y-4 md:space-y-5 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              
              {/* ✅ FIXED: Responsive font sizes */}
              <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 sm:text-white mt-35 pt-20">
                <span className="block sm:inline">
                  <span className="text-blue-600 sm:text-white relative inline-block">S</span>ecure your{" "}
                  <span className="text-blue-600 sm:text-[#93C5FD] relative inline-block">
                    Dream Career 
                  </span>
                </span>{" "}
                <span className="block sm:inline">with Live Classes </span>
              </h2>

              {/* ✅ FIXED: Compact subtitle */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                <span className="text-gray-800 sm:text-gray-100 font-normal text-lg sm:text-sm md:text-base lg:text-lg">From Industry Experts</span>
              </div>

              {/* ✅ FIXED: Shorter description for mobile */}
              <p className="text-gray-700 sm:text-gray-300 text-sm sm:text-md md:text-base leading-relaxed max-w-full sm:max-w-lg">
                For more than 10 years, we&apos;ve been passionate about providing engaging, 
                instructor-led training that helps professionals around the world grow and succeed.
              </p>

              {/* ✅ FIXED: Compact trust badge */}
              <p className="text-gray-600 sm:text-gray-200 text-sm sm:text-sm">
                Est. 2013 • Trusted by{' '}
                <span className="font-bold text-blue-400">5000+</span> Students
              </p>

              {/* ✅ FIXED: Compact CTA button */}
              <div className="pt-2 sm:pt-3 md:pt-4">
                <button 
                  onClick={handleButtonClick}
                  className="group relative bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-sm sm:text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
                  aria-label="Get free consultation"
                >
                  <span className="relative z-10">Free Consultation</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              </div>
            </div>

            {/* Right Side - 3D Logo - OPTIMIZED */}
            <div className={`hidden md:flex justify-center md:justify-end transition-all duration-1000 ease-out delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative group cursor-pointer">
                <div className="animate-float">
                  <img
                    src="https://res.cloudinary.com/dubeuisom/image/upload/v1756890589/3d-logo_1_qwvz8y.avif"
                    alt="3D Logo"
                    className="w-58 h-58 md:w-66 md:h-66 lg:w-84 lg:h-84 xl:w-88 xl:h-88 object-contain bg-white rounded-xl shadow-2xl"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        svg {
          filter: drop-shadow(0 -5px 12px rgba(0, 0, 0, 0.06));
        }
      `}</style>
    </div>
  );
};

export default CareerHeroSlide;
