'use client';

import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import styles from '@/styles/CoursesComponents/Projects.module.css';

const Projects = ({ pageId, pageType }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [projectsData, setProjectsData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/Jsonfolder/projectsdata.json', { cache: 'force-cache' });

        if (!response.ok) {
          console.error('Failed to fetch projectsdata.json:', response.status);
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.error('projectsdata.json did not return JSON. Content-Type:', contentType);
          return;
        }

        const data = await response.json();
        const pageData = data?.[pageType]?.[pageId];
        setProjectsData(pageData || null);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchProjects();
  }, [pageId, pageType]);

  const handleSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

  if (!projectsData) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsTitle}>
        <h2>{projectsData.title}</h2>
      </div>
      <Carousel
        activeIndex={carouselIndex}
        onSelect={handleSelect}
        interval={3000}
        indicators={false}
        controls={false}
        pause="hover"
      >
        {[0, 5].map((start, idx) => (
          <Carousel.Item key={idx}>
            <div className={styles.projectsGrid}>
              {projectsData.projects.slice(start, start + 5).map((project, index) => (
                <div key={index} className={styles.projectsCard}>
                  <div className={styles.projectsContainer}>
                    <Image
                      src={project.icon}
                      alt={`${project.name} icon`}
                      width={100}
                      height={100}
                      className={styles.projectsIcon}
                    />
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div className={styles.projectsRadioButtons}>
        {[0, 1].map((num) => (
          <label key={num}>
            <input
              type="radio"
              name="carousel-radio"
              checked={carouselIndex === num}
              onChange={() => handleSelect(num)}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default Projects;
