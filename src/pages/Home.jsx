import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import ContentWrapper from '../components/ContentWrapper';
import Skills from '../components/Skills';
import ResumePreview from '../components/ResumePreview';
import '../css/Home.css';

const Home = () => {
  return (
    <ContentWrapper>
      <div className="home page-content">
        <div className="welcome-container">
          <div className="welcome-text">
            <TypeAnimation
              sequence={['Welcome to my website']}
              wrapper="span"
              speed={25}
              cursor={false}
            />
          </div>
          <div className="welcome-blurb">
            Hello, my name's Trevor. I'm a senior at the University of South Carolina studying Computer Science graduating in May 2025. I'm passionate about developing innovative software solutions and am pursuing opportunities in data analytics or software engineering.
          </div>
        </div>
        <Skills />
        <ResumePreview />
        
      </div>
    </ContentWrapper>
  );
};

export default Home;
