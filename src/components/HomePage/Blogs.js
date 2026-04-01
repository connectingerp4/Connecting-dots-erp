"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from "@/styles/HomePage/Placement.module.css";

const LatestBlogs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3); // Default desktop view

  // Backend URL - update this to match your backend deployment
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

  // Responsive breakpoint handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // Mobile: 1 slide
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 slides
      } else {
        setSlidesToShow(3); // Desktop: 3 slides
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        console.log('Fetching blogs from:', `${BACKEND_URL}/api/blogs?limit=6`);
        
        // Wake up the server first
        try {
          await fetch(`${BACKEND_URL}/api/blogs/ping`);
        } catch (pingError) {
          console.warn('Server ping failed:', pingError);
        }

        const response = await fetch(`${BACKEND_URL}/api/blogs?limit=6`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));
        
        const blogsData = result.blogs || [];
        console.log('Blogs data:', blogsData);
        
        if (blogsData.length > 0) {
          console.log('First blog:', blogsData[0]);
        } else {
          console.log('No blogs found in the response');
        }
        
        // Map the blog data to match the expected format
        const formattedBlogs = blogsData.map(blog => ({
          ...blog,
          _id: blog._id,
          title: blog.title || 'Untitled Blog',
          excerpt: blog.content ? 
            blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 
            'No excerpt available',
          featuredImage: blog.image || 'https://res.cloudinary.com/decptkmx7/image/upload/v1751974369/trending_pg_img_nmsinr.jpg',
          slug: blog.slug || 'no-slug',
          category: blog.category || 'Uncategorized',
          author: blog.author || 'Admin',
          createdAt: blog.createdAt || new Date().toISOString(),
          content: blog.content || ''
        }));
        
        setBlogs(formattedBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, [BACKEND_URL]);

  // Infinite loop navigation functions with smooth animation
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  // Handle infinite loop reset after transition
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      
      // Reset to actual position for infinite loop
      if (currentSlide >= blogs.length) {
        setCurrentSlide(0);
      } else if (currentSlide < 0) {
        setCurrentSlide(blogs.length - 1);
      }
    }, 500); // Match this with CSS transition duration

    return () => clearTimeout(timer);
  }, [currentSlide, isTransitioning, blogs.length]);

  if (loading) {
    return (
      <div className="text-center py-20 bg-black">
        <div className="text-white text-lg">Loading latest blogs...</div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20 bg-black">
        <div className="text-red-400 text-lg mb-4">Error loading blogs</div>
        <div className="text-gray-300 text-sm">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-20 bg-black">
        <div className="text-gray-300 text-lg">No blogs found</div>
      </div>
    );
  }

  // Format blog data for Card component
  const formattedBlogs = blogs.map((blog, index) => ({
    id: blog._id || index,
    title: blog.title || 'Untitled Blog',
    description: blog.excerpt || (blog.content ?
      blog.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' :
      'No description available'),
    category: blog.category || 'Blog',
    image: blog.image || blog.featuredImage || 'https://res.cloudinary.com/decptkmx7/image/upload/v1751974369/trending_pg_img_nmsinr.jpg',
    author: blog.author || 'Admin',
    date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date',
    readTime: '5 min read',
    slug: blog.slug || '#',
    excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : 'No excerpt available'),
    featuredImage: blog.image || blog.featuredImage || 'https://res.cloudinary.com/decptkmx7/image/upload/v1751974369/trending_pg_img_nmsinr.jpg'
  }));

  // Create extended array for infinite loop effect
  const extendedBlogs = [
    ...formattedBlogs.slice(-slidesToShow), // Last n blogs at the beginning
    ...formattedBlogs,                      // Original blogs
    ...formattedBlogs.slice(0, slidesToShow) // First n blogs at the end
  ];

  // Calculate transform offset based on slides to show
  const getTransformValue = () => {
    const adjustedSlide = currentSlide + slidesToShow;
    const percentagePerSlide = 100 / slidesToShow;
    return `translateX(-${adjustedSlide * percentagePerSlide}%)`;
  };

  // Calculate which blogs to show
  const displaySlide = ((currentSlide % blogs.length) + blogs.length) % blogs.length;

  // Calculate card width based on slides to show
  const getCardWidth = () => {
    return `${100 / slidesToShow}%`;
  };

  return (
    <>
      <div id="latest-blogs" className="relative w-full mx-auto overflow-hidden py-8 md:py-16 px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className={styles.sectionHeading}>
        <h2>Read our Latest Blogs</h2>
        <div className={styles.titleUnderline}></div>
        <p>Our alumni are making remarkable strides in top organizations</p>
      </div>
        </div>

        {/* Blog Cards Container */}
        <div className="max-w-screen-xl mx-auto relative">
          {/* Navigation Arrows - Always visible for infinite loop */}
          {blogs.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 bg-blue-500/70 hover:bg-white/20 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous blog"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 bg-blue-500/70 hover:bg-white/20 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next blog"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Blog Cards Grid - Responsive width calculation */}
          <div className="overflow-hidden px-2 md:px-8">
            <div 
              className="flex"
              style={{
                transform: getTransformValue(),
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            >
              {extendedBlogs.map((blog, index) => (
                <div
                  key={`${blog.id}-${index}`}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ 
                    width: getCardWidth(),
                  }}
                  onMouseEnter={() => setHoveredCard(`${blog.id}-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}>
                    <div
                      className="group relative rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 shadow-xl hover:shadow-blue-500/20 h-72 md:h-80 w-full"
                    >
                      {/* Background Image - This will scale on hover */}
                      <div
                        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${blog.image})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />

                      {/* Dark overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                      {/* Category Badge - Positioned at top */}
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-blue-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold z-10">
                        {blog.category}
                      </div>

                      {/* Content - Positioned at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors duration-300">
                          {blog.title}
                        </h3>
                        <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                          {blog.description}
                        </p>

                        {/* View More Button */}
                        <div className="flex items-center justify-between mt-3 md:mt-4">
                          <span className="text-blue-500 font-semibold text-xs md:text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                            View More
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots - Updated for infinite loop */}
          {blogs.length > slidesToShow && (
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {formattedBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentSlide(index);
                    }
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    displaySlide === index ? 'bg-blue-500 w-6 md:w-8 h-2' : 'bg-gray-600 w-2 h-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center px-4 md:px-8 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm md:text-base rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            View All Blogs
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default LatestBlogs;
