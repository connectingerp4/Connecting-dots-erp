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
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238242/6_vhmpvb.avif',
      title: '',
      subtitle: '',
      baseRotation: -12,
      baseX: -35,
      baseY: 5,
      depth: 1,
      colorType: 'psychedelic'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238242/7_jtslft.avif',
      baseRotation: 3,
      baseX: -10,
      baseY: -8,
      depth: 2,
      colorType: 'urban'
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238242/13_gjhutl.avif',
      title: '',
      subtitle: '',
      text: '',
      time: '',
      baseRotation: 8,
      baseX: 15,
      baseY: -3,
      depth: 3,
      hasText: true
    },
    {
      id: 4,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238497/17_wbgza8.avif',
      title: '',
      baseRotation: -5,
      baseX: 40,
      baseY: 2,
      depth: 4,
      colorType: 'digital'
    }
  ];

  const scrollingCards = [
    ...cards,
    {
      id: 5,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238242/19_uoxzch.avif',
      title: '',
      colorType: 'neon'
    },
    {
      id: 6,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238241/4_tsc75p.avif',
      title: '',
      colorType: 'psychedelic'
    },
    {
      id: 7,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238241/5_cxz9yx.avif',
      title: '',
      colorType: ''
    },
    {
      id: 8,
      image: 'https://res.cloudinary.com/dujw4np0d/image/upload/v1762238241/14_ygoxic.avif',
      title: '',
      colorType: 'digital'
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

  const CardComponent = ({ card, isScrolling = false, imageClass = 'object-contain', imageStyle = {}, highlightBottom = false }) => (
    <div className={`${isScrolling ? 'flex-shrink-0 w-[220px]' : 'w-full h-full'} relative`}>
      <div className={`${isScrolling ? 'h-[300px]' : 'absolute inset-0'} bg-white rounded-sm`} style={!isScrolling ? { transform: 'translateZ(-2px)' } : {}}>
        <div className="absolute inset-2 rounded-sm overflow-hidden bg-black">
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
      </div>
    </div>
  );

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
                  width: '200px',
                  height: '250px',
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
            <div className="flex gap-6 animate-scroll-right whitespace-nowrap" style={{ animationDelay: '1s' }}>
              {[...scrollingCards, ...scrollingCards].map((card, idx) => (
                <div key={`row3-${idx}`} className="inline-block">
                  <CardComponent card={card} isScrolling />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-6 animate-scroll-left whitespace-nowrap">
              {[...scrollingCards, ...scrollingCards].reverse().map((card, idx) => (
                <div key={`row2-${idx}`} className="inline-block">
                  <CardComponent card={card} isScrolling />
                </div>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex gap-6 animate-scroll-right whitespace-nowrap" style={{ animationDelay: '1s' }}>
              {[...scrollingCards, ...scrollingCards].map((card, idx) => (
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
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
}