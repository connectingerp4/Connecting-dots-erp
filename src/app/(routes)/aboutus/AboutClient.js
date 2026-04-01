// app/aboutus/AboutClient.jsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// dynamic imports with ssr: false are allowed inside this client component
const Hero = dynamic(() => import("@/components/TestingAbout/Hero"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 flex items-center justify-center">Loading hero...</div>,
});

const AchievementsSection = dynamic(() => import("@/components/TestingAbout/Achievements"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 flex items-center justify-center">Loading achievements...</div>,
});

const OurBranch = dynamic(() => import("@/components/TestingAbout/Locations"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 flex items-center justify-center">Loading locations...</div>,
});

const SAPCompassDial = dynamic(() => import("@/components/TestingAbout/Placement"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 flex items-center justify-center">Loading placements...</div>,
});

const SAPAdoptionRings = dynamic(() => import("@/components/TestingAbout/SapComp"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 flex items-center justify-center">Loading SAP content...</div>,
});

const AboutClient = ({ branches = [] }) => {
  return (
    <div className="min-h-screen bg-white">
      <h1 className="sr-only">Connecting Dots ERP</h1>

      <Hero />
      <AchievementsSection />
      <SAPCompassDial />
      <SAPAdoptionRings />
      <OurBranch branches={branches} />
    </div>
  );
};

export default AboutClient;
