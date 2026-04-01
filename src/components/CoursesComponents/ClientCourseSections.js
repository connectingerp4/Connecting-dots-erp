"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// === Above the fold (SSR enabled for SEO-critical content) ===
const DSHeader = dynamic(() => import("./Header"));
const Why = dynamic(() => import("./Why"));
const SapModComponent = dynamic(() => import("./sapmod"), { ssr: false });
const Curriculum = dynamic(() => import("./Curriculam"), { ssr: false });
const Modules = dynamic(() => import("./Modules"), { ssr: false });

// === Below the fold (hydrated after initial paint) ===
const Counselor = dynamic(() => import("./Councelor"), { ssr: false });
const TrustUs = dynamic(() => import("./Trustus"), { ssr: false });
const Certificate = dynamic(() => import("../HomePage/Certificate"), { ssr: false });
const Program = dynamic(() => import("./ProgramHighlights"), { ssr: false });
const Description = dynamic(() => import("./Description"), { ssr: false });
const FAQ = dynamic(() => import("./FAQ"), { ssr: false });
const CoursesRelated = dynamic(() => import("./RelatedCourses"), { ssr: false });
const HrCard = dynamic(() => import("./HRCard"), { ssr: false });

export default function ClientCourseSections(props) {
  const {
    layoutType, // 'digital' | 'default'
    headerData,
    whyData,
    sapModData,
    course,
    modulesData,
    descriptionContentData,
    certificateData,
    faqData,
    relatedCoursesData,
    currentCityName,
    courseCategory,
    shouldUseNewCurriculum,
    shouldUseLegacyModules,
  } = props;

  // === Digital Marketing layout (multi-section courses) ===
  if (layoutType === "digital") {
    return (
      <>
        {/* --- Above-the-fold content --- */}
        <DSHeader data={headerData} />
        <Why data={whyData} />
        {sapModData && <SapModComponent data={sapModData} />}

        {shouldUseNewCurriculum && (
          <Suspense fallback={null}>
            <Curriculum data={course} />
          </Suspense>
        )}

        {shouldUseLegacyModules && (
          <Suspense fallback={null}>
            <Modules data={modulesData} />
          </Suspense>
        )}

        {/* --- Below-the-fold (lazy-hydrated) --- */}
        <Suspense fallback={null}>
          <Counselor />
        </Suspense>

        <Suspense fallback={null}>
          <Description data={descriptionContentData.main} />
        </Suspense>

        <div id="pay-per-click" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            {descriptionContentData.ppc && (
              <Description data={descriptionContentData.ppc} sectionIndex={0} />
            )}
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <TrustUs />
        </Suspense>

        <div id="search-engine-optimization" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            {descriptionContentData.seo && (
              <Description data={descriptionContentData.seo} sectionIndex={1} />
            )}
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <Certificate data={certificateData} />
        </Suspense>

        <Suspense fallback={null}>
          <Program />
        </Suspense>

        <div id="social-media-marketing" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            {descriptionContentData.smm && (
              <Description data={descriptionContentData.smm} sectionIndex={0} />
            )}
          </Suspense>
        </div>

        <div id="advance-analytics" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            {descriptionContentData.analytics && (
              <Description data={descriptionContentData.analytics} sectionIndex={1} />
            )}
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <FAQ data={faqData} />
        </Suspense>

        <Suspense fallback={null}>
          <CoursesRelated data={relatedCoursesData} currentCityName={currentCityName} />
        </Suspense>
      </>
    );
  }

  // === Default layout (e.g. SAP, HR, Data Analytics) ===
  return (
    <>
      {/* --- Above-the-fold --- */}
      <DSHeader data={headerData} />
      <Why data={whyData} />

      {sapModData && <SapModComponent data={sapModData} />}

      {shouldUseNewCurriculum && (
        <div id="curriculum" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            <Curriculum data={course} />
          </Suspense>
        </div>
      )}

      {shouldUseLegacyModules && (
        <div id="modules" style={{ scrollMarginTop: "80px" }}>
          <Suspense fallback={null}>
            <Modules data={modulesData} />
          </Suspense>
        </div>
      )}

      {/* --- Below-the-fold --- */}
      <Suspense fallback={null}>
        <Counselor />
      </Suspense>

      <Suspense fallback={null}>
        <TrustUs />
      </Suspense>

      <Suspense fallback={null}>
        <Program />
      </Suspense>

      <Suspense fallback={null}>
        <Certificate data={certificateData} />
      </Suspense>

      <Suspense fallback={null}>
        <Description data={descriptionContentData} />
      </Suspense>

      <Suspense fallback={null}>
        <FAQ data={faqData} />
      </Suspense>

      {courseCategory === "hr" && (
        <Suspense fallback={null}>
          <HrCard />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <CoursesRelated
          data={relatedCoursesData}
          currentCityName={currentCityName}
        />
      </Suspense>
    </>
  );
}
