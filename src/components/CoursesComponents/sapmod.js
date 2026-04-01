"use client";

import React, { useState, useEffect } from "react";
import Btnform from "@/components/HomePage/Btnform";

// SapModComponent receives data prop directly from parent
const SapModComponent = ({ data }) => {
  const [curriculum, setCurriculum] = useState([]);
  const [stats, setStats] = useState([]);
  const [openIdx, setOpenIdx] = useState(0);
  const [cardPopStates, setCardPopStates] = useState([]);
  const [hoveredModuleIdx, setHoveredModuleIdx] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Transform data when the data prop changes
  useEffect(() => {
    if (!data) return;

    // Transform curriculum data
    let transformedCurriculum = [];

    // Check different data structures for curriculum
    if (data.overview?.modules && Array.isArray(data.overview.modules)) {
      // Standard sapMod structure
      transformedCurriculum = data.overview.modules.map((mod) => ({
        title: mod.name,
        labelColor: "bg-lime-300",
        duration: mod.duration || "1-2 weeks",
        topics: mod.subtopics || [], // Changed from topics to subtopics
      }));
    } else if (data.modules && Array.isArray(data.modules)) {
      // Direct modules structure (your JSON format)
      transformedCurriculum = data.modules.map((mod) => ({
        title: mod.name,
        labelColor: "bg-lime-300",
        duration: mod.duration || "1-2 weeks",
        topics: mod.subtopics || [], // Use subtopics from your JSON
      }));
    } else if (
      data.modules &&
      Array.isArray(data.modules) &&
      data.modules[0]?.title &&
      Array.isArray(data.modules[0]?.subtopics)
    ) {
      // Alternative modules structure with subtopics
      transformedCurriculum = data.modules.map((mod) => ({
        title: mod.title,
        labelColor: "bg-lime-300",
        duration: mod.duration || "1-2 weeks",
        topics: Array.isArray(mod.subtopics) ? mod.subtopics : [],
      }));
    } else if (
      data.modules &&
      Array.isArray(data.modules) &&
      typeof data.modules[0] === "string"
    ) {
      // Simple string modules
      transformedCurriculum = data.modules.map((title) => ({
        title,
        labelColor: "bg-lime-300",
        duration: "1-2 weeks",
        topics: [],
      }));
    }

    setCurriculum(transformedCurriculum);

    // Transform stats data from features
    const features = data.features || [];
    const transformedStats = features.map((feature) => ({
      value: feature.label,
      label: feature.description,
      icon: feature.description?.toLowerCase().includes("languages") ? (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="12" fill="#e3eaf2" />
          <path
            d="M12 7v10m5-5H7"
            stroke="#4a90e2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="12" fill="#e3eaf2" />
          <path
            d="M12 8v4l3 3"
            stroke="#4a90e2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    }));

    setStats(transformedStats);
    setCardPopStates(Array(transformedCurriculum.length).fill(false));
    setOpenIdx(0);
  }, [data]);

  // Card animation effect
  useEffect(() => {
    if (curriculum.length > 0) {
      let timeouts = [];
      for (let i = 0; i < curriculum.length; i++) {
        timeouts.push(
          setTimeout(() => {
            setCardPopStates((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * 120)
        );
      }
      return () => timeouts.forEach(clearTimeout);
    }
  }, [curriculum]);

  // Form handling (simplified like Counselor component)
  const handleDownloadBrochureClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    setShowForm(false);

    // After form submission, download file
    setTimeout(() => {
      if (data && data.downloadLink) {
        const link = document.createElement("a");
        link.href = data.downloadLink;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Download link is not available.");
      }
    }, 1000);
  };

  // No data state
  if (!data) {
    return (
      <div className="w-full bg-[#2d2d2d] mb-16 sm:mb-20 lg:mb-24">
        <div className="flex items-center justify-center py-16">
          <div className="text-white text-xl text-center">
            No SAP Modules data available (check masterData.js or prop passing).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#2d2d2d] mb-4 sm:mb-4 lg:mb-4">
      <div className="bg-[#2d2d2d] flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[600px]">
        {/* Header */}
        <div className="w-full max-w-6xl mb-6 sm:mb-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white text-center"
            style={{
              fontFamily: "Inter, Segoe UI, Roboto, Arial, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            SYLLABUS
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 w-full max-w-6xl items-start">
          {/* Left Card */}
          <div
            className="group bg-[#162e5b] rounded-lg p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 w-full md:w-96 text-white shadow-lg relative overflow-hidden"
            style={{ minHeight: "500px" }}
          >
            {/* Neon blue grid effect */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(75,121,210,0.15) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(75,121,210,0.15) 0 1px, transparent 1px 40px)",
                boxShadow: "0 0 40px 10px #4b79d2",
                filter: "drop-shadow(0 0 12px #4b79d2)",
                borderRadius: "inherit",
                transition: "opacity 0.5s",
              }}
            />

            {/* Content above the effect */}
            <div className="relative z-10 flex flex-col gap-4">
              <div>
                <h2
                  className="text-lg sm:text-xl font-bold leading-tight mb-2"
                  style={{ color: "#ffffff" }}
                >
                  {(data.title2 || data.title || "Course Title").replace(
                    /<[^>]+>/g,
                    ""
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 mb-4">
                  {data.description || "Course description"}
                  <br className="hidden sm:block" />
                  {data.summary || "Course summary"}
                </p>
              </div>

              {/* Stats from features */}
              <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                {stats
                  .filter((stat) => stat.label !== "Case Studies & Projects")
                  .map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/80 rounded-xl p-2 px-3 w-full text-xs scale-105 shadow-lg transition-all duration-300"
                      style={{ minWidth: 120, color: "#23608a" }}
                    >
                      <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <div>
                        <div
                          className="text-sm sm:text-lg font-bold"
                          style={{ color: "#23608a" }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="text-xs sm:text-sm font-semibold"
                          style={{ color: "#23608a" }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* SAP Course Image */}
              <div className="mt-4 flex justify-center">
                <img
                  src="https://res.cloudinary.com/dudu879kr/image/upload/v1752142527/SAP_cderp_bperso.webp"
                  alt="SAP Course"
                  className="w-full max-w-xs rounded-lg shadow-lg"
                  style={{ maxWidth: "100%" }}
                />
              </div>

              {/* Download Brochure button for desktop */}
              <button
                onClick={handleDownloadBrochureClick}
                className="mt-4 font-bold rounded-full py-2 px-6 transition-all duration-200 items-center justify-center gap-2 text-base hidden sm:flex shadow-lg border-0 bg-[#091327] text-white"
                style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)" }}
              >
                Download Brochure
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M16 3v4M8 3v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              {/* Note master */}
              {data.noteMaster && (
                <p className="text-red-300 text-center text-sm mt-2">
                  {data.noteMaster}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-center justify-center px-4 mt-2">
            <ProgressBar steps={curriculum.length} activeStep={openIdx} />
          </div>

          {/* Right Curriculum Content */}
          <div className="flex-1 w-full max-w-3xl relative">
            <div className="relative z-10 flex flex-col px-1 sm:px-0">
              {curriculum.map((mod, idx) => (
                <div
                  key={`${mod.title}-${idx}`}
                  className={`flex mb-2 items-start transition-all duration-500 relative ${
                    cardPopStates[idx]
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }`}
                  style={{
                    minHeight: "52px",
                    marginLeft: "2px",
                    position: "relative",
                    transitionDelay: `${idx * 80}ms`,
                  }}
                  onMouseEnter={() => {
                    setOpenIdx(idx);
                    setHoveredModuleIdx(idx);
                  }}
                  onMouseLeave={() => {
                    setHoveredModuleIdx(null);
                  }}
                  onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                >
                  {/* Blue card background */}
                  <div
                    className="absolute -left-0.5 top-0.5 w-full bg-[#4b79d2] rounded-xl shadow-lg"
                    style={{
                      height: "calc(70% - 2px)",
                      boxShadow: "0 2px 8px 0 #4b79d2",
                      zIndex: 10,
                    }}
                  />

                  {/* Module Card */}
                  <div
                    className="flex-1 bg-white rounded-[10px] shadow transition-all relative"
                    style={{
                      width: "100%",
                      marginLeft: 0,
                      paddingLeft: 0,
                      zIndex: 20,
                    }}
                  >
                    <div className="flex items-center justify-between px-2 sm:px-4 py-2 cursor-pointer select-none relative">
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <span className="text-xs font-bold px-2 py-1 rounded text-gray-900 whitespace-nowrap">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate relative">
                          {mod.title}
                          {/* Hover tooltip for subtopics */}
                          {hoveredModuleIdx === idx &&
                            mod.topics &&
                            mod.topics.length > 0 && (
                              <div
                                className="absolute left-0 top-full mt-2 w-80 bg-white text-black rounded-lg shadow-2xl p-4 border border-gray-200"
                                style={{ zIndex: 1000 }}
                              >
                                <div className="text-sm font-semibold mb-2 text-blue-600">
                                  Module Topics:
                                </div>
                                <ul className="space-y-1">
                                  {mod.topics.map((topic, topicIdx) => (
                                    <li
                                      key={topicIdx}
                                      className="text-xs text-gray-700 flex items-start"
                                    >
                                      <span className="text-lime-500 mr-2">
                                        •
                                      </span>
                                      <span>{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <span className="text-xs text-gray-700 font-semibold flex items-center gap-1">
                          <svg
                            width="14"
                            height="14"
                            className="sm:w-4 sm:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="#666666"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 8v4l2 2"
                              stroke="#666666"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">
                            {mod.duration}
                          </span>
                          <span className="sm:hidden text-xs">
                            {mod.duration.replace(" Weeks", "w")}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Expanded content for subtopics (click to expand) */}
                    {openIdx === idx && mod.topics && mod.topics.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 px-4 sm:px-8 pb-4 pt-2 text-sm text-gray-800">
                        {mod.topics.map((topic, topicIdx) => (
                          <li
                            key={`${topic}-${topicIdx}`}
                            className="list-none before:content-['•'] before:mr-2 before:text-lime-400"
                          >
                            {topic}
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Note */}
              {curriculum.length > 0 && (
                <p className="text-center text-white text-sm mt-6">
                  *Note: To see the complete Modules Click on 'Download
                  Syllabus' button
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Download Brochure button */}
        <div className="flex sm:hidden w-full justify-center items-center mt-6 mb-4">
          <button
            onClick={handleDownloadBrochureClick}
            className="font-bold rounded-full py-3 px-6 transition-all duration-200 flex items-center justify-center gap-2 text-base mx-auto shadow-lg border-0 bg-[#091327] text-white"
            style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)" }}
          >
            Download Brochure
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 3v4M8 3v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Note section */}
        {data.note && (
          <div className="w-full max-w-6xl mt-8 text-center">
            <p
              className="text-white text-sm"
              dangerouslySetInnerHTML={{
                __html: data.note.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        )}
      </div>

      {/* Simple Form Connection (same as Counselor component) */}
      {showForm && (
        <Btnform onClose={handleCloseForm} onSubmit={handleFormSubmit} />
      )}

      {/* Success Message */}
      {formSubmitted && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Thank you! Download will start shortly.
          </div>
        </div>
      )}
    </div>
  );
};

function ProgressBar({ steps, activeStep }) {
  const dotSize = 16;
  const cardHeight = 74;
  const barHeight = steps * cardHeight;
  const offset = cardHeight / 2 - dotSize / 2;
  const lineTop = offset + dotSize;
  const lineHeight = (steps - 1) * cardHeight;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ height: barHeight, width: "40px", justifyContent: "center" }}
    >
      {/* Vertical line */}
      <div
        className="absolute left-1/2"
        style={{
          top: lineTop,
          height: lineHeight,
          width: "2px",
          background: "#f3f3f3",
          transform: "translateX(-50%)",
        }}
      />

      {/* Progress dots */}
      {[...Array(steps)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center relative"
          style={{
            width: 24,
            position: "absolute",
            top: offset + idx * cardHeight,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 transition-all duration-200"
            style={{
              background: "#f3f3f3",
              borderColor: "#f3f3f3",
              boxShadow: activeStep === idx ? "0 0 0 4px #4b79d2" : "none",
              transition: "box-shadow 0.2s",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default SapModComponent;
