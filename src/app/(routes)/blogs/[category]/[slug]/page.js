'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Tag, Share2, Hash, List, Eye, X, Mail, Phone, MapPin, CheckCircle, BookOpen, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function BlogPost({ params }) {
  const { slug } = React.use(params);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [showToc, setShowToc] = useState(false);
  const [isComponentActive, setIsComponentActive] = useState(true);
  
  const contentRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    countryCode: "+91",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [locationSuggestions, setLocationSuggestions] = useState([
    'Mumbai, Maharashtra', 'Delhi', 'Bangalore, Karnataka', 
    'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal',
    'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 
    'Remote', 'Work from Home'
  ]);
  
  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Function to scroll to a heading when TOC item is clicked
  const scrollToHeading = (id) => {
    if (!id) return;
    
    const element = document.getElementById(id);
    if (element) {
      // Close the mobile TOC if open
      setShowToc(false);
      
      // Scroll to the element with some offset for the header
      const yOffset = -80; // Adjust this value based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Update the active ID after a small delay to ensure smooth scrolling
      setTimeout(() => {
        setActiveId(id);
      }, 300);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const tocRef = useRef(null);
  const bannerRef = useRef(null);
  const footerSentinelRef = useRef(null);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

  // Helper function to build TOC tree
  // Helper function to build TOC tree with proper h1 > h2 > h3 hierarchy
// Helper function to build TOC tree - UPDATED to handle H2-only content
const buildTocTree = (headings) => {
  if (!headings || headings.length === 0) return [];
  
  const tree = [];
  const stack = [];
  
  headings.forEach((heading) => {
    const node = { ...heading, children: [] };
    
    // Pop stack items that are same or higher level
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // Root level item
      tree.push(node);
    } else {
      // Add as child to parent
      stack[stack.length - 1].children.push(node);
    }
    
    stack.push(node);
  });
  
  return tree;
};

// Recursive render TOC items - UPDATED with better visual hierarchy
const renderTocItems = (items, parentIndex = '', depth = 0) => {
  if (!items || items.length === 0) return null;
  
  return (
    <ul className={`space-y-1 lg:space-y-0.5 xl:space-y-1 2xl:space-y-1.5 pr-1 ${
      depth > 0 
        ? 'ml-4 lg:ml-3 xl:ml-4 mt-1.5 border-l-2 border-blue-400/30 pl-3 lg:pl-2 xl:pl-3' 
        : ''
    }`}>
      {items.map((item, index) => {
        const itemIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
        const hasChildren = item.children && item.children.length > 0;
        
        return (
          <li key={item.id} className="relative">
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left flex items-start gap-1.5 lg:gap-1 xl:gap-1.5 p-2 lg:p-1.5 xl:p-2 2xl:p-2.5 text-xs lg:text-xs xl:text-sm leading-snug cursor-pointer transition-all duration-200 rounded-md ${
                activeId === item.id
                  ? 'bg-blue-700/60 text-white font-medium shadow-md border border-blue-500/30'
                  : 'bg-slate-800/40 text-blue-100 hover:bg-blue-600/20 hover:text-white border border-blue-400/10 hover:border-blue-400/30'
              } ${hasChildren && depth === 0 ? 'font-semibold' : ''} ${depth === 0 ? 'text-blue-100' : depth === 1 ? 'text-blue-200/90' : 'text-blue-200/80'}`}
            >
              <span className={`flex-shrink-0 font-bold text-xs ${
                activeId === item.id 
                  ? 'text-white' 
                  : depth === 0 
                    ? 'text-blue-300' 
                    : depth === 1 
                      ? 'text-blue-400/80' 
                      : 'text-blue-400/60'
              }`}>
                {itemIndex}.
              </span>
              <span className={`flex-1 line-clamp-2 text-left ${depth > 0 ? 'text-xs lg:text-xs xl:text-xs' : ''}`}>
                {item.text}
              </span>
            </button>
            {hasChildren && (
              <div className="mt-1">
                {renderTocItems(item.children, itemIndex, depth + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};


  // Content processing function to split content at 2nd H2
  const processContentWithCourses = (content) => {
    if (!content || !blog?.courses || blog.courses.length === 0) {
      return { beforeCourses: content, afterCourses: '' };
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find all H2 elements
    const h2Elements = tempDiv.querySelectorAll('h2');
    
    // If there are less than 2 H2 elements, don't split
    if (h2Elements.length < 2) {
      return { beforeCourses: content, afterCourses: '' };
    }
    
    // Get the second H2 element
    const secondH2 = h2Elements[1];
    
    // Create two containers for the split content
    const beforeDiv = document.createElement('div');
    const afterDiv = document.createElement('div');
    
    // Move all elements before the second H2 to beforeDiv
    let currentElement = tempDiv.firstChild;
    while (currentElement && currentElement !== secondH2) {
      const nextElement = currentElement.nextSibling;
      beforeDiv.appendChild(currentElement);
      currentElement = nextElement;
    }
    
    // Move the second H2 and all subsequent elements to afterDiv
    while (currentElement) {
      const nextElement = currentElement.nextSibling;
      afterDiv.appendChild(currentElement);
      currentElement = nextElement;
    }
    
    return {
      beforeCourses: beforeDiv.innerHTML,
      afterCourses: afterDiv.innerHTML
    };
  };

  // CoursesSection component with Swiper carousel
  const CoursesSection = ({ courses }) => {
    if (!courses || courses.length === 0) {
      return null;
    }

    // Swiper breakpoints configuration
    const breakpoints = {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    };

    return (
      <motion.div 
        className="courses-section my-8 md:my-12 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              Explore Our Other <span className='text-blue-600 text-xl md:text-3xl'>Demanding </span>Courses
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
              Continue your learning journey with our handpicked selection of courses
            </p>
          </div>
        </div>

        <div className="relative px-2 sm:px-4 lg:px-8">
          {/* Navigation Buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800/80 hover:bg-blue-600/80 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 -ml-2 md:-ml-4">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800/80 hover:bg-blue-600/80 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 -mr-2 md:-mr-4">
            <ChevronRight className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={breakpoints}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              renderBullet: (index, className) => {
                return `<span class="${className} bg-blue-400 opacity-50 hover:opacity-100 transition-opacity"></span>`;
              }
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            loop={courses.length > 3}
            className="py-2 px-4"
          >
            {courses.map((course, index) => (
              <SwiperSlide key={`${course.courseUrl}-${index}`} className="h-auto pb-10">
                <motion.div 
                  className="bg-gray-800/50 rounded-xl p-3 md:p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 group cursor-pointer h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => window.open(course.courseUrl, '_blank')}
                >
                  <div className="bg-blue-500/10 h-32 md:h-40 rounded-lg mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
                    {course.courseImage ? (
                      <Image
                        src={course.courseImage}
                        alt={course.name}
                        width={300}
                        height={190}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${course.courseImage ? 'hidden' : 'flex'}`}>
                      <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-base md:text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors mb-2">
                      {course.name}
                    </h4>
                    
                    <p className="text-gray-300 text-xs md:text-sm line-clamp-3 leading-relaxed flex-grow">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 md:pt-4 mt-auto">
                      <span className="text-xs text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                        View Course
                      </span>
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <div className="swiper-pagination mt-6 relative flex justify-center items-center gap-2"></div>
        </div>
        
        {courses.length >= 6 && (
          <div className="text-center mt-8 md:mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20 text-sm md:text-base"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              View All Courses
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        )}
      </motion.div>
    );
  };

  // Handle scroll effect for TOC
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'contact' ? value.replace(/\D/g, '') : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (name === 'location' && value.length > 0) {
      const filtered = locationSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestion(-1);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion
    }));
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target) &&
          (!suggestionsRef.current || !suggestionsRef.current.contains(event.target))) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.contact) {
      newErrors.contact = 'Phone number is required';
    } else if (!phoneRegex.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 100) {
      newErrors.location = 'Location seems too long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);

    const payload = {
      ...formData,
      contact: formData.countryCode + formData.contact,
      coursename: blog?.title || 'Blog Contact Form',
      source: 'Blog Post',
      pageUrl: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
      if (!apiUrl) {
        console.error("API URL environment variable is not set.");
        alert("Configuration error. Cannot submit form.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(`${apiUrl}/api/submit`, payload);
      console.log("Form submitted successfully:", response.data);
      
      setShowThankYou(true);
      setFormData({
        name: "",
        email: "",
        contact: "",
        location: "",
        countryCode: "+91",
      });
      setErrors({});

      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      
      let errorMessage = "An error occurred while submitting. Please try again.";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = error.response?.data?.message || "Submission failed. Please check your input values.";
        } else if (error.request) {
          errorMessage = "Cannot reach the server. Please check your internet connection.";
        }
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component lifecycle management
  useEffect(() => {
    setIsComponentActive(true);
    return () => {
      setIsComponentActive(false);
    };
  }, []);

  // Blog content processing with headings h2-h5
  useEffect(() => {
    if (blog?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      
      // Extract h2 to h5
      const headingElements = tempDiv.querySelectorAll('h2, h3, h4, h5');
      const headingsList = Array.from(headingElements).map((heading, index) => {
        const text = heading.textContent || heading.innerText || '';
        const id = `heading-${index}`;
        const level = parseInt(heading.tagName.charAt(1), 10);
        heading.id = id;
        return {
          id,
          text: text.trim(),
          level
        };
      });
      
      setBlog(prev => prev ? { ...prev, content: tempDiv.innerHTML } : null);
      setHeadings(headingsList);
    }
  }, [blog?.content]);

  // Scroll spy effect
  useEffect(() => {
    if (!isComponentActive) return;

    const observerOptions = {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings, isComponentActive]);

  // Footer intersection observer
  useEffect(() => {
    const toc = tocRef.current;
    const banner = bannerRef.current;
    const footerSentinel = footerSentinelRef.current;

    if (!footerSentinel || (!toc && !banner)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isFooterVisible = entry.isIntersecting;
          
          if (isFooterVisible) {
            if (toc) {
              toc.style.position = 'absolute';
              toc.style.bottom = '100px';
              toc.style.top = 'auto';
            }
            if (banner) {
              banner.style.position = 'absolute';
              banner.style.bottom = '100px';
              banner.style.top = 'auto';
            }
          } else {
            if (toc) {
              toc.style.position = 'sticky';
              toc.style.bottom = 'auto';
              toc.style.top = 'calc(100vh * 0.5)';
            }
            if (banner) {
              banner.style.position = 'sticky';
              banner.style.bottom = 'auto';
              banner.style.top = '80px';
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px 200px 0px'
      }
    );

    observer.observe(footerSentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch blog post
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching blog post with slug:', slug);
        
        const response = await fetch(`${API_BASE_URL}/api/blogs/slug/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch blog post: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Blog data received:', data);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug, API_BASE_URL]);

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-[1800px] mx-auto flex items-center justify-center bg-[#072E4F]">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-100 text-sm md:text-base">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="relative w-full max-w-[1800px] mx-auto overflow-hidden flex items-center justify-center bg-[#072E4F] px-4">
        <div className="text-center p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Blog Post Not Found</h2>
          <p className="text-blue-100 mb-6 text-sm md:text-base">
            {error || "The blog post you're looking for doesn't exist or may have been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Go Back
            </button>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-sm md:text-base"
            >
              Browse All Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#072E4F] text-white w-full max-w-[1800px] mx-auto ">
      {/* Back Buttons - Responsive */}
      <div className="relative z-[5]">
        <div className="hidden md:block absolute top-6 left-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white cursor-pointer text-base font-medium bg-blue-900/40 px-3 py-2 rounded-full shadow transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="md:hidden absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white cursor-pointer text-sm font-medium bg-blue-900/40 px-2 py-1.5 rounded-full shadow transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Mobile TOC Toggle - Hide from lg (1024px) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-10">
        <button
          onClick={() => setShowToc(!showToc)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile TOC Overlay - Hide from lg (1024px) */}
      {showToc && (
        <div className="lg:hidden fixed inset-0 z-15">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowToc(false)}
          >
            <div 
              className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-[#072E4F] border-l border-blue-400/30 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Table of Contents
                </h3>
                <button
                  onClick={() => setShowToc(false)}
                  className="text-blue-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {headings.length > 0 ? (
                <nav>
                  {renderTocItems(buildTocTree(headings))}
                </nav>
              ) : (
                <p className="text-blue-300 text-sm">No headings found in this article.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pt-16 md:pt-20 min-h-screen">
        
        {/* Three Column Layout - Responsive with both TOC and Banner from lg (1024px) */}
        <div className="flex">
          
          {/* LEFT: TOC Sidebar - Visible from lg (1024px) with responsive sizing */}
{headings.length > 0 && isComponentActive && (
  <div 
    ref={tocRef}
    className="hidden lg:block w-[220px] lg:w-[180px] xl:w-[220px] 2xl:w-[260px] flex-shrink-0 ml-5 lg:ml-2 xl:ml-4 2xl:ml-5 pt-20 transition-all duration-300 ease-out"
    style={{
      position: 'sticky',
      top: '80px',
      height: 'fit-content',
      maxHeight: 'calc(100vh - 100px)',
      zIndex: 10,
      transition: 'all 300ms ease-out'
    }}
  >
    <div className="w-full bg-[#072E4F]/95 backdrop-blur-3xl backdrop-saturate-[180%] border-2 border-blue-400/40 rounded-xl shadow-[4px_0_20px_rgba(0,0,0,0.3)] p-3 lg:p-2 xl:p-3 2xl:p-4 text-slate-200 flex flex-col h-[60vh] max-h-[500px]">
      <div className="flex-shrink-0 mb-2 lg:mb-1 xl:mb-2 2xl:mb-3">
        <h3 className="text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-white mb-2 lg:mb-1 xl:mb-2 2xl:mb-3 flex items-center justify-center gap-1 lg:gap-1 xl:gap-2 border-b border-blue-400/30 pb-2 lg:pb-1 xl:pb-2 2xl:pb-3">
          <List className="w-3 h-3 lg:w-3 lg:h-3 xl:w-4 xl:h-4 text-blue-300" />
          <span className="hidden xl:inline">Table of Contents</span>
          <span className="xl:hidden">Contents</span>
        </h3>
      </div>
      
      <nav className="flex-grow overflow-y-auto pr-1 -mr-1">
        {renderTocItems(buildTocTree(headings))}
      </nav>
      
      <div className="flex-shrink-0 mt-1 lg:mt-0.5 xl:mt-1 2xl:mt-2 pt-1 lg:pt-0.5 xl:pt-1 2xl:pt-2 border-t border-blue-400/20">
        <div className="text-xs lg:text-xs xl:text-xs 2xl:text-xs text-blue-300/80 flex items-center justify-center gap-1">
          <Eye className="w-2 h-2 lg:w-2 lg:h-2 xl:w-3 xl:h-3" />
          <span className="hidden xl:inline">{headings.length} sections</span>
          <span className="xl:hidden">{headings.length}</span>
        </div>
      </div>
    </div>
  </div>
)}

          {/* CENTER: Main Content Area - Responsive with adjusted spacing for three columns at 1024px */}
          <div className="flex-1 bg-[#072E4F] lg:px-0 px-4 relative overflow-x-hidden">
  
            {/* Floating geometric elements - Responsive */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 left-4 md:left-20 w-16 h-20 md:w-24 md:h-32 bg-blue-600/20 rounded-lg transform rotate-12 animate-[float_8s_ease-in-out_infinite]"></div>
              <div className="absolute top-32 right-4 md:right-32 w-12 h-12 md:w-20 md:h-16 bg-blue-500/15 rounded-lg transform -rotate-6 animate-[float_10s_ease-in-out_infinite_1s]"></div>
              <div className="absolute top-16 left-1/2 w-2 h-2 md:w-3 md:h-3 bg-white/40 rounded-full animate-[float_12s_ease-in-out_infinite_2s]"></div>
              <div className="absolute top-1/3 right-4 md:right-20 w-4 h-4 md:w-6 md:h-6 bg-blue-400/30 rounded-full animate-[float_9s_ease-in-out_infinite_1.5s]"></div>
              <div className="absolute bottom-32 left-4 md:left-16 w-12 h-16 md:w-16 md:h-20 bg-blue-600/15 rounded-lg transform rotate-45 animate-[float_11s_ease-in-out_infinite_2.5s]"></div>
              <div className="absolute bottom-40 right-6 md:right-24 w-20 h-14 md:w-28 md:h-20 bg-blue-500/20 rounded-lg transform -rotate-12 animate-[float_9.5s_ease-in-out_infinite_1.2s]"></div>
              <div className="absolute top-2/3 left-1/4 w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full animate-[float_10.5s_ease-in-out_infinite_3s]"></div>
              <div className="absolute bottom-1/4 right-1/3 w-14 h-18 md:w-18 md:h-24 bg-blue-600/10 rounded-lg transform rotate-[30deg] animate-[float_12.5s_ease-in-out_infinite_0.5s]"></div>
            </div>
           
            {/* Background Elements - Responsive */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-20 left-4 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute top-40 right-4 md:right-20 w-40 md:w-80 h-40 md:h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute bottom-20 left-8 md:left-40 w-36 md:w-72 h-36 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
              </div>
            </div>

            <div className="px-3 md:px-6 lg:px-2 xl:px-4 2xl:px-6 relative z-[2]">
              {/* Article Header - Responsive */}
              <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm shadow-lg border border-blue-400/30 rounded-full px-3 py-2 md:px-6 md:py-3 mb-6 md:mb-8">
                  <Tag className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
                  <span className="text-blue-100 font-semibold text-sm md:text-base">{blog.category || 'Blog Post'}</span>
                </div>
               
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight max-w-4xl mx-auto px-2">
                  {blog.title}
                  {blog.subtitle && (
                    <>
                      <br />
                      <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                        {blog.subtitle}
                      </span>
                    </>
                  )}
                </h1>

                {/* Meta Information - Responsive */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-blue-100 mb-6 md:mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">By {blog.author || 'Admin'}</span>
                  </div>
                </div>
                 
                {/* Featured Image - Responsive */}
                {(blog.image || blog.featuredImage) && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-4xl mx-auto mb-0"
                  >
                    <div className="relative rounded-xl shadow-xl border border-blue-400/20 bg-gray-900/20 flex items-center justify-center">
                      <Image
                        src={blog.image || blog.featuredImage}
                        alt={blog.title}
                        width={800}
                        height={400}
                        className="w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[350px] xl:max-h-[500px] 2xl:max-h-[600px] object-contain"
                        priority
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 800px"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.header>
       
              {/* Article Content with Split Rendering - Responsive */}
              <motion.article
                ref={contentRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-invert prose-sm md:prose-base lg:prose-sm xl:prose-base 2xl:prose-lg max-w-4xl mx-auto px-2 md:px-5 lg:px-1 xl:px-3 2xl:px-5 blog-content-styles text-white"
              >
                {(() => {
                  const { beforeCourses, afterCourses } = processContentWithCourses(blog.content);
                  
                  return (
                    <div className="ql-editor">
                      {/* Content before 2nd H2 */}
                      {beforeCourses && (
                        <div
                          className="leading-relaxed blog-content text-white"
                          dangerouslySetInnerHTML={{ 
                            __html: beforeCourses 
                          }}
                        />
                      )}
                      
                      {/* Courses Section - inserted before 2nd H2 with responsive styling */}
                      {blog.courses && blog.courses.length > 0 && (
                        <CoursesSection courses={blog.courses} />
                      )}
                      
                      {/* Content from 2nd H2 onwards */}
                      {afterCourses && (
                        <div
                          className="leading-relaxed blog-content text-white"
                          dangerouslySetInnerHTML={{ 
                            __html: afterCourses 
                          }}
                        />
                      )}
                      
                      {/* Fallback removed - beforeCourses already contains full content when no split occurs */}
                    </div>
                  );
                })()}
              </motion.article>

                            {/* Tags Section - Responsive */}
              {blog.tags && blog.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="max-w-4xl mx-auto mt-6 md:mt-8 pt-6 md:pt-8 border-t border-blue-400/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 flex-shrink-0">
                      <Hash className="w-4 h-4 md:w-5 md:h-5" />
                      Tags:
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {blog.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          className="inline-flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-sm border border-blue-400/30 text-blue-200 hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-default shadow-sm hover:shadow-md"
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
       
              {/* Share Buttons - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-4xl mx-auto mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-400/20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    Share this article
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <span className="hidden sm:inline">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="hidden sm:inline">Facebook</span>
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="hidden sm:inline">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => shareOnSocial('copy')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">Copy Link</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="max-w-4xl mx-auto mt-8 md:mt-12 pt-6 md:pt-7 border-t border-blue-400/20"
              >
                <div className="flex justify-center">
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    Back to All Blogs
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Footer Sentinel */}
            <div 
              ref={footerSentinelRef} 
              className="h-16 md:h-20 w-full"
            ></div>
          </div>

          {/* RIGHT: Banner and Form Sidebar - Now visible from lg (1024px) with responsive sizing */}
          {(blog.bannerImage || blog.banner) && isComponentActive && (
            <div className="hidden lg:flex flex-col w-72 lg:w-68 xl:w-72 2xl:w-80 flex-shrink-0 ml-3 lg:ml-2 xl:ml-3 2xl:ml-4 relative h-auto">
              {/* Banner Image with responsive sizing */}
              <div ref={bannerRef} className="relative w-full h-auto flex-shrink-0 mb-1" style={{ width: '100%', height: '550px', maxHeight: '650px', objectFit: 'cover', marginTop: '6rem' }}>
                <div className="w-full h-full bg-[#072E4F]/95 backdrop-blur-3xl backdrop-saturate-[180%] rounded-xl shadow-[-4px_0_20px_rgba(0,0,0,0.3)] p-2 lg:p-1.5 xl:p-2 2xl:p-3 flex items-center justify-center overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg relative group cursor-pointer"
                    onClick={() => {
                      const formElement = document.getElementById('contact-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>
                    <Image
                      src={blog.bannerImage || blog.banner}
                      alt="Banner Image - Click to contact us"
                      width={400}
                      height={700}
                      className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-300 ease-in-out transform group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 300px, (max-width: 1280px) 350px, 400px"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        maxHeight: '100%',
                        objectPosition: 'center',
                        margin: '0 auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* Sticky Contact Form with responsive sizing */}
              <div 
                id="contact-form"
                className="w-full bg-[#072E4F]/95 backdrop-blur-3xl backdrop-saturate-[180%] rounded-xl shadow-[-4px_0_20px_rgba(0,0,0,0.3)] p-3 lg:p-2 xl:p-3 2xl:p-4 border-2 border-blue-400/40 flex-shrink-0" 
                style={{
                  position: 'sticky',
                  top: '100px',
                  zIndex: 10,
                  marginTop: '20px',
                  scrollMarginTop: '100px',
                  maxHeight: 'calc(100vh - 120px)',
                  overflowY: 'auto'
                }}
              >
                <h3 className="text-white text-base lg:text-sm xl:text-base 2xl:text-lg font-semibold mb-2 lg:mb-1.5 xl:mb-2 2xl:mb-3 text-center">Contact Us</h3>
                {showThankYou ? (
                  <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 lg:p-2 xl:p-3 2xl:p-4 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
                    <p className="text-xs lg:text-xs xl:text-sm 2xl:text-base">Thank you! We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-1.5 xl:space-y-2 2xl:space-y-3">
                    {/* Name Field */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <User className="h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className={`w-full pl-6 lg:pl-5 xl:pl-6 2xl:pl-8 pr-2 py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 text-xs lg:text-xs xl:text-sm rounded-lg bg-white/10 border ${
                            errors.name ? 'border-red-500' : 'border-gray-600'
                          } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                      </div>
                      {errors.name && (
                        <p id="name-error" className="text-red-400 text-xs lg:text-xs xl:text-xs mt-0.5 lg:mt-0 xl:mt-0.5 pl-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <Mail className="h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          className={`w-full pl-6 lg:pl-5 xl:pl-6 2xl:pl-8 pr-2 py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 text-xs lg:text-xs xl:text-sm rounded-lg bg-white/10 border ${
                            errors.email ? 'border-red-500' : 'border-gray-600'
                          } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="text-red-400 text-xs lg:text-xs xl:text-xs mt-0.5 lg:mt-0 xl:mt-0.5 pl-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number with Country Code */}
                    <div>
                      <div className="flex gap-1 lg:gap-0.5 xl:gap-1 2xl:gap-2">
                        <div className="w-1/3">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-full py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 px-1.5 lg:px-1 xl:px-1.5 2xl:px-2 text-xs lg:text-xs xl:text-sm rounded-lg bg-white/10 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+86">🇨🇳 +86</option>
                            <option value="+971">🇦🇪 +971</option>
                          </select>
                        </div>
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <Phone className="h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className={`w-full pl-6 lg:pl-5 xl:pl-6 2xl:pl-8 pr-2 py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 text-xs lg:text-xs xl:text-sm rounded-lg bg-white/10 border ${
                              errors.contact ? 'border-red-500' : 'border-gray-600'
                            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            aria-invalid={!!errors.contact}
                            aria-describedby={errors.contact ? 'contact-error' : undefined}
                          />
                        </div>
                      </div>
                      {errors.contact && (
                        <p id="contact-error" className="text-red-400 text-xs lg:text-xs xl:text-xs mt-0.5 lg:mt-0 xl:mt-0.5 pl-1">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    {/* Location with Suggestions */}
                    <div>
                      <div className="relative" ref={locationInputRef}>
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <MapPin className="h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          onFocus={() => {
                            if (formData.location) {
                              const filtered = locationSuggestions.filter(suggestion =>
                                suggestion.toLowerCase().includes(formData.location.toLowerCase())
                              );
                              setFilteredSuggestions(filtered);
                              setShowSuggestions(filtered.length > 0);
                            } else {
                              setFilteredSuggestions(locationSuggestions);
                              setShowSuggestions(true);
                            }
                          }}
                          placeholder="Your Location"
                          className={`w-full pl-6 lg:pl-5 xl:pl-6 2xl:pl-8 pr-2 py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 text-xs lg:text-xs xl:text-sm rounded-lg bg-white/10 border ${
                            errors.location ? 'border-red-500' : 'border-gray-600'
                          } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          aria-invalid={!!errors.location}
                          aria-describedby={errors.location ? 'location-error' : undefined}
                          autoComplete="off"
                        />
                        
                        {/* Location Suggestions */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div 
                            ref={suggestionsRef}
                            className="absolute z-10 mt-1 w-full bg-[#0a3558] border border-blue-400/30 rounded-lg shadow-lg overflow-hidden"
                          >
                            <ul className="py-1 max-h-48 lg:max-h-36 xl:max-h-48 2xl:max-h-60 overflow-auto">
                              {filteredSuggestions.map((suggestion, index) => (
                                <li
                                  key={suggestion}
                                  className={`px-3 lg:px-2 xl:px-3 2xl:px-4 py-1.5 lg:py-1 xl:py-1.5 2xl:py-2 text-xs lg:text-xs xl:text-sm text-white hover:bg-blue-700/50 cursor-pointer ${
                                    index === activeSuggestion ? 'bg-blue-700/70' : ''
                                  }`}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  onMouseEnter={() => setActiveSuggestion(index)}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {errors.location && (
                        <p id="location-error" className="text-red-400 text-xs lg:text-xs xl:text-xs mt-0.5 lg:mt-0 xl:mt-0.5 pl-1">
                          {errors.location}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 lg:py-1.5 xl:py-2 2xl:py-2.5 px-3 lg:px-2 xl:px-3 2xl:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 shadow-lg hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-xs lg:text-xs xl:text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="lg:text-xs xl:text-sm">Get Free Consultation</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS - Enhanced with responsive improvements */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-track-transparent {
          scrollbar-color: rgba(59, 130, 246, 0.4) transparent;
        }

        .scrollbar-thumb-blue-400\\/40::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-blue-400\\/40::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-blue-400\\/40::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }

        .scrollbar-thumb-blue-400\\/40::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }

        /* Responsive blog content styles */
        .blog-content-styles img,
        .blog-content-styles .ql-editor img {
          max-width: 100% !important;
          max-height: 600px !important;
          width: auto !important;
          height: auto !important;
          margin: 20px 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          cursor: pointer !important;
          transition: transform 0.3s ease !important;
          display: inline-block !important;
        }

        @media (min-width: 768px) {
          .blog-content-styles img,
          .blog-content-styles .ql-editor img {
            max-width: 90% !important;
            max-height: 700px !important;
          }
        }

        @media (min-width: 1024px) {
          .blog-content-styles img,
          .blog-content-styles .ql-editor img {
            max-width: 85% !important;
            max-height: 800px !important;
          }
        }

        @media (min-width: 1280px) {
          .blog-content-styles img,
          .blog-content-styles .ql-editor img {
            max-width: 80% !important;
            max-height: 900px !important;
          }
        }

        .blog-content-styles img:hover,
        .blog-content-styles .ql-editor img:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
        }

        .blog-content-styles .ql-align-left { text-align: left !important; }
        .blog-content-styles .ql-align-center { text-align: center !important; }
        .blog-content-styles .ql-align-right { text-align: right !important; }
        .blog-content-styles .ql-align-justify { text-align: justify !important; }

        .blog-content-styles .ql-align-center img,
        .blog-content-styles .ql-align-right img,
        .blog-content-styles .ql-align-left img {
          display: block;
        }
        
        .blog-content-styles .ql-align-center img {
          margin: 15px auto !important;
        }
        
        .blog-content-styles .ql-align-right img {
          margin: 15px 0 15px auto !important;
        }
        
        .blog-content-styles .ql-align-left img {
          margin: 15px auto 15px 0 !important;
        }

        .blog-content-styles .prose-invert,
        .blog-content-styles .prose-invert p,
        .blog-content-styles .prose-invert li,
        .blog-content-styles .prose-invert h1,
        .blog-content-styles .prose-invert h2,
        .blog-content-styles .prose-invert h3,
        .blog-content-styles .prose-invert h4,
        .blog-content-styles .prose-invert h5,
        .blog-content-styles .prose-invert h6 {
          --tw-prose-body: #ffffff;
          --tw-prose-headings: #ffffff;
          --tw-prose-links: #60a5fa;
          --tw-prose-links-hover: #3b82f6;
          --tw-prose-bold: #ffffff;
          color: #ffffff !important;
        }

        .blog-content-styles .prose-invert a {
          text-decoration: none;
          font-weight: 500;
          border-bottom: 2px solid rgba(56, 182, 255, 0.2);
          transition: all 0.2s ease;
        }

        .blog-content-styles .prose-invert a:hover {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .blog-content-styles .prose-invert h1,
        .blog-content-styles .prose-invert h2,
        .blog-content-styles .prose-invert h3,
        .blog-content-styles .prose-invert h4 {
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 600;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .blog-content-styles .prose-invert h1,
          .blog-content-styles .prose-invert h2,
          .blog-content-styles .prose-invert h3,
          .blog-content-styles .prose-invert h4 {
            margin-top: 2em;
          }
        }

        @media (min-width: 1024px) {
          .blog-content-styles .prose-invert h1,
          .blog-content-styles .prose-invert h2,
          .blog-content-styles .prose-invert h3,
          .blog-content-styles .prose-invert h4 {
            margin-top: 1.5em;
          }
        }

        .blog-content-styles .prose-invert h1 { font-size: 1.75em; }
        .blog-content-styles .prose-invert h2 { font-size: 1.5em; }
        .blog-content-styles .prose-invert h3 { font-size: 1.25em; }
        .blog-content-styles .prose-invert h4 { font-size: 1.125em; }

        @media (min-width: 768px) {
          .blog-content-styles .prose-invert h1 { font-size: 2.25em; }
          .blog-content-styles .prose-invert h2 { font-size: 1.75em; }
          .blog-content-styles .prose-invert h3 { font-size: 1.5em; }
          .blog-content-styles .prose-invert h4 { font-size: 1.25em; }
        }

        @media (min-width: 1024px) {
          .blog-content-styles .prose-invert h1 { font-size: 1.875em; }
          .blog-content-styles .prose-invert h2 { font-size: 1.5em; }
          .blog-content-styles .prose-invert h3 { font-size: 1.25em; }
          .blog-content-styles .prose-invert h4 { font-size: 1.125em; }
        }

        @media (min-width: 1536px) {
          .blog-content-styles .prose-invert h1 { font-size: 2.25em; }
          .blog-content-styles .prose-invert h2 { font-size: 1.75em; }
          .blog-content-styles .prose-invert h3 { font-size: 1.5em; }
          .blog-content-styles .prose-invert h4 { font-size: 1.25em; }
        }

        .blog-content-styles .prose-invert p {
          margin-top: 1em;
          margin-bottom: 1em;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .blog-content-styles .prose-invert p {
            margin-top: 1.25em;
            margin-bottom: 1.25em;
            line-height: 1.7;
          }
        }

        @media (min-width: 1024px) {
          .blog-content-styles .prose-invert p {
            margin-top: 1em;
            margin-bottom: 1em;
            line-height: 1.6;
          }
        }

        .blog-content-styles .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
        }

        @media (min-width: 768px) {
          .blog-content-styles .blog-content blockquote {
            margin: 2rem 0;
          }
        }

        @media (min-width: 1024px) {
          .blog-content-styles .blog-content blockquote {
            margin: 1.5rem 0;
            padding: 0.875rem 1.25rem;
          }
        }
        
        .blog-content-styles .blog-content code {
          background: rgba(59, 130, 246, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        .blog-content-styles .blog-content pre {
          background: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #374151;
        }
      `}</style>
    </div>
  );
}
