"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";

const OrbitalTrail = () => {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeHex, setActiveHex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trailCount = 25;

  const hexagonData = [
    {
      id: 1,
      label: "10+ Years Experience",
      color: "#98D8EF",
      cover: "/Keypoints/experiencelogo.avif",
      title: "10+ Years Experience",
      desc: "Over a decade of experience, our training institute has been a trusted name in delivering high-quality, industry-relevant education.",
      className: "logo1",
    },
    {
      id: 2,
      label: "Working professional trainers",
      color: "#98D8EF",
      cover: "/Keypoints/corporate-alt.avif",
      title: "Working professional trainers",
      desc: "Learn from Working professional trainers! Gain real-world insights, expert guidance, and industry-ready skills to help you succeed in today's job market.",
      className: "logo1",
    },
    {
      id: 3,
      label: "Corporate Style Training",
      color: "#98D8EF",
      cover: "/Keypoints/cptraining.avif",
      title: "Corporate Style Training",
      desc: "Multiple Batches & Support Systems to make sure you can learn according to your convenience.",
      className: "logo2",
    },
    {
      id: 4,
      label: "Experience Alteration",
      color: "#98D8EF",
      cover: "/Keypoints/exp alt.avif",
      title: "Experience Alteration",
      desc: "Our unique offering helps you apply for jobs with relevant experience, enhancing your resume and boosting hiring chances.",
      className: "logo1",
    },
    {
      id: 5,
      label: "Real Time Training & Scenario",
      color: "#98D8EF",
      cover: "/Keypoints/clock.avif",
      title: "Real Time Training & Scenario",
      desc: "Get hands-on experience with real-time training & real-time scenario designed to build practical skills and boost your job readiness from day one!",
      className: "logo4",
    },
    {
      id: 6,
      label: "100% Job Assistance",
      color: "#98D8EF",
      cover: "/Keypoints/job assistance.avif",
      title: "100% Job Assistance",
      desc: "Get 100% job assistance with expert training, resume building, mock interviews & placement support at our top-rated training institute.",
      className: "logo3",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 24);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  const calculatePosition = (angle, delay = 0) => {
    const adjustedAngle = angle - delay;
    const radians = (adjustedAngle * Math.PI) / 180;
    const radius = isMobile ? 100 : 182;
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;
    return { x, y };
  };

  const calculateHexPosition = (index, total) => {
    const angle = (index * 360) / total;
    const radians = (angle * Math.PI) / 180;
    const radius = isMobile ? 130 : 247;
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;
    return { x, y, angle };
  };

  useEffect(() => {
    if (!isMounted) return;
    
    hexagonData.forEach((hex, index) => {
      const hexPos = calculateHexPosition(index, hexagonData.length);
      const angleDiff = Math.abs((hexPos.angle - rotation + 360) % 360);
      
      if (angleDiff < 15 || angleDiff > 345) {
        setActiveHex(hex.id);
      }
    });
  }, [rotation, isMounted, isMobile]);

  const titleStyle = {
    fontWeight: 700,
    letterSpacing: isMobile ? '1px' : '4px',
    textShadow: '0 0 0px #fff, 0 0 10px #fff, 0 0 10px #0073e6, 0 0 20px #182e4a, 0 0 20px #182e4a, 0 0 30px #182e4a, 0 0 30px #182e4a',
    background: 'linear-gradient(90deg, #fff 35%, rgba(3, 163, 196, 1) 49%, #fff 62%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center'
  };

  const underlineStyle = {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #a76b2e, #f18436)',
    margin: '5px auto 10px',
    borderRadius: '2px',
    marginBottom: '1rem'
  };

  if (!isMounted) {
    return (
      <div className="w-full bg-slate-900 flex items-center justify-center overflow-x-hidden">
        <div className="w-full max-w-[1200px] px-4 min-h-[800px] flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 mt-8 px-4" style={titleStyle}>
            Why Choose Connecting Dots ERP?
          </h2>
          <div className="w-full h-[600px] flex items-center justify-center">
            <div className="animate-pulse text-blue-400">Loading animation...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-[1200px] px-4 py-8 flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 mt-4 md:mt-3 px-4" style={titleStyle}>
          Why Choose Connecting Dots ERP?
        </h2>
        <div style={underlineStyle} />

        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 md:mt-16 lg:mt-0">
          {/* Orbital animation */}
          <div className={`relative ${isMobile ? 'w-72 h-72' : 'w-96 h-96'} flex items-center justify-center`}>
            <div className="absolute w-full h-full rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)' }}
            />
            
            <div className={`absolute ${isMobile ? 'w-[260px] h-[260px]' : 'w-[504px] h-[504px]'} border-2 border-blue-900 rounded-full`} />
            <div className={`absolute ${isMobile ? 'w-[200px] h-[200px]' : 'w-[364px] h-[364px]'} border-2 border-blue-900 rounded-full`}/>
            <div className={`absolute ${isMobile ? 'w-[80px] h-[80px]' : 'w-[140px] h-[140px]'} border-3 border-blue-800 rounded-full bg-slate-800`} />
            
            {/* Hexagons */}
            {hexagonData.map((hex, index) => {
              const position = calculateHexPosition(index, hexagonData.length);
              const isActive = activeHex === hex.id;
              
              return (
                <div
                  key={hex.id}
                  className="absolute flex flex-col items-center justify-center cursor-pointer group"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setActiveHex(hex.id)}
                  onMouseLeave={() => setActiveHex(null)}
                >
                  <div 
                    className="relative"
                    style={{
                      width: isMobile ? '60px' : '110px',
                      height: isMobile ? '60px' : '110px',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 w-full h-full"
                      style={{ filter: isActive ? 'drop-shadow(0 0 100px ' + hex.color + ')' : '' }}
                    >
                      <polygon
                        points="50,5 90,25 90,75 50,95 10,75 10,25"
                        fill={isActive ? hex.color + '90' : '#1e293b'}
                        stroke={isActive ? hex.color : '#475569'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    </svg>
                    
                    <div className={`absolute inset-0 flex items-center justify-center text-center ${isMobile ? 'text-[8px] p-1' : 'text-[13px] p-3'} text-white`}>
                      {hex.label}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className={`absolute ${isMobile ? 'w-[200px] h-[200px]' : 'w-[364px] h-[364px]'} border border-blue-900/20 rounded-full`} />
            
            {/* Trail */}
            {Array.from({ length: trailCount }).map((_, index) => {
              const delay = index * 3;
              const position = calculatePosition(rotation, delay);
              const opacity = 1 - (index / trailCount);
              const scale = 1 - (index * 0.08);
              
              return (
                <div
                  key={index}
                  className={`absolute ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} rounded-full`}
                  style={{
                    transform: `translate(${position.x.toFixed(3)}px, ${position.y.toFixed(3)}px) scale(${scale.toFixed(2)})`,
                    opacity: (opacity * 0.8).toFixed(3),
                    background: index === 0 
                      ? 'radial-gradient(circle, #60a5fa, #3b82f6)'
                      : `radial-gradient(circle, rgba(96, 165, 250, ${opacity.toFixed(3)}), rgba(59, 130, 246, ${(opacity * 0.5).toFixed(3)}))`,
                    boxShadow: index === 0 
                      ? '0 0 20px #60a5fa, 0 0 40px #3b82f6'
                      : `0 0 ${(10 * opacity).toFixed(3)}px rgba(96, 165, 250, ${opacity.toFixed(3)})`,
                    transition: 'none',
                    willChange: 'transform, opacity, box-shadow'
                  }}
                />
              );
            })}
            
            {/* Main orb */}
            <div
              className={`absolute ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} bg-white rounded-full z-20`}
              style={{
                transform: `translate(${calculatePosition(rotation, 0).x}px, ${calculatePosition(rotation, 0).y}px)`,
                boxShadow: '0 0 30px #ffffff, 0 0 60px #60a5fa, 0 0 90px #3b82f6',
                background: 'radial-gradient(circle, #ffffff, #93c5fd)'
              }}
            />
            
            <div className="absolute flex flex-col items-center justify-center">
              <div className={`${isMobile ? 'text-sm' : 'text-xl'} text-white font-bold uppercase tracking-wider`}>KEYPOINTS</div>
            </div>
          </div>
          
          {/* Feature list */}
          <div className={`keyNotes ${isMobile ? 'grid grid-cols-2 gap-6' : 'lg:ml-8 flex flex-col justify-center mt-8 space-y-6'} w-full lg:w-auto px-2 lg:px-0`}>
            {hexagonData.map((feature, index) => (
              <div 
                className={`note ${isMobile ? 'flex flex-col items-center px-2' : 'flex items-center space-x-4'}`} 
                key={index}
              >
                {isMobile ? (
                  <>
                    <div className="img mb-3">
                      <Image
                        src={feature.cover}
                        alt={feature.title}
                        width={50}
                        height={50}
                        className={feature.className}
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                    <div className="text-white w-full">
                      <div className='text-sm font-semibold mb-1'>{feature.title}</div>
                      <div className='text-xs leading-relaxed text-justify'>{feature.desc}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="img flex-shrink-0">
                      <Image
                        src={feature.cover}
                        alt={feature.title}
                        width={70}
                        height={70}
                        className={feature.className}
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                    <div className="max-w-md pl-5 text-justify text-white text-sm">
                      <div className='text-md font-semibold mb-1'>{feature.title}</div>
                      <div className='leading-relaxed'>{feature.desc}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitalTrail;
