// components/HomePage/DemoCertificate.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/HomePage/Certificate.module.css";
import { Button } from "react-bootstrap";
import dynamic from "next/dynamic";

// Dynamically import Btnform to prevent SSR-related issues
const Btnform = dynamic(() => import("@/components/HomePage/Btnform"), {
  ssr: false,
});

// Hardcoded certificate data
const certificateData = {
  courseTitle: "SAP Training Certificate",
  alt: "sap-training-certification-from-connecting-dots-erp",
  image: "/Certificate/Certificate.avif",
  completionText:
    "The Connecting Dots SAP Certification Course is designed to enhance your expertise in SAP systems and set you on the path to a successful career in ERP. Our program goes beyond theoretical learning, offering hands-on practical sessions and real-world scenarios across various SAP modules.",
  description:
    "With expert guidance and a focus on practical application, you'll be well-equipped to thrive in the dynamic world of SAP and meet the evolving needs of modern businesses.",
};

// Certificate component no longer needs props
const DemoCertificate = () => {
  const [showForm, setShowForm] = useState(false);
  const handleButtonClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <div className={styles.certificateSection}>
      <h2 className={styles.certificateTitle}>Certificate</h2>
      <div className={styles.titleUnderline}></div>
      <div className={styles.certificateContent}>
        <div className={styles.certificateImage}>
          <Image
            src={certificateData.image}
            alt={certificateData.alt || `${certificateData.courseTitle} Certificate`}
            width={500}
            height={300}
            layout="intrinsic"
          />
        </div>
        <div className={styles.certificateText}>
          <h2>Congratulations on Completing Your Training!</h2>
          <h4 className={styles.certificateSubtitle}>
            {certificateData.courseTitle}
          </h4>
          <p>{certificateData.completionText}</p>
          <p>{certificateData.description}</p>
          <div className="mb-3 btnContainer">
            <Button className={styles.outlineBtn} onClick={handleButtonClick}>
              Get your Certificate
            </Button>
          </div>
          {showForm && <Btnform onClose={handleCloseForm} />}
        </div>
      </div>
    </div>
  );
};

export default DemoCertificate;