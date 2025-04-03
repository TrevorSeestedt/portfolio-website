import React from 'react';
import '../css/CareerTimeline.css';

const CareerTimeline = () => {
  const careerData = [
    {
      company: "University of South Carolina, Columbia",
      years: "2021 - 2025",
      title: "B.S. in Computer Science",
      experience: ["Receiving my degree in May"],
      color: "#73000A",
      borderColor: "#8b000c",
      darkBorderColor: "#5a0008"
    },
    {
      company: "FINTRX",
      years: "2024-2024",
      title: "Data Operations Intern",
      experience: ["Gathered and performed operations on large datasets"],
      color: "#224edf",
      borderColor: "#2b5fe3",
      darkBorderColor: "#1b3eb3"
    },
    {
      company: "PCS",
      years: "2023-2023",
      title: "IT Technician Intern",
      experience: ["Resolved lots of problems for people over the phone"],
      color: "#fea30b",
      borderColor: "#ffb52e",
      darkBorderColor: "#cc8209"
    }
  ];

  return (
    <div className="career-timeline-section">
      <h2 className="career-timeline-title">Career Timeline</h2>
      <div className="career-timeline">
        {careerData.map((career, index) => (
          <div key={index} className="career-item">
            <div className="career-item-content">
              <div className="career-header">
                <div className="career-title-section">
                  <h3 className="company-name">{career.company}</h3>
                  <p className="job-title">{career.title}</p>
                </div>
                <div className="career-years">
                  <p>{career.years}</p>
                </div>
              </div>
              <ul className="experience-list">
                {career.experience.map((exp, expIndex) => (
                  <li key={expIndex}>{exp}</li>
                ))}
              </ul>
            </div>
            <div 
              className="timeline-marker"
              style={{
                backgroundColor: career.color,
                borderColor: career.borderColor
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerTimeline; 