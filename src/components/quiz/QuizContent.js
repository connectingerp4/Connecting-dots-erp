// src/components/quiz/QuizContent.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQuizByTopic } from "@/utils/quizUtils";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  FireIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

export default function QuizContent({ params }) {
  const router = useRouter();
  const { topic } = params;
  
  // Load quiz data
  const [quiz, setQuiz] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadQuiz = async () => {
      console.log('Loading quiz for topic:', topic); // Debug log
      
      if (!topic) {
        console.log('No topic provided'); // Debug log
        setError('No quiz topic specified');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching quiz data...'); // Debug log
        const quizData = getQuizByTopic(topic);
        console.log('Quiz data:', quizData); // Debug log
        
        if (!quizData) {
          throw new Error(`Quiz with topic '${topic}' not found`);
        }
        
        // Ensure the quiz has all required properties
        const processedQuiz = {
          ...quizData,
          questions: quizData.questions || []
        };
        
        console.log('Processed quiz:', processedQuiz); // Debug log
        setQuiz(processedQuiz);
        setTimeRemaining(processedQuiz.duration || 300); // Set initial time
        setError(null);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [topic]);
  
  // Quiz state management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quiz?.duration || 0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Timer countdown effect
  useEffect(() => {
    if (!quizStarted || quizComplete || !quiz) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setQuizComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizComplete, quiz]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate score and statistics
  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === undefined) {
        unanswered++;
      } else if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return {
      correct,
      incorrect,
      unanswered,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      timeTaken: quiz.duration - timeRemaining
    };
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (showAnswer) return; // Prevent changing answer after showing explanation
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
    setShowAnswer(true);
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(selectedAnswers[currentQuestion + 1] !== undefined);
    } else {
      setQuizComplete(true);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowAnswer(selectedAnswers[currentQuestion - 1] !== undefined);
    }
  };

  // Jump to specific question
  const handleQuestionJump = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowAnswer(selectedAnswers[questionIndex] !== undefined);
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizStartTime(Date.now());
  };

  // Retry quiz
  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowAnswer(false);
    setQuizComplete(false);
    setTimeRemaining(quiz.duration);
    setQuizStarted(false);
    setQuizStartTime(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz...</h2>
            <p className="text-gray-600">Please wait while we prepare your quiz</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 mb-2">
              {error || 'The requested quiz could not be loaded.'}
            </p>
            <p className="text-sm text-gray-500">
              Please check the URL or try again later.
            </p>
          </div>
          <button
            onClick={() => router.push("/quiz")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ?.correctAnswer;

  // Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Back Button */}
          <button
            onClick={() => router.push("/quiz")}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-[#1B4168] font-medium transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Topics
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1B4168] to-[#2FA9EC] rounded-full flex items-center justify-center mb-4">
              <span className="text-5xl">{quiz.icon || <TrophyIcon className="h-10 w-10 text-white" />}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>

          {/* Quiz Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#1B4168]">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4168]">
                  {Math.floor(quiz.duration / 60)}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4168]">
                  {quiz.difficulty}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Instructions:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Answer all questions within the time limit</li>
              <li>• You can navigate between questions using Previous/Next buttons</li>
              <li>• Explanations will be shown after selecting an answer</li>
              <li>• Your score will be calculated at the end</li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <FireIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
            Start Quiz Now
            <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizComplete) {
    const score = calculateScore();
    const scoreEmoji = score.percentage >= 80 ? "🎉" : score.percentage >= 60 ? "👍" : score.percentage >= 40 ? "😊" : "😅";
    const scoreMessage = 
      score.percentage >= 80 ? "Excellent work! You've mastered this topic!" :
      score.percentage >= 60 ? "Good job! You're on the right track." :
      score.percentage >= 40 ? "Not bad! Keep practicing to improve." :
      "Keep learning! Practice makes perfect.";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 pb-10 max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
              score.percentage >= 70 ? "bg-green-100" : score.percentage >= 50 ? "bg-yellow-100" : "bg-red-100"
            }`}>
              <span className="text-6xl">{scoreEmoji}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">{scoreMessage}</p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-[#1B4168] mb-2">
                {score.percentage}%
              </div>
              <div className="text-gray-600 text-lg">
                {score.correct} out of {score.total} correct
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{score.incorrect}</div>
                <div className="text-xs text-gray-600">Incorrect</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{score.unanswered}</div>
                <div className="text-xs text-gray-600">Unanswered</div>
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Time Taken
                </span>
                <span className="font-bold text-gray-900">
                  {formatTime(score.timeTaken)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <FireIcon className="h-5 w-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => router.push("/quiz")}
              className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Back to Topics
            </button>
            <p className="text-gray-600 text-sm pb-5">Note: This quiz is only for educational purposes. It is not a guarantee of employment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen (Active Quiz)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="sr-only">QUIZ Begin</h1>
        {/* Back Button */}
        <button
          onClick={() => router.push("/quiz")}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-[#1B4168] font-medium transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Topics
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-20">
          {/* Header with Timer */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h2>
              <div className="text-sm text-gray-500 mt-1">{quiz.title}</div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-50 text-[#1B4168]"
            }`}>
              <ClockIcon className="h-5 w-5" />
              <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const isCorrectAnswer = index === currentQ.correctAnswer;
                
                let optionClass = "bg-white border-2 border-gray-200 hover:border-[#2FA9EC] hover:shadow-md text-gray-700";
                
                if (showAnswer) {
                  if (isCorrectAnswer) {
                    optionClass = "bg-green-50 border-2 border-green-500 text-green-800 shadow-lg transform scale-[1.02]";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClass = "bg-red-50 border-2 border-red-500 text-red-800 shadow-lg";
                  } else {
                    optionClass = "bg-gray-50 border-2 border-gray-200 text-gray-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionClass = "bg-blue-50 border-2 border-[#2FA9EC] text-[#1B4168] shadow-md";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${optionClass} ${
                      !showAnswer ? "cursor-pointer active:scale-95" : "cursor-default"
                    }`}
                  >
                    <span className="flex items-center text-left">
                      <span className="mr-3 font-bold text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </span>
                    {showAnswer && isCorrectAnswer && (
                      <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 animate-bounce" />
                    )}
                    {showAnswer && isSelected && !isCorrectAnswer && (
                      <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className={`mb-6 p-5 rounded-xl animate-fadeIn ${
              isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-blue-50 border-2 border-blue-200"
            }`}>
              <div className="flex items-start">
                <div className="mr-3 mt-1 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <span className="text-2xl">💡</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">
                    {isCorrect ? "✅ Correct!" : "📚 Explanation"}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Question Navigator (Mini) */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionJump(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                  index === currentQuestion
                    ? "bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] text-white shadow-lg scale-110"
                    : selectedAnswers[index] !== undefined
                    ? selectedAnswers[index] === quiz.questions[index].correctAnswer
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-red-100 text-red-700 border-2 border-red-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {Object.keys(selectedAnswers).length}/{quiz.questions.length} answered
            </div>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-6 py-3 bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] text-white font-semibold rounded-xl hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
            >
              {currentQuestion === quiz.questions.length - 1 ? (
                <>
                  Finish Quiz
                  <TrophyIcon className="h-5 w-5 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
