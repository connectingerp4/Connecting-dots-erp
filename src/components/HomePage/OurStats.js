'use client'

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Trophy, GraduationCap, Target, Users, Code, Handshake } from 'lucide-react';
import styles from '@/styles/HomePage/OurStats.module.css';

const AnimatedStatsSection = () => {
  const [currentStat, setCurrentStat] = useState(-1);
  const [waveProgress, setWaveProgress] = useState(0);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 180 });
  const [showAllCards, setShowAllCards] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [expandedTablet, setExpandedTablet] = useState({});
  const [expandedMobile, setExpandedMobile] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  
  useEffect(() => {
    // This effect only runs on the client side
    setIsClient(true);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpandTablet = (idx) => {
    setExpandedTablet((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleExpandMobile = (idx) => {
    setExpandedMobile((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Remove the duplicate resize handler since we already have one

  // Only calculate these values on the client side
  const isMobile = isClient ? windowWidth < 1024 : false;
  const isTablet = isClient ? (windowWidth >= 1024 && windowWidth <= 1200) : false;
  const disableAnimation = isClient ? (windowWidth >= 0 && windowWidth <= 1023) : false;
  const pathLength = 1500;

  useEffect(() => {
    if (disableAnimation) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      setWaveProgress(0);
      setDotPosition({ x: 0, y: 180 });
      setCurrentStat(-1);
      setShowAllCards(true);
    } else {
      setShowAllCards(false);
    }
  }, [disableAnimation]);

  const stats = [
    {
      id: 'legacy',
      icon: Trophy,
      title: 'Years of Legacy',
      value: '10+',
      shortDesc: '10+ Years of excellence in providing top-notch education.',
      detailedInfo: 'Our Institute, with over 10+ Years of excellence, consistently provides top-notch instruction and services.',
      achievements: '10+ years strong in empowering learners with excellence.',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-blue-50 to-indigo-50',
      accentColor: '#3B82F6',
      position: 0,
    },
    {
      id: 'students',
      icon: GraduationCap,
      title: 'Students',
      value: '5,000+',
      shortDesc: 'Successfully educated 10,000+ students with quality training.',
      detailedInfo: 'Our institute has educated over 10000+ Students, consistently providing top-notch instruction and services.',
      achievements: 'Students placed in top-tier companies',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-green-50 to-emerald-50',
      accentColor: '#10B981',
      position: 20,
    },
    {
      id: 'growth',
      icon: Target,
      title: 'Growth',
      value: '100X',
      shortDesc: '100x growth with graduates securing high-paying jobs.',
      detailedInfo: 'Our institute boosts a 100 x Growth, with graduates securing top salaries up to 24 lakh per annum.',
      achievements: 'Our graduates achieve 100x career growth.',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-purple-50 to-violet-50',
      accentColor: '#8B5CF6',
      position: 40,
    },
    {
      id: 'mentors',
      icon: Users,
      title: 'Mentors',
      value: '100+',
      shortDesc: 'Industry professionals providing expert guidance.',
      detailedInfo: 'Our institute features over 100+ MNC professionals, providing expert guidance and support.',
      achievements: 'Working profeesional trainers with practical industry experience',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-orange-50 to-amber-50',
      accentColor: '#F59E0B',
      position: 60,
    },
    {
      id: 'courses',
      icon: Code,
      title: 'Practical Courses',
      value: '100%',
      shortDesc: '100% practical courses for real-world applications.',
      detailedInfo: 'Our institute offers a 100% Practical Courses tailored for industry needs, delivering proven outcomes.',
      achievements: 'Practical Courses experience for students.',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-pink-50 to-rose-50',
      accentColor: '#EC4899',
      position: 80,
    },
    {
      id: 'partners',
      icon: Handshake,
      title: 'Hiring Partners',
      value: '100+',
      shortDesc: '100+ hiring partners including global tech giants.',
      detailedInfo: 'Our institute has over 100+ Hiring partners, including Giants like Google and Microsoft, as well as leading MNCs.',
      achievements: 'Top MNCs and innovative startups',
      color: 'from-blue-400 to-blue-500',
      cardGradient: 'from-teal-50 to-cyan-50',
      accentColor: '#06B6D4',
      position: 100,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[0].isIntersecting);
      },
      { threshold: 0.2 }
    );
    const currentContainer = containerRef.current;
    if (currentContainer) observer.observe(currentContainer);
    return () => {
      if (currentContainer) observer.unobserve(currentContainer);
    };
  }, []);

  useEffect(() => {
    if (!inView || disableAnimation) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const animationDuration = isMobile ? 10000 : 8000;
    let startTime = Date.now();

    const animate = () => {
      if (!inView) return;

      const now = Date.now();
      const elapsed = (now - startTime) % animationDuration;
      const progress = elapsed / animationDuration;

      if (isMobile) {
        if (isPaused) {
          frameRef.current = requestAnimationFrame(animate);
          return;
        }

        const yProgress = progress * 100;
        setWaveProgress(yProgress);
        setDotPosition({ x: 0, y: yProgress });
        setCurrentStat(getDotProximityToCircle(yProgress));

        if (elapsed >= animationDuration - 16) {
          setIsPaused(true);
          setShowAllCards(true);
          setTimeout(() => {
            setIsPaused(false);
            setShowAllCards(false);
            startTime = Date.now();
          }, isMobile ? 15000 : 10000);
        }
      } else {
        if (isPaused) {
          frameRef.current = requestAnimationFrame(animate);
          return;
        }
        const wavePos = progress * 100;
        setWaveProgress(wavePos);
        setDotPosition(getPointOnCurve(wavePos));
        setCurrentStat(getDotProximityToCircle(wavePos));

        if (elapsed >= animationDuration - 16) {
          setIsPaused(true);
          setShowAllCards(true);
          setTimeout(() => {
            setIsPaused(false);
            setShowAllCards(false);
            startTime = Date.now();
          }, isMobile ? 15000 : 10000);
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, isPaused, isMobile, disableAnimation]);

  const cardsAlwaysVisible = disableAnimation || showAllCards;

  return (
    <div ref={containerRef} className="w-full">
      <style>{`
        .expandable-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.5s ease, opacity 0.5s ease;
        }
        .expandable-content.expanded {
          max-height: 300px;
          opacity: 1;
        }
      `}</style>
      <div className={styles.t2p}>
        <div className="container mx-auto px-4">
          <div className={styles.t2pTitle}>
            <h2>Our Stats At A Glance</h2>
            <div className={styles.titleUnderline}></div>
            <p className={styles.subtitle}>Milestones that define our journey and success</p>
          </div>

          {!isMobile && (
            <div
              className="relative w-full max-w-7xl -mt-20"
              style={{ height: isTablet ? '460px' : '520px' }}
            >
              <div className="absolute inset-0" style={{ top: '60px', height: isTablet ? '200px' : '240px' }}>
                <svg className="w-full h-full" viewBox="0 0 1500 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                  </defs>
                  <path
                    ref={pathRef}
                    d="M0,150 Q150,100 300,150 T600,150 T900,150 T1200,150 T1500,150"
                    fill="none"
                    stroke="url(#waveGradient)"
                    strokeWidth={isTablet ? '4' : '6'}
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength - (waveProgress / 100) * pathLength}
                  />
                </svg>
              </div>

              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const point = getPointOnCurve(stat.position);
                const isActive = currentStat === index;
                const showCard = cardsAlwaysVisible || isActive;
                const isTabletExpanded = expandedTablet[index];

                const circleSize = isTablet ? 'w-20 h-20' : 'w-28 h-28';

                return (
                  <div
                    key={stat.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${(point.x / 1500) * 100}%`,
                      top: `${60 + (point.y / 300) * (isTablet ? 200 : 240)}px`,
                      zIndex: showCard ? 20 : 10,
                    }}
                  >
                    <div
                      className={`
                        ${circleSize} rounded-full flex flex-col items-center justify-center
                        bg-gradient-to-br ${stat.color} shadow-lg text-white text-center
                        ${isActive ? 'scale-110 ring-4 ring-blue-300' : ''}
                      `}
                    >
                      <span className={`font-bold ${isTablet ? 'text-sm' : 'text-lg'}`}>{stat.value}</span>
                      <span className={`font-medium ${isTablet ? 'text-[10px]' : 'text-xs'}`}>{stat.title}</span>
                      <IconComponent className={`mt-1 text-white/80 ${isTablet ? 'w-3 h-3' : 'w-5 h-5'}`} />
                    </div>

                    {showCard && (
                      <div
                        className="absolute mt-2 left-1/2"
                        style={{ top: `calc(100% + 10px)`, transform: 'translateX(-50%)' }}
                      >
                        <div
                          className={`
                            rounded-2xl shadow-xl bg-gradient-to-br ${stat.cardGradient} p-3 transition-all duration-300
                            ${isTablet ? 'min-w-[160px] max-w-[200px]' : 'min-w-[220px] max-w-[260px]'}
                          `}
                        >
                          <h3
                            className={`
                              font-bold text-center bg-gradient-to-r ${stat.color} bg-clip-text text-transparent
                              ${isTablet ? 'text-sm' : 'text-xl'}
                            `}
                          >
                            {stat.value}
                          </h3>
                          <p
                            className={`text-center font-semibold text-gray-800 ${
                              isTablet ? 'text-xs' : 'text-base'
                            }`}
                          >
                            {stat.title}
                          </p>

                          {isTablet ? (
                            <>
                              <p className={`mt-2 text-gray-600 text-center text-xs`}>
                                {isTabletExpanded ? stat.detailedInfo : stat.shortDesc}
                              </p>

                              <div className="text-center mt-2">
                                <button
                                  onClick={() => toggleExpandTablet(index)}
                                  className="text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                                  style={{
                                    color: stat.accentColor,
                                    backgroundColor: isTabletExpanded ? `${stat.accentColor}20` : 'transparent',
                                    border: `1px solid ${stat.accentColor}`,
                                  }}
                                >
                                  {isTabletExpanded ? 'View less' : 'View more'}
                                </button>
                              </div>

                              <p
                                className={`mt-2 font-bold text-center text-[10px]`}
                                style={{ color: stat.accentColor }}
                              >
                                {isTabletExpanded ? stat.achievements : `✓ ${stat.achievements.slice(0, 30)}...`}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className={`mt-2 text-gray-600 text-center text-sm`}>{stat.detailedInfo}</p>
                              <p
                                className={`mt-2 font-bold text-center text-xs`}
                                style={{ color: stat.accentColor }}
                              >
                                {stat.achievements}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {!cardsAlwaysVisible && (
                <div
                  className={`absolute rounded-full border-2 border-blue-600 transform -translate-x-1/2 -translate-y-1/2 ${
                    isTablet ? 'w-3 h-3' : 'w-4 h-4'
                  } bg-blue-500`}
                  style={{
                    left: `${(dotPosition.x / 1500) * 100}%`,
                    top: `${60 + (dotPosition.y / 300) * (isTablet ? 200 : 240)}px`,
                  }}
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <div className="flex flex-row gap-3 mt-20 pt-10 pb-20 relative">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full"></div>

              {!showAllCards && (
                <div
                  className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-600 transform -translate-x-1/2 -translate-y-1/2 z-9"
                  style={{ left: '1.6rem', top: `${dotPosition.y}%` }}
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}

              <div className="flex flex-col gap-8 items-start relative z-10">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  const isActive = currentStat === index;
                  const showCard = showAllCards || isActive;
                  const isMobileExpanded = expandedMobile[index];

                  return (
                    <div key={stat.id} className="flex items-start gap-3 w-full">
                      <button
                        className={`
                          w-14 h-14 rounded-full flex flex-col items-center justify-center
                          bg-gradient-to-br ${stat.color} shadow-lg text-white text-center flex-shrink-0
                          ${isActive && !showAllCards ? 'scale-110 ring-4 ring-blue-300' : ''}
                          ${showAllCards ? 'ring-2 ring-blue-200' : ''}
                          transition-all duration-200 ease-in-out
                        `}
                      >
                        <span className="text-[10px] font-bold">{stat.value}</span>
                        <span className="text-[7px] font-medium leading-tight">{stat.title}</span>
                        <IconComponent className="w-2 h-2 mt-0.5 text-white/80" />
                      </button>

                      {showCard && (
                        <div className="flex-1 max-w-xs">
                          <div
                            className={`
                              rounded-lg shadow-md bg-gradient-to-r ${stat.cardGradient} 
                              border-l-3 p-2 transition-all duration-300
                              ${showAllCards ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-300'}
                            `}
                            style={{ borderLeftColor: stat.accentColor }}
                          >
                            <div className="flex items-start gap-2 w-full">
                              <IconComponent className="w-4 h-4 mt-0.5 text-black/80 flex-shrink-0" />
                              <p className="text-[12px] text-gray-600 font-semibold text-left">{stat.title}</p>
                            </div>

                            <p className="text-[10px] text-gray-700 leading-relaxed items-start text-left">
                              {stat.detailedInfo}
                            </p>

                            <div className="text-center">
                              <button
                                onClick={() => toggleExpandMobile(index)}
                                className="text-[9px] font-semibold px-2 py-1 rounded-full transition-colors"
                                style={{
                                  color: stat.accentColor,
                                  backgroundColor: isMobileExpanded ? `${stat.accentColor}20` : 'transparent',
                                  border: `1px solid ${stat.accentColor}`,
                                }}
                              >
                                {isMobileExpanded ? 'Less' : 'More'}
                              </button>
                            </div>

                            <div
                              className={`border-t border-gray-200 pt-2 expandable-content ${
                                isMobileExpanded ? 'expanded' : ''
                              }`}
                            >
                              <p className="text-[10px] text-gray-700 leading-relaxed mb-2 text-left">
                                {stat.shortDesc}
                              </p>

                              <div className="bg-white/60 rounded p-1">
                                <p className="text-[9px] font-semibold text-center" style={{ color: stat.accentColor }}>
                                  ✓ {stat.achievements}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getPointOnCurve(progress) {
  const t = Math.max(0, Math.min(100, progress)) / 100;
  const segments = [
    { start: { x: 0, y: 150 }, control: { x: 150, y: 100 }, end: { x: 300, y: 150 } },
    { start: { x: 300, y: 150 }, control: { x: 450, y: 200 }, end: { x: 600, y: 150 } },
    { start: { x: 600, y: 150 }, control: { x: 750, y: 100 }, end: { x: 900, y: 150 } },
    { start: { x: 900, y: 150 }, control: { x: 1050, y: 200 }, end: { x: 1200, y: 150 } },
    { start: { x: 1200, y: 150 }, control: { x: 1350, y: 100 }, end: { x: 1500, y: 150 } },
  ];
  const segProgress = t * segments.length;
  const i = Math.floor(segProgress);
  const segT = segProgress - i;
  if (i >= segments.length) return segments.at(-1).end;
  const { start, control, end } = segments[i];
  const oneMinusT = 1 - segT;
  return {
    x: oneMinusT * oneMinusT * start.x + 2 * oneMinusT * segT * control.x + segT * segT * end.x,
    y: oneMinusT * oneMinusT * start.y + 2 * oneMinusT * segT * control.y + segT * segT * end.y,
  };
}

function getDotProximityToCircle(dotProgress) {
  const positions = [0, 20, 40, 60, 80, 100];
  for (let i = 0; i < positions.length; i++) {
    if (Math.abs(dotProgress - positions[i]) <= 7) return i;
  }
  return -1;
}

export default AnimatedStatsSection;