import React, { useState } from 'react';
import './Teams.css';
import "./Model.css";
// --- Sub-component for the "Create Team" Form ---
const CreateTeamModal = ({ onClose, addTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    eventName: '',
    description: ''
  });
  const [skills, setSkills] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeam = {
      id: Date.now(), // Use timestamp for a simple unique ID
      members: ['https://placehold.co/60x60/random/FFFFFF?text=YOU'], // The creator is the first member
      lookingFor: skills.split(',').map(skill => skill.trim()).filter(skill => skill), // Split skills by comma and remove empty strings
      ...formData
    };
    addTeam(newTeam); // This function comes from App.js and updates the central state
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-modal-content">
        <h2>Create a New Team</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Team Name" required />
          <input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="For which event? (e.g., CodeStorm Hackathon)" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe your team's goal" required />
          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills needed (e.g., React Dev, UI/UX, Python)" required />
          <button type="submit" className="submit-btn">Create Team</button>
        </form>
      </div>
    </>
  );
};


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
function Teams({ teamsData, addTeam }) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  
  return (
    <div className="teams-container">
      <div className="section-header">
        <h2 className="teams-title">Find Your Team</h2>
        <p className="teams-subtitle">
          Collaborate with talented individuals and build something amazing together.
        </p>
        <button className="create-new-btn" onClick={() => setCreateOpen(true)}>+ Create Team</button>
      </div>

      <div className="teams-grid">
        {teamsData.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      
      {isCreateOpen && <CreateTeamModal addTeam={addTeam} onClose={() => setCreateOpen(false)} />}
    </div>
  );
}

export default Teams;

