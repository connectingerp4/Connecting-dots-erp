"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CareerHeroSlide from './HeaderCarousel1';
import HeaderCarousel3 from "./HeaderCarousel2";
import QuizComponent from "./HeaderCarousel3";

// Dynamically import Btnform with SSR disabled
const Btnform = dynamic(() => import('./Btnform'), { ssr: false });

const HeaderCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizReady, setQuizReady] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = useCallback(() => {
    setShowForm(prev => !prev);
  }, []);

  const components = [
    {
      component: ({ onReady }) => (
        <div className="w-full h-full">
          <HeaderCarousel3 onReady={onReady} />
        </div>
      )
    },
    {
      component: ({ onReady }) => (
        <div className="w-full h-full">
          <CareerHeroSlide onOpenForm={toggleForm} onReady={onReady} />
        </div>
      )
    },
    {
      component: ({ onReady }) => (
        <div className="w-full h-full">
          <QuizComponent onReady={onReady} />
        </div>
      )
    }
  ];
 
  useEffect(() => {
    const currentTiming = currentSlide === 2 ? 40000 : 20000;
 
    if (currentSlide === 2 && !quizReady) {
      return;
    }
 
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % components.length);
      setQuizReady(false);
    }, currentTiming);
 
    return () => clearInterval(interval);
  }, [components.length, currentSlide, quizReady]);
 
  const goToSlide = (index) => {
    setCurrentSlide(index);
    setQuizReady(false);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto overflow-hidden relative">
      {/* ✅ FIXED: Mobile-optimized carousel container */}
      <div className="relative min-h-[650px] sm:min-h-[700px] md:min-h-[750px] lg:min-h-[800px] bg-white overflow-hidden">
        {/* Slide content */}
        {components.map(({ component: Component }, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Component onReady={() => setQuizReady(true)} />
          </div>
        ))}
        
        {/* ✅ FIXED: Better positioned dots for mobile */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 z-20">
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {components.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index
                    ? 'bg-black scale-110 sm:scale-125 ring-2 ring-offset-1 sm:ring-offset-2 ring-white/50'
                    : 'bg-black/50 hover:bg-black/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Btnform Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Btnform onClose={toggleForm} />
          </div>
        </div>
      )}
    </div>
  );
};
 
export default HeaderCarousel;
