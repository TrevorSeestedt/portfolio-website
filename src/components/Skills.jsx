import React, { useState, useMemo, useCallback } from 'react';
import '../css/Skills.css';

const Skills = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);

  // Memoize skills data to prevent re-creation on each render
  const skills = useMemo(() => [
    {
      id: 'frontend',
      name: 'Frontend',
      description: 'Web development fundamentals and modern frameworks',
      technologies: [
        { 
          name: 'HTML & CSS', 
          color: '#E34F26', 
          year: '2021',
          description: 'Began in a University course called "Computing in the Modern World", refined through building websites and web applications.'
        },
        { 
          name: 'JavaScript', 
          color: '#F7DF1E', 
          year: '2022',
          description: 'Started with the fundamentals through tutorials and progressed to utilizing it in building interactive web apps.'
        },
        { 
          name: 'React', 
          color: '#61DAFB', 
          year: '2025',
          description: 'Learned from tutorials, then built a few projects, and now have this portfolio website!'
        }
      ]
    },
    {
      id: 'backend',
      name: 'Backend',
      description: 'Server-side programming and application development',
      technologies: [
        { 
          name: 'Python', 
          color: '#306998', 
          year: '2020',
          description: 'First learned Python early on in AP Computer Science during high school, now I use it almost every day.'
        },
        { 
          name: 'Java', 
          color: '#F89820', 
          year: '2021',
          description: 'Began learning the fundamentals in University courses called "Algorithmic Design I & II", to which I built a few projects.'
        },
        { 
          name: 'C++', 
          color: '#00599C', 
          year: '2022',
          description: 'Learned fundamentals in University course called "Advanced Programming Techniques".'
        },
        { 
          name: 'Django', 
          color: '#092E20', 
          year: '2024',
          description: 'Learned through hands-on building projects, currently using the framework for my University\'s "Capstone Project".'
        }
      ]
    },
    {
      id: 'database',
      name: 'Database & Mobile',
      description: 'Database systems and mobile application development',
      technologies: [
        { 
          name: 'PostgreSQL', 
          color: '#336791', 
          year: '2024',
          description: 'Learned through building and deploying database-driven applications, gained more experience with Django\'s ORM'
        },
        { 
          name: 'MySQL', 
          color: '#4479A1', 
          year: '2024',
          description: 'Learned fundamentals through University called "Database System Design", and hands-on experience through database design projects.'
        },
        { 
          name: 'Kotlin', 
          color: '#7F52FF', 
          year: '2025',
          description: 'Currently learning the fundamentals through Android Studio and University course called "Mobile Application Development".'
        }
      ]
    }
  ], []);

  // Optimize event handlers with useCallback
  const handleTechClick = useCallback((e, cardId, tech) => {
    e.stopPropagation();
    setSelectedTech(tech);
    setFlippedCard(cardId);
  }, []);

  const handleCardClick = useCallback((cardId) => {
    if (flippedCard === cardId) {
      setFlippedCard(null);
      setSelectedTech(null);
    }
  }, [flippedCard]);

  // Memoize the rendered skill cards 
  const skillCards = useMemo(() => {
    return skills.map((skill) => (
      <div 
        key={skill.id} 
        className={`skill-card ${flippedCard === skill.id ? 'flipped' : ''}`}
        onClick={() => handleCardClick(skill.id)}
        style={{ cursor: flippedCard === skill.id ? 'pointer' : 'default' }}
      >
        <div className="skill-card-front">
          <div className="skill-header">
            <h3>{skill.name}</h3>
            <p className="skill-description">{skill.description}</p>
          </div>
          <div className="tech-stack">
            {skill.technologies.map((tech, index) => (
              <div 
                key={index} 
                className="tech-tag-container"
                onClick={(e) => handleTechClick(e, skill.id, tech)}
                style={{ cursor: 'pointer' }}
              >
                <span 
                  className="tech-tag"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.name}
                </span>
                <div className="tech-tooltip">
                  <span className="tech-year">Learned in {tech.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="skill-card-back">
          {selectedTech && flippedCard === skill.id && (
            <>
              <h4>{selectedTech.name}</h4>
              <p>{selectedTech.description}</p>
              <div className="back-to-front">
                Tap to flip back
              </div>
            </>
          )}
        </div>
      </div>
    ));
  }, [skills, flippedCard, selectedTech, handleCardClick, handleTechClick]);

  return (
    <div className="skills-section">
      <h2 className="skills-title">Programming Languages</h2>
      <div className="skills-container">
        {skillCards}
      </div>
    </div>
  );
};

export default React.memo(Skills); 