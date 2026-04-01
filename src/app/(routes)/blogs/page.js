import { getStaticHtml } from "@/lib/staticHtml";
import BlogClientContent from "@/components/BlogsPage/BlogClientContent";
import Script from "next/script";

const staticHtml = getStaticHtml("blog");

// -------------------------------
//     METADATA (unchanged)
// -------------------------------
export const metadata = {
  title: "Connecting Dots ERP Blog | SAP, HR & IT Training Insights",
  description: "Explore expert blogs on SAP Courses, HR training, IT programs, ERP career tips, placement guidance, and industry insights. Stay updated with the latest from Connecting Dots ERP.",
  alternates: {
    canonical: "https://connectingdotserp.com/blogs",
    languages: {
      'en-IN': 'https://connectingdotserp.com/blogs',
      'x-default': 'https://connectingdotserp.com/blogs',
    },
  },
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
    title: "Connecting Dots ERP Blog | SAP, HR & IT Training Insights",
    description: "Discover blogs on SAP modules, HR training, technology trends, career growth tips, and insights from industry experts.",
    url: "https://connectingdotserp.com/blogs",
    siteName: "Connecting Dots ERP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://connectingdotserp.com/Navbar/logo.webp",
        width: 981,
        height: 420,
        alt: "Connecting Dots ERP Blogs"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@CD_ERP",
    creator: "@CD_ERP",
    title: "Connecting Dots ERP Blog | SAP, HR & IT Training Insights",
    description: "Read blogs on SAP, HR, IT training, ERP careers, tips, and the latest industry updates.",
    images: ["https://connectingdotserp.com/Navbar/logo.webp"]
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  }
};

export default async function BlogIndexPage() {
  return (
    <>
      {/* -------------------------------
          JSON-LD STRUCTURED DATA ADDED
         ------------------------------- */}
      <Script
        id="blogs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["WebPage", "CollectionPage"],
                "@id": "https://connectingdotserp.com/blogs",
                url: "https://connectingdotserp.com/blogs",
                name: "Connecting Dots ERP - Blogs",
                isPartOf: { "@id": "https://connectingdotserp.com/#website" },
                datePublished: "2025-08-20T10:23:18+00:00",
                dateModified: "2025-11-07T12:00:39+00:00",
                breadcrumb: {
                  "@id": "https://connectingdotserp.com/blogs#breadcrumb",
                },
                mainEntity: {
                  "@id": "https://connectingdotserp.com/blogs#blog",
                },
                inLanguage: "en-US",
              },

              {
                "@type": "BreadcrumbList",
                "@id": "https://connectingdotserp.com/blogs#breadcrumb",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://connectingdotserp.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Blog",
                    item: "https://connectingdotserp.com/blogs",
                  },
                ],
              },

              {
                "@type": "Blog",
                "@id": "https://connectingdotserp.com/blogs#blog",
                name: "Connecting Dots ERP Blogs",
                url: "https://connectingdotserp.com/blogs",
                description:
                  "Latest insights on SAP courses, IT training, HR training and career tips.",
                publisher: {
                  "@id": "https://connectingdotserp.com/#organization",
                },
                inLanguage: "en-US",
              },

              {
                "@type": "WebSite",
                "@id": "https://connectingdotserp.com/#website",
                url: "https://connectingdotserp.com/",
                name: "Connecting Dots ERP",
                description: "Best SAP and IT Training Institute",
                publisher: {
                  "@id": "https://connectingdotserp.com/#organization",
                },
                potentialAction: [
                  {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://connectingdotserp.com/?s={search_term_string}",
                    },
                    "query-input": {
                      "@type": "PropertyValueSpecification",
                      valueRequired: true,
                      valueName: "search_term_string",
                    },
                  },
                ],
                inLanguage: "en-US",
              },

              {
                "@type": "Organization",
                "@id": "https://connectingdotserp.com/#organization",
                name: "Connecting Dots ERP",
                description: "Best Training Provider | Placement Giants",
                url: "https://connectingdotserp.com",
                telephone: "+919004002941",
                logo: {
                  "@type": "ImageObject",
                  url: "https://connectingdotserp.com/Navbar/logo.webp",
                  "@id": "https://connectingdotserp.com/#organizationLogoImage",
                  width: 228,
                  height: 70,
                  caption: "Connecting Dots ERP Logo",
                },
                image: {
                  "@id":
                    "https://connectingdotserp.com/#organizationLogoImage",
                },
                sameAs: [
                  "https://www.facebook.com/sapinstallation.pune.9",
                  "https://x.com/CD_ERP",
                  "https://www.youtube.com/channel/UCxQ-RBOBaoYjjd4Mv7qQekA",
                  "https://www.linkedin.com/company/connecting-dots-erp",
                  "https://www.instagram.com/connecting_dot_software_course/",
                  "https://in.pinterest.com/Connecting_Dots_ERP/",
                  "https://www.quora.com/profile/Connecting-Dot-ERP-SAP-And-IT-Training-Institute",
                ],
              },
            ],
          }),
        }}
      />

      {/* Static HTML content for SEO */}
      {/* <div id="seo-content" dangerouslySetInnerHTML={{ __html: staticHtml }} /> */}

      {/* Client-side blog page React UI */}
      <BlogClientContent />
    </>
  );
}
