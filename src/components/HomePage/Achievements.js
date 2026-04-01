import React, { useState, useEffect, useRef } from 'react';

export default function Achievement() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [view, setView] = useState('3d');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && view === '3d') {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ 
          x: e.clientX - rect.left - rect.width / 2, 
          y: e.clientY - rect.top - rect.height / 2 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const timer = setTimeout(() => {
      setView('scroll');
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [view]);

  const cards = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433140/17_r30m5r.avif',
      title: '',
      subtitle: '',
      baseRotation: -12,
      baseX: -35,
      baseY: 5,
      depth: 1,
      colorType: 'psychedelic',
      width: 145,
      height: 185
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433190/4_gmweo7.avif',
      baseRotation: 3,
      baseX: -10,
      baseY: -8,
      depth: 2,
      colorType: 'urban',
      width: 145,
      height: 185
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433354/15_rpr8xg.avif',
      title: '',
      subtitle: '',
      text: '',
      time: '',
      baseRotation: 8,
      baseX: 15,
      baseY: -3,
      depth: 3,
      hasText: true,
      width: 145,
      height: 185
    },
    {
      id: 4,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433355/19_myauqb.avif',
      title: '',
      baseRotation: -5,
      baseX: 40,
      baseY: 2,
      depth: 4,
      colorType: 'digital',
      width: 145,
      height: 185
    }
  ];

  const scrollingCards = [
    ...cards,
    {
      id: 5,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433355/5_opiag2.avif',
      title: '',
      colorType: 'neon',
      width: 145,
      height: 185
    },
    {
      id: 6,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433429/13_enbdyb.avif',
      title: '',
      colorType: 'psychedelic',
      width: 145,
      height: 185
    },
    {
      id: 7,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433428/14_ewaid4.avif',
      title: '',
      colorType: '',
      width: 145,
      height: 185
    },
    {
      id: 8,
      image: 'https://res.cloudinary.com/duz9xipfm/image/upload/v1765433489/6_a6d9ch.avif',
      title: '',
      colorType: 'digital',
      width: 145,
      height: 185
    }
  ];

  const getCardTransform = (card) => {
    const parallaxX = (mousePosition.x / 30) * card.depth;
    const parallaxY = (mousePosition.y / 30) * card.depth;
    const rotateY = (mousePosition.x / 50) * card.depth;
    const rotateX = -(mousePosition.y / 50) * card.depth;

    return {
      transform: `
        translate3d(calc(-50% + ${card.baseX}% + ${parallaxX}px), calc(-50% + ${card.baseY}% + ${parallaxY}px), ${card.depth * 30}px)
        rotateZ(${card.baseRotation}deg)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
      `
    };
  };

  const CardComponent = ({ card, isScrolling = false, imageClass = 'object-contain', imageStyle = {}, highlightBottom = false }) => {
    const cardWidth = card.width || 145;
    const cardHeight = card.height || 185;
    
    return (
      <div className={`${isScrolling ? 'flex-shrink-0' : 'w-full h-full'} relative`} style={isScrolling ? { width: `${cardWidth}px` } : {}}>
        <div className={`${isScrolling ? '' : 'absolute inset-0'} rounded-sm relative`} style={isScrolling ? { height: `${cardHeight}px` } : { transform: 'translateZ(-2px)' }}>
          {/* Image container */}
          <div className="absolute rounded-sm overflow-hidden bg-black" style={{ inset: '7px' }}>
          <img 
            src={card.image}
            alt={card.title || 'Card'}
            className={`absolute inset-0 w-full h-full ${imageClass}`}
            style={imageStyle}
          />

          {highlightBottom && (
            <>
              <div className="absolute left-0 right-0 bottom-0 h-1/2 pointer-events-none" style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0))'
              }} />
              <div className="absolute left-4 right-4 bottom-4 h-0.5 rounded bg-white/20 pointer-events-none" />
            </>
          )}
          
          {card.colorType === 'psychedelic' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-pink-500/30 to-green-500/40 mix-blend-screen"></div>
              <div className="absolute inset-0 bg-gradient-radial from-purple-500/30 to-transparent mix-blend-color"></div>
            </>
          )}
          {card.colorType === 'urban' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/50 via-pink-500/40 to-red-500/50 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-blue-500/20 mix-blend-screen"></div>
            </>
          )}
          {card.colorType === 'digital' && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-transparent to-lime-400/20 mix-blend-screen"></div>
          )}
          {card.colorType === 'neon' && (
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 via-purple-500/30 to-blue-500/40 mix-blend-screen"></div>
          )}

          {card.hasText && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
                <p className="text-white/90 font-mono text-sm leading-relaxed whitespace-pre-line">
                  {card.title}<br/>
                  {card.subtitle}<br/>
                  {card.text}
                </p>
                {card.time && (
                  <div className="absolute bottom-4 left-6 text-white/60 text-xs font-mono">{card.time}</div>
                )}
              </div>
            </>
          )}

          {!card.hasText && card.title && (
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-serif italic text-xl leading-tight drop-shadow-lg">
                {card.title}
                {card.subtitle && <><br/>{card.subtitle}</>}
              </h3>
            </div>
          )}
        </div>
        
        {/* Double-line border with curved corner decorations - ON TOP */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {/* Outer border line */}
          <div className="absolute inset-0 border-[3px] border-white"></div>
          
          {/* Inner border line */}
          <div className="absolute border-[2px] border-white" style={{ inset: '6px' }}></div>
          
          {/* Top-left corner - Two curved arcs */}
          <div className="absolute top-0 left-0" style={{ width: '80px', height: '80px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" className="absolute top-0 left-0">
              {/* Outer curved arc */}
              <path 
                d="M 3 50 Q 3 3, 50 3" 
                stroke="white" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
              />
              {/* Inner curved arc */}
              <path 
                d="M 9 45 Q 9 9, 45 9" 
                stroke="white" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* Bottom-right corner - Two curved arcs */}
          <div className="absolute bottom-0 right-0" style={{ width: '80px', height: '80px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" className="absolute bottom-0 right-0">
              {/* Outer curved arc */}
              <path 
                d="M 77 30 Q 77 77, 30 77" 
                stroke="white" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
              />
              {/* Inner curved arc */}
              <path 
                d="M 71 35 Q 71 71, 35 71" 
                stroke="white" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 pointer-events-none animate-gradient-sweep" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.06) 25%, rgba(236, 72, 153, 0.06) 50%, rgba(168, 85, 247, 0.06) 75%, transparent 100%)',
            backgroundSize: '200% 100%'
          }}></div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="w-full max-w-full bg-black relative overflow-hidden" ref={containerRef}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/50 via-black to-green-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-yellow-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-red-950/20 via-transparent to-teal-950/30"></div>
        
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(255,100,0,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,255,100,0.2) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='5' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>
      </div>

      {/* Sparkles */}
      <div className="absolute top-[15%] right-[30%] text-white/50 text-2xl animate-pulse" style={{ animationDuration: '2s' }}>✦</div>
      <div className="absolute top-[35%] right-[25%] text-white/40 text-xl animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>✦</div>
      <div className="absolute top-[20%] left-[35%] text-white/30 text-lg animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}>✧</div>
      <div className="absolute bottom-[30%] left-[20%] text-white/40 text-2xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2s' }}>✧</div>

      {/* Section Heading */}
      <div className="relative z-20 text-center pt-8 pb-4 max-w-8xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Our Achievements</h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      {/* 3D View */}
      {view === '3d' && (
        <div className="relative z-10 h-[500px] flex items-center justify-center transition-opacity duration-1000 max-w-8xl mx-auto" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {cards.map((card) => (
              <div
                key={card.id}
                className="absolute top-1/2 left-1/2 transition-all duration-100 ease-out cursor-pointer"
                style={{
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                  transformStyle: 'preserve-3d',
                  ...getCardTransform(card)
                }}
              >
                <CardComponent card={card} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrolling View */}
      {view === 'scroll' && (
        <div className="relative z-10 py-6 w-full overflow-hidden mx-auto" style={{ maxWidth: '112rem' }}>

          <div className="w-full space-y-6">
            {/* Row 1 */}
            <div className="flex gap-6 animate-scroll-right whitespace-nowrap">
              {[...scrollingCards, ...scrollingCards, ...scrollingCards].map((card, idx) => (
                <div key={`row1-${idx}`} className="inline-block">
                  <CardComponent card={card} isScrolling />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-6 animate-scroll-left whitespace-nowrap">
              {[...scrollingCards, ...scrollingCards, ...scrollingCards].map((card, idx) => (
                <div key={`row2-${idx}`} className="inline-block">
                  <CardComponent card={card} isScrolling />
                </div>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex gap-6 animate-scroll-right whitespace-nowrap">
              {[...scrollingCards, ...scrollingCards, ...scrollingCards].map((card, idx) => (
                <div key={`row3-${idx}`} className="inline-block">
                  <CardComponent card={card} isScrolling />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        
        @keyframes scroll-left {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradient-sweep {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        @keyframes white-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer-elegant {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }
        
        .animate-scroll-right {
          animation: scroll-right 15s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scroll-left 15s linear infinite;
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 4s ease-in-out infinite;
        }
        
        .animate-gradient-sweep {
          animation: gradient-sweep 3s linear infinite;
        }
        
        .animate-white-glow {
          animation: white-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-shimmer-elegant {
          animation: shimmer-elegant 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}