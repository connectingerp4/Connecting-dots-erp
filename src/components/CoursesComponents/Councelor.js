"use client"; //  Next.js Client Component

import React, { useEffect, useState } from "react";
import Btnform from "@/components/HomePage/Btnform";
import styles from "@/styles/CoursesComponents/Councelor.module.css";
import dynamic from "next/dynamic";

// Dynamically import AOS with SSR disabled
const AOS = dynamic(() => import('aos').then(mod => mod.default), {
  ssr: false,
  loading: () => null,
});

const Councelor = () => {
  const [showForm, setShowForm] = useState(false)

  const handleButtonClick = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    
    const initAOS = async () => {
      if (AOS) {
        try {
          const AOS = (await import('aos')).default;
          AOS.init({
            duration: 150,
            once: true,
            startEvent: 'load',
            offset: 100,
            easing: 'ease-in-out',
            delay: 100
          });
          
          // Refresh AOS when components are dynamically loaded
          const handleRouteChange = () => AOS.refresh();
          window.addEventListener('load', handleRouteChange);
          
          return () => {
            window.removeEventListener('load', handleRouteChange);
            if (mounted) AOS.refreshHard();
          };
        } catch (error) {
          console.error('Error initializing AOS:', error);
        }
      }
    };

    // Use requestIdleCallback if available, otherwise use a small timeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initAOS, { timeout: 2000 });
    } else {
      const timer = setTimeout(initAOS, 800);
      return () => clearTimeout(timer);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div className={styles.counselorContainer}>
        <video
          className={styles.backgroundVideo}
          src="https://i.imgur.com/OKLCgpA.mp4"
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
        <div className={styles.counselorContent} data-aos="zoom-in">
          <div className={styles.counselorText} data-aos="fade-right">
            {/* Your text or other content goes here */}
          </div>
          <div className={styles.buttonContainer} data-aos="fade-left">
            <button
              className={styles.requestButton}
              onClick={handleButtonClick}
            >
              Request Callback
            </button>
          </div>
        </div>
      </div>
      {showForm && <Btnform onClose={handleCloseForm} />}
    </div>
  )
}

export default Councelor
