import React, { lazy, Suspense } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import '../css/Projects.css';

// Lazy load components
const ProjectList = lazy(() => import('../components/ProjectList'));
const GearPC = lazy(() => import('../components/Gear_PC'));
const GearAudio = lazy(() => import('../components/Gear_Audio'));
const GearPeripherals = lazy(() => import('../components/Gear_Peripherals'));

const Projects = () => {
  return (
    <ContentWrapper>
      <div className="projects page-content">
        <div className="projects-container">
          <h1>Projects</h1>
          <div className="projects-blurb">
            Some of the projects I've been working on recently.
          </div>
          <Suspense fallback={<div className="loading">Loading projects...</div>}>
            <ProjectList />
          </Suspense>
          <h2 className="gear-title">My Gear</h2>
          <div className="gear-blurb">
            What stuff I use day to day.
          </div>
          <div className="gear-section">
            <Suspense fallback={<div className="loading">Loading PC specs...</div>}>
              <GearPC />
            </Suspense>
            <Suspense fallback={<div className="loading">Loading audio gear...</div>}>
              <GearAudio />
            </Suspense>
            <Suspense fallback={<div className="loading">Loading peripherals...</div>}>
              <GearPeripherals />
            </Suspense>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default React.memo(Projects);
