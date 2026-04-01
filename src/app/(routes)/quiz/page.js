// src/app/(routes)/quiz/page.js
import QuizClientContent from './QuizClientContent';

export const metadata = {
  title: "Interactive Quizzes | Test Your Knowledge - Connecting Dots ERP",
  description:
    "Challenge yourself with our comprehensive interactive quizzes covering SAP, Software Development, Digital Marketing, and HR topics. Test your skills and track your progress.",

  // Open Graph Tags
  openGraph: {
    title: "Interactive Quizzes | Test Your Knowledge - Connecting Dots ERP",
    description:
      "Challenge yourself with our comprehensive interactive quizzes covering SAP, Software Development, Digital Marketing, and HR topics. Test your skills and track your progress.",
    url: "https://connectingdotserp.com/quiz",
    siteName: "Connecting Dots ERP",
    images: [
      {
        url: "https://connectingdotserp.com/images/quiz-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Interactive Quizzes - Connecting Dots ERP",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    title: "Interactive Quizzes | Test Your Knowledge - Connecting Dots ERP",
    description:
      "Challenge yourself with our comprehensive interactive quizzes covering SAP, Software Development, Digital Marketing, and HR topics.",
    images: ["https://connectingdotserp.com/images/quiz-banner.jpg"],
    site: "@CD_ERP",
    creator: "@CD_ERP",
  },

  // Additional Meta Tags
  keywords:
    "online quiz, SAP quiz, programming quiz, digital marketing quiz, HR quiz, skill assessment, interactive learning, Connecting Dots ERP",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://connectingdotserp.com/quiz",
  },
};

export default function QuizPage() {
  return (
    <>
      <h1 className="sr-only">Choose your quiz topic</h1>
      <QuizClientContent />
    </>
  );
}

