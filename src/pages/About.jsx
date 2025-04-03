import React from 'react';
import ContentWrapper from '../components/ContentWrapper';
import CareerTimeline from '../components/CareerTimeline';
import Hobbies from '../components/Hobbies';
import photo1 from '../assets/photo1.JPG';
import photo2 from '../assets/photo2.JPG';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/photo4.jpg';
import '../css/About.css';
import MusicLibrary from '../components/MusicLibrary';

const About = () => {
  return (
    <ContentWrapper>
      <div className="about page-content">
        <div className="about-container">
          <h1>About Me</h1>
            <div className="about-blurb">
              Who I am and what I'm doing. 
            </div>
          <div className="photo-grid">
            <div className="photo-container">
              <img src={photo1} alt="Trevor Seestedt" />
            </div>
            <div className="photo-container">
              <img src={photo3} alt="Trevor Seestedt" />
            </div>
            <div className="photo-container">
              <img src={photo2} alt="Trevor Seestedt" />
            </div>
            <div className="photo-container">
              <img src={photo4} alt="Trevor Seestedt" />
            </div>
          </div>
          <CareerTimeline />
          <Hobbies />
          <MusicLibrary />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default About;
