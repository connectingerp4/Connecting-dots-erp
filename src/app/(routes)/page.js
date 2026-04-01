// app/page.js  (server component)
import HomeClient from "./HomeClient"; // client UI component

export const metadata = {
  title: "Connecting Dots ERP - SAP & IT Training Institute",
  description:
    "Looking for an offline or online SAP course? Join today for hands-on training, expert guidance & Get free s/4 hana server access during Training",
  keywords: [
    "SAP Certification Courses",
    "SAP Course",
    "Data Science Course",
    "Power Bi Course",
    "Digital Marketing Course",
    "HR Training Institute",
    "SAP Training Institute",
    "Python Course",
    "Software Course",
    "Training",
    "Education",
  ],
  author: "Connecting Dots ERP | Software and SAP Training Institute",
  robots: "index, follow",
  alternates: {
    canonical: "https://connectingdotserp.com/",
    languages: {
      "en-IN": "https://connectingdotserp.com/",
      "x-default": "https://connectingdotserp.com/",
    },
  },
  openGraph: {
    title: "Connecting Dots ERP | SAP, HR & IT Training Institute",
    description:
      "Upgrade your career with SAP training, HR courses, IT programs, and job-oriented certifications at Connecting Dots ERP. Classroom & online batches available.",
    url: "https://connectingdotserp.com/",
    siteName: "Connecting Dots ERP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://connectingdotserp.com/Navbar/logo.webp",
        width: 981,
        height: 420,
        alt: "Connecting Dots ERP Institute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CD_ERP",
    creator: "@CD_ERP",
    title: "Connecting Dots ERP | SAP, HR & IT Training Institute",
    description:
      "Learn SAP, HR and IT courses with expert trainers, real-time projects and 100% placement support at Connecting Dots ERP.",
    images: ["https://connectingdotserp.com/Navbar/logo.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

// JSON-LD structured data (server-rendered so visible to crawlers / View Source)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://connectingdotserp.com/#organization",
      name: "Connecting Dots ERP SAP Training Institute",
      url: "https://connectingdotserp.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://connectingdotserp.com/Navbar/logo.webp",
        width: 180,
        height: 60,
      },
      sameAs: [
        "https://www.facebook.com/sapinstallation.pune.9",
        "https://x.com/CD_ERP",
        "https://www.instagram.com/connecting_dots_sap_training",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+919004002958",
        contactType: "Customer Support",
        areaServed: "IN",
        availableLanguage: ["English"],
      },
      description:
        "We offer expert-led training in SAP, Software Development, Digital Marketing, and HR courses with strong placement support for your career.",
      address: [
        {
          "@type": "PostalAddress",
          streetAddress:
            "1st Floor, 101, Police, Wireless Colony, Vishal Nagar, Pimple Nilakh",
          addressLocality: "Pune",
          addressRegion: "MH",
          postalCode: "411027",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          streetAddress:
            "8th Floor, Paradise Tower, next to McDonald's, Naupada, Thane West",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400601",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          streetAddress:
            "8th Floor, Paradise Tower, next to McDonald's, Naupada, Thane West",
          addressLocality: "Raipur",
          addressRegion: "Chhattisgarh",
          postalCode: "492001",
          addressCountry: "IN",
        },
      ],
      geo: {
        "@type": "GeoCoordinates",
        latitude: "18.586532821424697",
        longitude: "73.78137250928907",
      },
      foundingDate: "2013",
      founder: { "@type": "Person", name: "Nitendra Singh" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: "185" },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@type": "Product",
      "@id": "https://connectingdotserp.com/#product",
      name: "SAP Course",
      description: "Comprehensive SAP covering all modules.",
      image:
        "https://res.cloudinary.com/dubeuisom/image/upload/v1758623118/sap_5_o5zehc.png",
      url: "https://connectingdotserp.com/",
      brand: { "@type": "Brand", name: "Connecting Dots ERP" },
      offers: {
        "@type": "Offer",
        price: "75000",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: "2025-04-01",
      },
    },
    {
      "@type": "Course",
      "@id": "https://connectingdotserp.com/#course",
      name: "SAP Course",
      description: "Comprehensive SAP with modules designed to help you master SAP systems.",
      provider: { "@type": "Organization", name: "Connecting Dots ERP", url: "https://connectingdotserp.com/" },
    },
    {
      "@type": "VideoObject",
      "@id": "https://connectingdotserp.com/#video",
      name: "Introduction to ConnectingDots",
      description:
        "Connecting Dots ERP is a SAP and software training institute in Pune offering a wide range of career enhancement courses. We offer SAP Courses Digital Marketing & HR along with other IT courses.",
      embedUrl: "https://youtu.be/7YRbfuv7R3k?si=cqdu5buZ-Ya_-O8R",
      uploadDate: "2025-04-03",
      duration: "PT5M",
      thumbnailUrl:
        "https://res.cloudinary.com/dubeuisom/image/upload/v1758623118/sap_5_o5zehc.png",
      publisher: { "@type": "Organization", name: "Connecting Dots ERP" },
    },
    {
      "@type": "SpecialAnnouncement",
      "@id": "https://connectingdotserp.com/#announcement",
      headline: "Batches Starting Soon",
      text: "Connecting Dots ERP is a SAP and software training institute in Pune offering a wide range of career enhancement courses. We offer SAP Courses Digital Marketing & HR along with other IT courses.",
      url: "https://connectingdotserp.com/",
      datePosted: "2025-06-10",
      expires: "2025-12-31",
      publisher: { "@id": "https://connectingdotserp.com/#organization" },
      announcementLocation: {
        "@type": "Place",
        "@id": "https://connectingdotserp.com/pune/#localbusiness",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      {/* Inline JSON-LD in server page so it's visible to crawlers / View Page Source */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Render client-side home UI (HomeClient uses 'use client' and dynamic imports) */}
      <HomeClient />
    </>
  );
}
