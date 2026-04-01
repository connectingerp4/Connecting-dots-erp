// components/CoursesComponents/Modules.js (Next.js + Tailwind Responsive)
"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

const Modules = ({ data }) => {
  const [activeTab, setActiveTab] = useState("beginner");
  const [activeModule, setActiveModule] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const moduleRef = useRef(null);
  const observerRef = useRef(null);

  // Set initial activeTab once data is available
  useEffect(() => {
    if (data && data.tabs && data.tabs.length > 0) {
      setActiveTab(data.tabs[0].type);
    }
  }, [data]);

  // Setup intersection observer to detect when component is visible
  useEffect(() => {
    if (!moduleRef.current || observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(moduleRef.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Force visibility after a timeout to ensure rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleModuleClick = useCallback(
    (moduleIndex) => {
      if (activeModule !== moduleIndex) {
        setActiveModule(moduleIndex);
      }
    },
    [activeModule]
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setActiveModule(0);
  }, []);

  const activeContent = useMemo(() => {
    if (data && data.tabs) {
      const activeTabData = data.tabs.find((tab) => tab.type === activeTab);
      if (
        activeTabData &&
        activeTabData.modules &&
        activeTabData.modules.length > activeModule
      ) {
        return activeTabData.modules[activeModule];
      }
    }
    return null;
  }, [data, activeTab, activeModule]);

  // Simplified loading/error handling as data is passed directly
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center text-gray-600">
          No Modules data available (check masterData.js or prop passing).
        </div>
      </div>
    );
  }

  // Ensure data.tabs and activeTab content exists before trying to access modules
  const currentTabData = data.tabs.find((tab) => tab.type === activeTab);
  if (!currentTabData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center text-red-600">
          Selected tab data not found.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={moduleRef}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {data.title}
        </h1>
      </div>

      {/* Tabs - Responsive */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b-2 border-gray-200 overflow-x-auto">
          {data.tabs.map((tab) => (
            <div
              key={tab.type}
              className={`
                flex-1 min-w-0 p-3 sm:p-4 cursor-pointer transition-all duration-300 rounded-t-lg
                ${
                  activeTab === tab.type
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
              onClick={() => handleTabChange(tab.type)}
            >
              <div className="text-center">
                <p className="font-semibold text-sm sm:text-base mb-1">
                  {tab.type.charAt(0).toUpperCase() + tab.type.slice(1)}
                </p>
                <span
                  className={`
                  text-xs sm:text-sm
                  ${activeTab === tab.type ? "text-blue-100" : "text-gray-500"}
                `}
                >
                  {tab.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Container - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Modules List */}
        <div className="order-2 lg:order-1">
          <div className="space-y-3 sm:space-y-4 max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {currentTabData.modules.map((module, index) => (
              <div
                key={index}
                className={`
                  p-4 sm:p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 transform
                  ${
                    activeModule === index
                      ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm hover:scale-[1.01] text-gray-900 hover:text-black"
                  }
                `}
                onClick={() => handleModuleClick(index)}
              >
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    MODULE - {index + 1}
                  </p>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-black">
                    {module.title}
                  </h2>
                  <span className="inline-block text-sm sm:text-base text-gray-600 font-medium">
                    {module.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Details */}
        <div className="order-1 lg:order-2">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 min-h-[300px] lg:min-h-[500px]">
            {activeContent ? (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight">
                  {activeContent.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Duration:</span>
                  <span className="text-gray-600 font-medium">
                    {activeContent.duration}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    What you'll learn:
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {activeContent.content.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-relaxed"
                      >
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base">
                    Select a module to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <div className="text-center">
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base">
            Download Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modules;
