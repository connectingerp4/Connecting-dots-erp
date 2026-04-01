// app/aboutus/page.js
import AboutClient from "./AboutClient";

// Server-side metadata (appears in server HTML/head)
export const metadata = {
  title: "About Us | Connecting Dots ERP - SAP Training Institute in Pune, Mumbai & Raipur",
  description:
    "Discover our story, expert trainers, and commitment to SAP, IT, and HR training with 100% placement support across multiple locations.",
  alternates: { canonical: "https://connectingdotserp.com/aboutus" },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "About Connecting Dots ERP | Premier SAP Training Institute",
    description:
      "Learn about our 10+ years of excellence in SAP, software, and professional training with branches in Pune, Mumbai, and Raipur.",
    url: "https://connectingdotserp.com/aboutus",
    siteName: "Connecting Dots ERP",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://connectingdotserp.com/images/about-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Connecting Dots ERP Team and Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Connecting Dots ERP",
    description:
      "Premier SAP and IT training institute with expert-led courses and placement assistance.",
    images: ["https://connectingdotserp.com/images/about-hero.jpg"],
    site: "@connectingdotserp",
  },
};

// JSON-LD structured data (server-rendered so crawlers see it)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://connectingdotserp.com/aboutus",
      url: "https://connectingdotserp.com/aboutus",
      name: "About Us - Connecting Dots ERP | SAP & IT Training Institute",
      isPartOf: { "@id": "https://connectingdotserp.com/#website" },
      primaryImageOfPage: { "@id": "https://connectingdotserp.com/aboutus#primaryimage" },
      image: { "@id": "https://connectingdotserp.com/aboutus#primaryimage" },
      thumbnailUrl: "https://connectingdotserp.com/Navbar/logo.webp",
      datePublished: "2025-09-01T10:00:00+00:00",
      dateModified: "2025-11-24T10:00:00+00:00",
      description:
        "Connecting Dots ERP is a leading SAP and IT training institute offering SAP modules, HR training, IT courses, and placement assistance in Pune and Mumbai.",
      breadcrumb: { "@id": "https://connectingdotserp.com/aboutus#breadcrumb" },
      inLanguage: "en-US",
      potentialAction: [{ "@type": "ReadAction", target: ["https://connectingdotserp.com/aboutus"] }],
    },
    {
      "@type": "ImageObject",
      inLanguage: "en-US",
      "@id": "https://connectingdotserp.com/aboutus#primaryimage",
      url: "https://connectingdotserp.com/Navbar/logo.webp",
      contentUrl: "https://connectingdotserp.com/Navbar/logo.webp",
      width: 1200,
      height: 800,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://connectingdotserp.com/aboutus#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://connectingdotserp.com/" },
        { "@type": "ListItem", position: 2, name: "About Us", item: "https://connectingdotserp.com/aboutus" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://connectingdotserp.com/#website",
      url: "https://connectingdotserp.com/",
      name: "Connecting Dots ERP",
      description: "SAP & IT Training Institute in Pune and Mumbai with 100% Placement Support.",
      publisher: { "@id": "https://connectingdotserp.com/#organization" },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://connectingdotserp.com/?s={search_term_string}" },
          "query-input": { "@type": "PropertyValueSpecification", valueRequired: true, valueName: "search_term_string" },
        },
      ],
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://connectingdotserp.com/#organization",
      name: "Connecting Dots ERP",
      url: "https://connectingdotserp.com",
      logo: {
        "@type": "ImageObject",
        "@id": "https://connectingdotserp.com/#organizationLogoImage",
        url: "https://connectingdotserp.com/Navbar/logo.webp",
        width: 228,
        height: 70,
      },
      description:
        "Connecting Dots ERP provides SAP training, HR courses, IT programs, and placement support to build successful careers.",
      telephone: "+919004002941",
      sameAs: [
        "https://www.facebook.com/sapinstallation.pune.9",
        "https://x.com/CD_ERP",
        "https://www.youtube.com/channel/UCxQ-RBOBaoYjjd4Mv7qQekA",
        "https://www.linkedin.com/company/connecting-dots-erp",
        "https://www.instagram.com/connecting_dot_software_course/",
        "https://in.pinterest.com/Connecting_Dots_ERP/",
        "https://www.quora.com/profile/Connecting-Dot-ERP-SAP-And-IT-Training-Institute",
      ],
      inLanguage: "en-US",
    },
  ],
};

// Static branches data (passed into client component)
const branches = [
  {
    city: "Pune",
    address: "1st Floor, Sai Arcade, Wakad - Hinjewadi Rd, Wakad, Pune, Maharashtra 411057",
    phone: "+91 1234567890",
    email: "pune@connectingdotserp.com",
    coords: { lat: 18.5993, lng: 73.7449 },
  },
  {
    city: "Mumbai",
    address: "Office No. 12, 3rd Floor, Sai Chambers, Sector 11, CBD Belapur, Navi Mumbai, Maharashtra 400614",
    phone: "+91 1234567891",
    email: "mumbai@connectingdotserp.com",
    coords: { lat: 19.0225, lng: 73.0297 },
  },
  {
    city: "Raipur",
    address: "1st Floor, City Center Mall, G.E. Road, Raipur, Chhattisgarh 492001",
    phone: "+91 1234567892",
    email: "raipur@connectingdotserp.com",
    coords: { lat: 21.2409, lng: 81.6337 },
  },
];

export default function Page() {
  return (
    <>
      {/* JSON-LD is server-rendered so it's visible to crawlers */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Client UI rendered inside the server page */}
      <AboutClient branches={branches} />
    </>
  );
}
