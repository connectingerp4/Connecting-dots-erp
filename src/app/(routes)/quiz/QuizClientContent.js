'use client';

import React, { useEffect, useState, useMemo } from "react";
import { getAllQuizzes } from "@/utils/quizUtils";
import QuizTopicCard from "@/components/quiz/QuizTopicCard";
import { BookOpenIcon, AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function QuizClientContent() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'sap', name: 'SAP' },
    { id: 'non-sap', name: 'Non-SAP' }
  ];

  const filteredQuizzes = useMemo(() => {
    if (activeCategory === 'all') return quizzes;
    
    return quizzes.filter(quiz => {
      // Check if quiz ID starts with 'sap-' or title contains 'SAP'
      const isSapQuiz = quiz.id.startsWith('sap-') || 
                       quiz.id === 'sap' ||
                       (quiz.title && quiz.title.toLowerCase().includes('sap'));
      
      if (activeCategory === 'sap') {
        return isSapQuiz;
      } else if (activeCategory === 'non-sap') {
        return !isSapQuiz;
      }
      
      return true;
    });
  }, [quizzes, activeCategory]);

  useEffect(() => {
    // Load quizzes from the JSON file
    try {
      const loadedQuizzes = getAllQuizzes();
      console.log('Loaded quizzes:', loadedQuizzes);
      setQuizzes(loadedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B4168]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] rounded-full">
              <AcademicCapIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] bg-clip-text text-transparent">
              {" "}
              Quiz Topic
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge and improve your skills with our interactive
            quizzes
          </p>
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative inline-block w-full md:w-64 mb-8">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4168] focus:border-[#1B4168] flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded="true"
          >
            <span className="truncate">
              {categories.find(cat => cat.id === activeCategory)?.name || 'Select Category'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeCategory === category.id ? 'bg-blue-50 text-[#1B4168] font-medium' : 'text-gray-700'}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-[#2FA9EC] mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.length}
                </p>
                <p className="text-gray-600">Quiz Topics</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-[#1B4168] mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.reduce(
                    (total, quiz) => total + (quiz.questions?.length || 0),
                    0
                  )}
                </p>
                <p className="text-gray-600">Total Questions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-[#1B4168] to-[#2FA9EC] rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">∞</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Unlimited</p>
                <p className="text-gray-600">Attempts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            difficulty: quiz.difficulty,
            questionCount: quiz.questions?.length || 0,
            icon: quiz.icon || '📚',
            category: quiz.category || 'General'
          })).map((topic) => (
            <QuizTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
