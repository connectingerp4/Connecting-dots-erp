"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { CityContext } from "@/context/CityContext";
import Branches from "@/components/HomePage/Branches";
import cities from "cities.json";

const ContactUsClientContent = ({
  formData = {},
  setFormData,
  handleSubmit: propHandleSubmit,
  isSubmitting: propIsSubmitting,
  submissionError: propSubmissionError,
}) => {
  const { city } = useContext(CityContext);

  // Local state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  // Initialize form data with explicit default values
  const [localFormData, setLocalFormData] = useState({
    name: formData.name || "",
    contact: formData.contact || "",
    email: formData.email || "",
    course: formData.course || "",
    countryCode: "+91",
  });
  // ===== LOCATION AUTOCOMPLETE STATES (COPIED FROM POPUP FORM) =====
  const [location, setLocation] = useState("");
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // import cities


  useEffect(() => {
    console.log("Current form data:", localFormData);
  }, [localFormData]);

  useEffect(() => {
    const loadLocationData = () => {
      try {
        setIsLoadingCities(true);

        const indianCities = cities.filter(
          (city) => city.country === "IN" || city.country === "India"
        );

        const allLocations = indianCities.map((city) =>
          city.subcountry ? `${city.name}, ${city.subcountry}` : city.name
        );

        const uniqueLocations = [...new Set(allLocations)].sort();

        setLocationSuggestions(uniqueLocations);
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadLocationData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        // delay closing so click can register
        setTimeout(() => {
          setShowSuggestions(false);
        }, 150);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countryCodes = [
    { code: "+91", country: "India", minLength: 10, maxLength: 10 },
    { code: "+1", country: "USA", minLength: 10, maxLength: 10 },
    { code: "+44", country: "UK", minLength: 10, maxLength: 11 },
    { code: "+61", country: "Australia", minLength: 9, maxLength: 9 },
    { code: "+81", country: "Japan", minLength: 10, maxLength: 10 },
    { code: "+49", country: "Germany", minLength: 10, maxLength: 11 },
    { code: "+33", country: "France", minLength: 9, maxLength: 9 },
    { code: "+86", country: "China", minLength: 11, maxLength: 11 },
    { code: "+7", country: "Russia", minLength: 10, maxLength: 10 },
    { code: "+39", country: "Italy", minLength: 10, maxLength: 10 },
    { code: "+55", country: "Brazil", minLength: 10, maxLength: 11 },
    { code: "+34", country: "Spain", minLength: 9, maxLength: 9 },
    { code: "+27", country: "South Africa", minLength: 9, maxLength: 9 },
    { code: "+971", country: "UAE", minLength: 9, maxLength: 9 },
    { code: "+62", country: "Indonesia", minLength: 10, maxLength: 12 },
    { code: "+90", country: "Turkey", minLength: 10, maxLength: 10 },
    { code: "+82", country: "South Korea", minLength: 9, maxLength: 10 },
    { code: "+60", country: "Malaysia", minLength: 9, maxLength: 10 },
    { code: "+31", country: "Netherlands", minLength: 9, maxLength: 9 },
    { code: "+52", country: "Mexico", minLength: 10, maxLength: 10 },
  ];

  const courseCategories = {
    "SAP Functional": [
      "SAP FICO", "SAP Ariba", "SAP MM", "SAP SD", "SAP HR/HCM",
      "SAP PP", "SAP QM", "SAP PM", "SAP PS", "SAP EWM",
      "SAP SCM", "SAP SUCCESSFACTOR"
    ],
    "SAP Technical": [
      "SAP ABAP", "SAP S/4 HANA", "SAP BW/BI", "SAP BASIS"
    ],
    "Data Visualization": [
      "Tableau", "Power BI", "SQL"
    ],
    "Digital Marketing": [
      "Advance Digital Marketing", "Pay Per Click Training",
      "Search Engine Optimization", "Social Media Marketing",
      "Advance Google Analytics Training"
    ],
    "HR Courses": [
      "HR Training", "Core HR", "HR Payroll",
      "HR Management", "HR Generalist", "HR Analytics"
    ],
    "IT Courses": [
      "MASTERS IN DATA ANALYTICS", "MASTERS IN DATA SCIENCE",
      "MASTERS IN BUSINESS ANALYTICS", "CHAT GPT & AI",
      "Full Stack Training", "JAVA", "MERN Stack",
      "UI/UX Design", "Python", "Salesforce", "Software Development"
    ]

  };

  // Branches information
  const branches = [
    {
      name: "PUNE BRANCH",
      phone: ["+91 9004002941", "+91 9004002958"],
      whatsapp: "https://wa.me/919004002941",
      position: { lat: 18.588048051275003, lng: 73.78119014757031 },
      address: "https://maps.app.goo.gl/v9UAPKTsSiT56VhC9",
      addresstext:
        "1st Floor,101, Police, Wireless Colony, Vishal Nagar, Pimple Nilakh, Pune, Pimpri-Chinchwad, Maharashtra 411027",
    },
    {
      name: "MUMBAI BRANCH",
      phone: ["+91 9004001938", "+91 9004005382"],
      whatsapp: "https://wa.me/919004005382",
      position: { lat: 19.259055941077712, lng: 72.96564544031934 },
      address: "https://maps.app.goo.gl/i7W3baVVS1mDLmTJ9",
      addresstext:
        "4th Floor, Ram Niwas, B-404, Gokhale Rd, near McDonald's, Dada Patil Wadi, Naupada, Thane West, Thane, Maharashtra 400602",
    },
    {
      name: "RAIPUR BRANCH",
      phone: ["+91 9004002958", "+91 9325701555"],
      whatsapp: "https://wa.me/919325701555",
      position: { lat: 21.23944689267376, lng: 81.65363342070017 },
      address: "https://maps.app.goo.gl/F1HVVYHfApaRvFMRA",
      addresstext:
        "G-54, New Panchsheel Nagar, Civil Lines, Raipur, Chhattisgarh 492001",
    },
  ];

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    // ❌ user typed → reset selection
    setIsLocationSelected(false);

    if (value.length > 0) {
      const filtered = locationSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );

      // ✅ Add "Other" option
      const finalSuggestions = [...filtered.slice(0, 9), "Other"];

      setFilteredSuggestions(finalSuggestions);
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setActiveSuggestion(-1);
    setIsLocationSelected(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    console.log(`Field changed: ${name} = ${value}`);

    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      setLocalFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setLocalFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (setFormData) {
      if (name === "contact") {
        const digitsOnly = value.replace(/\D/g, "");
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    console.log("Form submission:", localFormData);
    console.log("Country code:", localFormData.countryCode);

    const isValidLocation =
      locationSuggestions.includes(location) || location === "Other";

    if (!isValidLocation || !isLocationSelected) {
      setSubmissionError("Please select a valid location from dropdown");
      setIsSubmitting(false);
      return;
    }

    const countryCode = localFormData.countryCode || "+91";
    const selectedCountry = countryCodes.find(
      (country) => country.code === countryCode
    );

    if (!selectedCountry) {
      setSubmissionError(`Invalid country code: "${countryCode}"`);
      setIsSubmitting(false);
      return;
    }

    const { minLength, maxLength } = selectedCountry;

    if (
      localFormData.contact.length < minLength ||
      localFormData.contact.length > maxLength
    ) {
      setSubmissionError(
        `Phone number for ${selectedCountry.country} must be between ${minLength} and ${maxLength} digits`
      );
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(localFormData.contact)) {
      setSubmissionError("Phone number must contain only digits");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localFormData.email)) {
      setSubmissionError("Enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        name: localFormData.name,
        contact: localFormData.contact,
        email: localFormData.email,
        coursename: localFormData.course,
        countryCode: countryCode,
        location: location,
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      alert("Form submitted successfully!");

      setLocalFormData({
        name: "",
        contact: "",
        email: "",
        course: "",
        countryCode: "+91",
      });
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCountryMaxLength = () => {
    const countryCode = localFormData.countryCode || "+91";
    const selectedCountry = countryCodes.find(
      (country) => country.code === countryCode
    );
    return selectedCountry?.maxLength || 10;
  };

  return (
    <div className="py-12 px-4 w-full max-w-7xl mx-auto">
      <div className="container mx-auto">
        {/* Enhanced title with custom styling */}
        <div className="mb-12">
          <h2
            className="text-center font-bold uppercase"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "clamp(2px, 0.5vw, 4px)",
              textShadow: `
                0 0 0px #fff,
                0 0 10px #fff,
                0 0 10px #0073e6,
                0 0 20px #182e4a,
                0 0 20px #182e4a,
                0 0 30px #182e4a,
                0 0 30px #182e4a
              `,
              background:
                "linear-gradient(90deg, #fff 35%, rgba(3, 163, 196, 1) 49%, #fff 62%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textAlign: "center",
            }}
          >
            EXPLORE OUR EXPERT TECH TRAINING SOLUTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Section */}
          <div className="lg:col-span-8">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="border-b-2 border-gray-300/50 pb-8 mb-8 last:border-b-0"
              >
                {/* Branch Name - Enhanced for dark backgrounds */}
                <h5 className="text-xl md:text-2xl font-bold uppercase mb-6 text-center lg:text-left text-white drop-shadow-lg">
                  {branch.name}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Phone Section */}
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[240px] flex flex-col items-center justify-center group">
                    <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaPhone
                        size={32}
                        className="text-blue-600 transform rotate-90"
                      />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                      Phone
                    </h6>
                    <div className="flex flex-col items-center gap-3">
                      {branch.phone.map((num, i) => (
                        <a
                          href={`tel:${num.replace(/\s/g, "")}`}
                          key={i}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-center hover:underline"
                        >
                          {num}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Section */}
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[240px] flex flex-col items-center justify-center group">
                    <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaWhatsapp size={32} className="text-green-600" />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                      WhatsApp
                    </h6>
                    <div className="flex flex-col items-center">
                      <a
                        href={branch.whatsapp}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Chat Now
                      </a>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[240px] flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1 group">
                    <div className="bg-orange-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaMapMarkerAlt size={32} className="text-orange-600" />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                      Address
                    </h6>
                    <div className="flex flex-col items-center text-center">
                      <a
                        href={branch.address}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm leading-relaxed hover:underline"
                      >
                        {branch.addresstext}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow-xl w-full sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Contact Form
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="w-full">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={localFormData.name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Fixed phone input with proper flex layout */}
                <div className="flex gap-2 w-full">
                  <select
                    name="countryCode"
                    value={localFormData.countryCode || "+91"}
                    onChange={handleChange}
                    className="flex-shrink-0 px-2 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[80px]"
                  >
                    {countryCodes.map(({ code, country }) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Phone number"
                    value={localFormData.contact || ""}
                    onChange={handleChange}
                    maxLength={getSelectedCountryMaxLength()}
                    className="flex-1 min-w-0 px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="w-full">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={localFormData.email || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="relative w-full">
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={handleLocationChange}
                    onFocus={() => {
                      if (filteredSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className={`w-full px-4 py-3 border ${!isLocationSelected && location
                      ? "border-red-500"
                      : "border-gray-300"
                      } bg-white text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  />
                  {!isLocationSelected && location && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a location from suggestions
                    </p>
                  )}

                  {/* DROPDOWN */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-50 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {filteredSuggestions.slice(0, 10).map((item, index) => (
                        <div
                          key={index}
                          onMouseDown={(e) => {
                            e.preventDefault(); // prevents input blur
                            handleSuggestionClick(item);
                          }}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${index === activeSuggestion ? "bg-blue-100" : ""
                            }`}
                        >
                          📍 {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <div className="relative w-full">
                    {/* Input Box */}
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg cursor-pointer flex justify-between items-center"
                    >
                      <span className={localFormData.course ? "text-gray-900" : "text-gray-500"}>
                        {localFormData.course || "Select Course"}
                      </span>
                      <span>▼</span>
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">

                        {/* Categories */}
                        {Object.entries(courseCategories).map(([category, courses]) => (
                          <div key={category}>

                            {/* Category Header */}
                            <div
                              onClick={() =>
                                setActiveCategory(activeCategory === category ? null : category)
                              }
                              className="px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 cursor-pointer"
                            >
                              {category}
                            </div>

                            {/* Courses */}
                            {activeCategory === category && (
                              <div className="pl-4">
                                {courses.map((course, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      setLocalFormData((prev) => ({
                                        ...prev,
                                        course: course,
                                      }));
                                      setIsDropdownOpen(false);
                                      setActiveCategory(null);
                                    }}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                  >
                                    {course}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 mt-3 disabled:from-red-400 disabled:to-red-500 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>

                {submissionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                    {submissionError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Component */}
      <div className="mt-16">
        <Branches />
      </div>
    </div>
  );
};

export default ContactUsClientContent;
