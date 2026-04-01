"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, XCircle, Brain, Zap, Trophy } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from "next/link";

// Circular Progress Component
const CircularProgressStep = ({ 
  currentStep, 
  totalSteps, 
  size = 80,
  strokeWidth = 6 
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs sm:text-sm font-semibold text-gray-100">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};

const QuizCompo = ({ onReady }) => {
  const quizQuestions = [
    {
      question: "Which master data directly influences purchasing in SAP MM?",
      options: ["Material master and vendor master", "Cost center and work center", "BOM and routing", "Customer master and pricing condition records"],
      correctAnswer: 0
    },
    {
      question: "What does SAP stand for?",
      options: ["Systems, Analytics, Platforms", "Systems Applications and Products in Data Processing", "Software for Accounting Processes", "Standard Application Platform"],
      correctAnswer: 1
    },
    {
      question: "Which is SAP's modern real-time ERP suite?",
      options: ["SAP R/3", "SAP ECC", "SAP BW", "SAP S/4HANA"],
      correctAnswer: 3
    },
    {
      question: "In the MM procurement cycle, which document usually comes first?",
      options: ["Purchase Order", "Goods Receipt", "Purchase Requisition", "Invoice"],
      correctAnswer: 2
    },
    {
      question: "Which module handles customer-to-cash?",
      options: ["MM", "PP", "SD", "QM"],
      correctAnswer: 2
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (typeof onReady === 'function') {
      onReady();
    }
  }, [onReady]);

  // Auto-advance timer
  useEffect(() => {
    if (answered || showFeedback) return;
    
    const questionTimer = setTimeout(() => {
      handleNextQuestion();
    }, 15000);

    return () => clearTimeout(questionTimer);
  }, [currentQuestionIndex, answered, showFeedback]);

  // Reset state on question change
  useEffect(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setShowFeedback(false);
    
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(false);
      setAnswered(false);
      setIsTransitioning(false);
    }, 150);
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (isTransitioning) return;
    setCurrentQuestionIndex(prev => (prev + 1) % quizQuestions.length);
  };

  const handlePrevQuestion = () => {
    if (isTransitioning) return;
    setCurrentQuestionIndex(prev => (prev - 1 + quizQuestions.length) % quizQuestions.length);
  };

  const handleQuestionSelect = (index) => {
    if (isTransitioning || index === currentQuestionIndex) return;
    setCurrentQuestionIndex(index);
  };

  const handleOptionClick = (optionIndex) => {
    if (showFeedback || answered) return;
    
    setSelectedAnswer(optionIndex);
    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswered(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (!isTransitioning) {
        handleNextQuestion();
      }
    }, 3000);
  };

  return (
    <div className="relative w-full min-h-[650px] sm:min-h-[700px] md:min-h-[780px] lg:min-h-[800px] overflow-hidden">
      {/* Wave Background */}
      <div className="absolute inset-0 bg-white sm:bg-gradient-to-r from-[#182E4A] via-[#182E4A] to-[#182E4A]">
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

      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-12 flex flex-col justify-center relative z-10">
        
       <div className="hidden sm:block absolute top-2 sm:top-4 right-3 sm:right-6 md:right-12 lg:right-20 z-20">
  <CircularProgressStep 
    currentStep={currentQuestionIndex + 1}
    totalSteps={quizQuestions.length}
    size={isMobile ? 60 : 80}
    strokeWidth={6}
  />
</div>


        {/* Mobile Layout - OPTIMIZED */}
        <div className="block lg:hidden space-y-3 pt-2 sm:pt-4 relative">
          {/* SVG Background Elements */}
          <svg
            className="sm:hidden absolute top-0 right-1 w-full -z-10"
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
            className="sm:hidden absolute top-50 right-1 w-full -z-10"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{ height: '0.5%', width: '145%', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}
          >
            <path
              d="M0,0 L1440,0 L1440,100 L0,100 Z"
              fill="#182E4A"
            />
          </svg>

          <svg
            className="sm:hidden absolute top-50 right-40 -z-10"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{
              height: '90%',
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
            className="sm:hidden absolute top-50 right-40 -z-10"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{
              height: '58%',
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

          {/* Header - Compact */}
          <div className="text-center bg-gradient-to-r from-blue-100 to-purple-100 p-2.5 sm:p-2 rounded-lg relative z-10">
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent">
                Quick Quiz
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quizQuestions.length} • Score: {score}
            </p>
          </div>

          {/* Question Section - Compact */}
          <div className="space-y-3">
            <div className="min-h-[50px] sm:min-h-[60px] flex items-center justify-center px-2">
              <h2 className="text-md sm:text-base md:text-lg font-bold text-black leading-snug text-center">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options - Compact Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 transition-all duration-500 ease-out transform ${
              !isTransitioning ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={showFeedback || answered || isTransitioning}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`w-full p-2.5 sm:p-3 min-h-[44px] sm:min-h-[52px] rounded-lg sm:rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-300 transform active:scale-95 ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 shadow-lg'
                        : index === selectedAnswer && !isCorrect
                        ? 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-800 shadow-lg'
                        : 'bg-gray-50 text-gray-500 border-2 border-gray-200 opacity-60'
                      : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      showFeedback && index === currentQuestion.correctAnswer
                        ? 'bg-green-500 text-white'
                        : showFeedback && index === selectedAnswer && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 break-words leading-tight">{option}</span>
                    {showFeedback && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    )}
                    {showFeedback && index === selectedAnswer && !isCorrect && (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback - Compact */}
            {showFeedback && (
              <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm font-bold animate-bounceIn shadow-lg transition-all duration-500 transform ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {isCorrect ? (
                    <>
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>🎉 Excellent!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>💪 Keep learning!</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Quiz Button - Sticky Bottom */}
          <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-blue-50/95 to-purple-50/95 backdrop-blur-sm p-3 rounded-t-xl shadow-2xl border-t-2 border-blue-200 mt-4">
            <Link href="/quiz" passHref>
              <button className="w-full flex items-center bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 sm:py-3 rounded-full justify-center gap-2 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm sm:text-base">
                  Start Full Quiz
                </span>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </Link>

            {/* Question Indicators */}
            <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-3">
              {quizQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionSelect(index)}
                  disabled={isTransitioning}
                  aria-label={`Go to question ${index + 1}`}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                    index === currentQuestionIndex 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 w-6 sm:w-8 shadow-md' 
                      : 'bg-gray-300 w-2 sm:w-2.5 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - UNCHANGED BUT OPTIMIZED */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          <div className="flex-1 space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mt-28">
              <Brain className="w-10 h-10 text-white" />
              <div>
                <h2 className="text-3xl font-bold text-gray-200">
                  Interactive Quiz Preview
                </h2>
                <p className="text-gray-400 text-lg">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length} • Score: {score}/{quizQuestions.length}
                </p>
              </div>
            </div>

            {/* Question - No Typewriter */}
            <div className="min-h-[80px] flex items-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options - Desktop Grid */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ease-out transform ${
              !isTransitioning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={showFeedback || answered || isTransitioning}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  className={`p-3 lg:p-5 rounded-xl text-left font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 shadow-xl'
                        : index === selectedAnswer && !isCorrect
                        ? 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-800 shadow-xl'
                        : 'bg-gray-50 text-gray-500 border-2 border-gray-200 opacity-60'
                      : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 shadow-md hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      showFeedback && index === currentQuestion.correctAnswer
                        ? 'bg-green-500 text-white scale-110'
                        : showFeedback && index === selectedAnswer && !isCorrect
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showFeedback && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {showFeedback && index === selectedAnswer && !isCorrect && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-xl text-center font-bold text-lg animate-bounceIn shadow-xl ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
              }`}>
                <div className="flex items-center justify-center gap-3">
                  {isCorrect ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      <span>Outstanding! Perfect answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      <span>Great effort! Keep going!</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="flex items-center justify-center gap-6 py-4">
              <button
                onClick={handlePrevQuestion}
                disabled={isTransitioning}
                aria-label="Previous question"
                className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6 text-blue-600 rotate-180" />
              </button>
              
              <div className="flex space-x-2">
                {quizQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(index)}
                    disabled={isTransitioning}
                    aria-label={`Go to question ${index + 1}`}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500 text-white scale-110'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={isTransitioning}
                aria-label="Next question"
                className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Right Side - Animation & Button */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-[700px]">
              <DotLottieReact
                src="https://lottie.host/22c5be73-3d80-42b8-9f36-2a36962bdf72/ZbI024bB27.lottie"
                loop
                autoplay
              />
            </div>

            <Link href="/quiz" passHref>
              <button className="flex items-center bg-blue-600 px-6 py-3 rounded-full justify-center gap-3 cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-xl">
                <Zap className="w-6 h-6 text-white" />
                <span className="text-white font-extrabold">
                  Start Full Quiz
                </span>
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          .animate-bounceIn {
            animation: bounceIn 0.6s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizCompo;
