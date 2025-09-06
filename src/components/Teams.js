import React from 'react';

import "./Teams.css";
const findTeamsData = [
  {
    id: 1,
    name: 'Code Wizards',
    eventName: 'for CodeStorm Hackathon',
    description: 'Aiming to build a revolutionary project management tool with AI integration. We need creative minds who are passionate about clean code.',
    lookingFor: ['React Dev', 'UI/UX Designer', 'Python Dev'],
    members: [
      'https://placehold.co/60x60/7cff67/000000?text=YD',
      'https://placehold.co/60x60/5227FF/FFFFFF?text=JD',
    ],
  },
  {
    id: 2,
    name: 'AI Innovators',
    eventName: 'for AI Innovation Sprint',
    description: 'We are developing a machine learning model to predict stock market trends. Looking for data enthusiasts and backend experts.',
    lookingFor: ['Data Scientist', 'Node.js Dev'],
    members: [
      'https://placehold.co/60x60/FF5733/FFFFFF?text=AS',
      'https://placehold.co/60x60/C70039/FFFFFF?text=EW',
      'https://placehold.co/60x60/DAF7A6/000000?text=MJ',
    ],
  },
  {
    id: 3,
    name: 'Web Warriors',
    eventName: 'for Web Dev Challenge',
    description: 'Focused on creating a highly interactive and visually stunning e-commerce website with a seamless user experience.',
    lookingFor: ['Frontend Dev', 'UX Researcher'],
    members: [
      'https://placehold.co/60x60/FFC300/000000?text=LS',
    ],
  },
    {
    id: 4,
    name: 'Robo Squad',
    eventName: 'for Robotics HackFest',
    description: 'Building a prototype for an autonomous delivery robot. We need hardware enthusiasts and C++ programmers.',
    lookingFor: ['Robotics Eng.', 'C++ Dev', 'CAD Designer'],
    members: [
      'https://placehold.co/60x60/900C3F/FFFFFF?text=KB',
      'https://placehold.co/60x60/33FF57/000000?text=RT',
    ],
  },
];

// --- Sub-components for better structure ---
const SkillTag = ({ skill }) => <span className="skill-tag">{skill}</span>;

const TeamCard = ({ team }) => (
  <div className="find-team-card">
    <div>
      <h3 className="team-name">{team.name}</h3>
      <p className="team-event-name">{team.eventName}</p>
      <p className="team-description">{team.description}</p>
      
      <div className="skills-section">
        <h4 className="looking-for-title">Looking for:</h4>
        <div className="skills-container">
          {team.lookingFor.map(skill => <SkillTag key={skill} skill={skill} />)}
        </div>
      </div>
      
      <div className="members-section">
        <h4 className="current-members-title">Current Members:</h4>
        <div className="members-avatars">
          {team.members.map((avatar, index) => (
            <img key={index} src={avatar} alt={`Team member ${index + 1}`} className="member-avatar" />
          ))}
        </div>
      </div>
    </div>
    <button className="join-team-btn">Request to Join</button>
  </div>
);


// --- Main Teams Component ---
function Teams() {
  return (
    <div className="teams-container">
      <div className="section-header">
        <h2 className="teams-title">Find Your Team</h2>
        <p className="teams-subtitle">
          Collaborate with talented individuals and build something amazing together.
        </p>
      </div>

      <div className="teams-grid">
        {findTeamsData.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

export default Teams;

