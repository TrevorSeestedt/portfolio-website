import React from 'react';
import ContentWrapper from '../components/ContentWrapper';
import ProjectList from '../components/ProjectList';
import GearPC from '../components/Gear_PC';
import GearAudio from '../components/Gear_Audio';
import GearPeripherals from '../components/Gear_Peripherals';
import '../css/Projects.css';

const Projects = () => {
  return (
    <ContentWrapper>
      <div className="projects page-content">
        <div className="projects-container">
          <h1>Projects</h1>
          <div className="projects-blurb">
            Some of the projects I've been working on recently.
          </div>
          <ProjectList />
          <h2 className="gear-title">My Gear</h2>
          <div className="gear-blurb">
            What stuff I use day to day.
          </div>
          <div className="gear-section">
            <GearPC />
            <GearAudio />
            <GearPeripherals />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Projects;
