// app/HomeClient.jsx  (client component)
'use client';

// Note: Metadata moved to page.js (server) to ensure it's server-rendered
import dynamic from "next/dynamic";
import LazyHydrate from 'react-lazy-hydration';

// Critical above-the-fold component - import normally (SSR ok)
import HeaderCarousel from "@/components/HomePage/HeaderCarousel";

// Lazy load below-the-fold components for better performance (client-only)
const Marquee = dynamic(() => import("@/components/HomePage/Marquee2"), {
  ssr: false,
  loading: () => <div style={{ height: "60px" }} />,
});

const Chevron = dynamic(() => import("@/components/HomePage/Chevron"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100px" }} />,
});

const Keypoints = dynamic(() => import("@/components/HomePage/Keypoints"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "300px" }} />,
});

const OurClients = dynamic(() => import("@/components/HomePage/OurClients"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "200px" }} />,
});

const PlacementSection = dynamic(
  () => import("@/components/HomePage/PlacementSection"),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: "400px" }} />,
  }
);

const OurStats = dynamic(() => import("@/components/HomePage/OurStats"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "250px" }} />,
});

const Achievements = dynamic(
  () => import("@/components/HomePage/Achievements"),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: "300px" }} />,
  }
);

const FeedbackAndReviews = dynamic(
  () => import("@/components/HomePage/FeedbackandReviews"),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: "400px" }} />,
  }
);

const DemoCertificate = dynamic(() => import("@/components/HomePage/DemoCertificate"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "300px" }} />,
});

const Branches = dynamic(() => import("@/components/HomePage/Branches"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "350px" }} />,
});

const Courses = dynamic(() => import("@/components/HomePage/PopCourses"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "400px" }} />,
});

const LatestBlogs = dynamic(() => import("@/components/HomePage/Blogs"),{
  ssr: false,
  loading: () => <div style={{ minHeight: "400px "}} />,
});


export default function HomeClient() {
  return (
    <>
      {/* Main Page Content */}
      <main className="flex-col justify-center">
        <h1 className="visually-hidden">Job-Oriented Training That Gets You Hired</h1>

        {/* Above the fold - critical content */}
        <HeaderCarousel />

        {/* client-only sections (lazy) */}
        <Marquee />
        <Chevron />
        <OurClients />
        <Keypoints />
        <Courses />
        <PlacementSection />
        <OurStats />

        <Achievements
          grayscale={false}
          overlayBlurColor="transparent"
          segments={24}
          fit={0.5}
        />

        <FeedbackAndReviews />
        <DemoCertificate />
        <LatestBlogs />
        <Branches />
      </main>
    </>
  );
}
