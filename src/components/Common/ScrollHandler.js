'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Client-side scroll handler component that manages smooth scrolling to hash fragments.
 * 
 * Performance benefits:
 * - Runs only on client-side after hydration (reduces main thread work during SSR)
 * - Uses requestIdleCallback to defer non-critical scroll operations
 * - Cleanup function removes event listeners to prevent memory leaks
 * - Uses Next.js navigation hooks for optimal route change handling
 */
const ScrollHandler = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Function to handle scroll to hash
    const scrollToHash = () => {
      // Use requestIdleCallback to defer non-critical work
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
              // Small delay to ensure DOM is fully rendered
              setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  });
                }
              }, 100); // Reduced from 500ms to 100ms for better UX
            }
          },
          { timeout: 2000 } // Wait at most 2 seconds before executing
        );
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 100);
        }
      }
    };

    // Handle initial page load
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        scrollToHash();
      } else {
        window.addEventListener('load', scrollToHash, { once: true });
      }
    };

    // Handle hash changes
    const handleHashChange = () => scrollToHash();

    // Set up event listeners
    window.addEventListener('hashchange', handleHashChange);
    
    // Use requestIdleCallback to defer the initial scroll
    if ('requestIdleCallback' in window) {
      requestIdleCallback(handleLoad, { timeout: 2000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad, { once: true });
      }
    }

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname, searchParams]); // Re-run when path or search params change

  return null; // This component doesn't render anything
};

export default ScrollHandler;
