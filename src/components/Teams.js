import React, { useState } from 'react';
import { useTeams } from '../contexts/TeamsContext';
import { useAuth } from '../contexts/AuthContext';
import './Teams.css';
import './Model.css';

// Team Modal Component
const TeamModal = ({ team, onClose, onJoin }) => (
  <>
    <div className="modal-overlay" onClick={onClose}></div>
    <div className="team-details-modal">
      <button className="close-btn" onClick={onClose}>✖</button>
      <div className="modal-content">
        <div className="team-header">
          <h2 className="team-name">{team.name}</h2>
          <p className="team-event">For: {team.event?.name}</p>
          <span className="team-status">{team.status}</span>
        </div>
        
        <div className="team-description">
          <h3>Team Description</h3>
          <p>{team.description}</p>
        </div>

        <div className="team-details">
          <div className="detail-section">
            <h3>Team Information</h3>
            <p><strong>Current Members:</strong> {team.teamSize?.current || 0}</p>
            <p><strong>Required Members:</strong> {team.teamSize?.required || 0}</p>
            <p><strong>Available Spots:</strong> {team.availableSpots || 0}</p>
            <p><strong>Team Leader:</strong> {team.leader?.name}</p>
          </div>

          <div className="detail-section">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {team.requiredSkills?.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.skill} ({skill.level})
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Current Team Members</h3>
            <div className="team-members">
              {team.members?.map((member, index) => (
                <div key={index} className="member-card">
                  <img 
                    src={member.user?.profileImage || 'https://via.placeholder.com/50'} 
                    alt={member.user?.name}
                    className="member-avatar"
                  />
                  <div>
                    <h4>{member.user?.name}</h4>
                    <p>{member.role}</p>
                    <div className="member-skills">
                      {member.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="mini-skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {team.project && (
            <div className="detail-section">
              <h3>Project Information</h3>
              <p><strong>Title:</strong> {team.project.title}</p>
              <p><strong>Description:</strong> {team.project.description}</p>
              {team.project.technologies && (
                <div className="tech-stack">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {team.project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {team.communication && (
            <div className="detail-section">
              <h3>Communication</h3>
              {team.communication.discord && (
                <p><strong>Discord:</strong> {team.communication.discord}</p>
              )}
              {team.communication.slack && (
                <p><strong>Slack:</strong> {team.communication.slack}</p>
              )}
              {team.communication.whatsapp && (
                <p><strong>WhatsApp:</strong> {team.communication.whatsapp}</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="join-btn" onClick={() => onJoin(team._id)}>
            Request to Join
          </button>
        </div>
      </div>
    </div>
  </>
);

// Join Request Modal
const JoinRequestModal = ({ team, onClose, onJoin }) => {
  const [joinData, setJoinData] = useState({
    message: '',
    skills: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(team._id, joinData);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="join-request-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-content">
          <h2>Request to Join "{team.name}"</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Why do you want to join this team?"
              value={joinData.message}
              onChange={(e) => setJoinData({...joinData, message: e.target.value})}
              rows="4"
              required
            />
            <input
              type="text"
              placeholder="Your relevant skills (comma-separated)"
              value={joinData.skills}
              onChange={(e) => setJoinData({...joinData, skills: e.target.value})}
              required
            />
            <textarea
              placeholder="Your experience with similar projects"
              value={joinData.experience}
              onChange={(e) => setJoinData({...joinData, experience: e.target.value})}
              rows="3"
            />
            <button type="submit" className="submit-btn">Send Request</button>
          </form>
        </div>
      </div>
    </>
  );
};

// Create Team Modal
const CreateTeamModal = ({ onClose, createTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event: '',
    teamSize: {
      required: 4
    },
    requiredSkills: [
      { skill: '', level: 'intermediate', isRequired: true }
    ],
    project: {
      title: '',
      description: '',
      technologies: []
    },
    communication: {
      discord: '',
      slack: '',
      whatsapp: ''
    },
    preferences: {
      meetingSchedule: '',
      timezone: '',
      communicationStyle: 'casual',
      workStyle: 'collaborative'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('teamSize.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        teamSize: { ...prev.teamSize, [key]: parseInt(value) }
      }));
    } else if (name.startsWith('project.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        project: { ...prev.project, [key]: value }
      }));
    } else if (name.startsWith('communication.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        communication: { ...prev.communication, [key]: value }
      }));
    } else if (name.startsWith('preferences.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, { skill: '', level: 'intermediate', isRequired: true }]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleTechChange = (e) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setFormData(prev => ({
      ...prev,
      project: { ...prev.project, technologies }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam(formData);
      onClose();
    } catch (error) {
      alert('Failed to create team: ' + error.message);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-team-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-content">
          <h2>Create New Team</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Team Name"
              required
            />

            <input
              name="event"
              value={formData.event}
              onChange={handleChange}
              placeholder="Event Name (e.g., CodeStorm Hackathon)"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Team Description"
              rows="4"
              required
            />

            <div className="form-row">
              <input
                name="teamSize.required"
                type="number"
                value={formData.teamSize.required}
                onChange={handleChange}
                placeholder="Required Team Size"
                min="2"
                max="10"
                required
              />
              <select name="preferences.timezone" value={formData.preferences.timezone} onChange={handleChange}>
                <option value="">Select Timezone</option>
                <option value="IST">IST (India)</option>
                <option value="EST">EST (US East)</option>
                <option value="PST">PST (US West)</option>
                <option value="GMT">GMT (UK)</option>
                <option value="CET">CET (Europe)</option>
              </select>
            </div>

            <div className="project-section">
              <h3>Project Information</h3>
              <input
                name="project.title"
                value={formData.project.title}
                onChange={handleChange}
                placeholder="Project Title"
              />
              <textarea
                name="project.description"
                value={formData.project.description}
                onChange={handleChange}
                placeholder="Project Description"
                rows="3"
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                onChange={handleTechChange}
              />
            </div>

            <div className="skills-section">
              <h3>Required Skills</h3>
              {formData.requiredSkills.map((skill, index) => (
                <div key={index} className="skill-input-row">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                    required
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button type="button" onClick={() => removeSkill(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addSkill} className="add-skill-btn">
                + Add Skill
              </button>
            </div>

            <div className="communication-section">
              <h3>Communication Channels</h3>
              <input
                name="communication.discord"
                value={formData.communication.discord}
                onChange={handleChange}
                placeholder="Discord Server Link"
              />
              <input
                name="communication.slack"
                value={formData.communication.slack}
                onChange={handleChange}
                placeholder="Slack Workspace"
              />
              <input
                name="communication.whatsapp"
                value={formData.communication.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp Group Link"
              />
            </div>

            <div className="preferences-section">
              <h3>Team Preferences</h3>
              <div className="form-row">
                <select name="preferences.communicationStyle" value={formData.preferences.communicationStyle} onChange={handleChange}>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="mixed">Mixed</option>
                </select>
                <select name="preferences.workStyle" value={formData.preferences.workStyle} onChange={handleChange}>
                  <option value="collaborative">Collaborative</option>
                  <option value="independent">Independent</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <input
                name="preferences.meetingSchedule"
                value={formData.preferences.meetingSchedule}
                onChange={handleChange}
                placeholder="Preferred meeting schedule (e.g., Weekends, Evenings)"
              />
            </div>

            <button type="submit" className="submit-btn">Create Team</button>
          </form>
        </div>
      </div>
    </>
  );
};

// Team Card Component
const TeamCard = ({ team, onCardClick, onJoin }) => (
  <div className="team-card" onClick={() => onCardClick(team)}>
    <div className="team-header">
      <h3 className="team-name">{team.name}</h3>
      <span className="team-status">{team.status}</span>
    </div>
    
    <p className="team-event">For: {team.event?.name || team.event}</p>
    <p className="team-description">{team.description.substring(0, 120)}...</p>
    
    <div className="team-meta">
      <div className="team-info">
        <span>👥 {team.teamSize?.current || 0}/{team.teamSize?.required || 0} members</span>
        <span>�� {team.leader?.name}</span>
      </div>
      
      <div className="skills-preview">
        {team.requiredSkills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-tag">{skill.skill}</span>
        ))}
        {team.requiredSkills?.length > 3 && (
          <span className="more-skills">+{team.requiredSkills.length - 3} more</span>
        )}
      </div>
    </div>

    <div className="team-actions">
      <button 
        className="join-btn"
        onClick={(e) => {
          e.stopPropagation();
          onJoin(team);
        }}
      >
        Request to Join
      </button>
    </div>
  </div>
);

// Main Teams Component
function Teams() {
  const { teams, loading, createTeam, joinTeam } = useTeams();
  const { isAuthenticated } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);
  const [joinTeamData, setJoinTeamData] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredTeams = teams.filter(team => {
    if (filter === 'all') return true;
    return team.status === filter;
  });

  const handleJoin = (team) => {
    setJoinTeamData(team);
    setJoinOpen(true);
  };

  const handleJoinSubmit = async (teamId, joinData) => {
    try {
      await joinTeam(teamId, joinData);
      alert('Join request sent successfully!');
    } catch (error) {
      alert('Failed to send join request: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading teams...</div>;

  return (
    <div className="teams-container">
      <div className="section-header">
        <h2 className="teams-title">Find Your Team</h2>
        <p className="teams-subtitle">
          Collaborate with talented individuals and build something amazing together.
        </p>
        
        <div className="teams-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All Teams
            </button>
            <button 
              className={filter === 'forming' ? 'active' : ''} 
              onClick={() => setFilter('forming')}
            >
              Forming
            </button>
            <button 
              className={filter === 'active' ? 'active' : ''} 
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''} 
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          {isAuthenticated && (
            <button className="create-new-btn" onClick={() => setCreateOpen(true)}>
              + Create Team
            </button>
          )}
        </div>
      </div>

      <div className="teams-grid">
        {filteredTeams.map((team) => (
          <TeamCard 
            key={team._id} 
            team={team} 
            onCardClick={setSelectedTeam}
            onJoin={handleJoin}
          />
        ))}
      </div>

      {selectedTeam && (
        <TeamModal 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)}
          onJoin={handleJoin}
        />
      )}
      
      {isCreateOpen && (
        <CreateTeamModal 
          createTeam={createTeam} 
          onClose={() => setCreateOpen(false)} 
        />
      )}

      {isJoinOpen && joinTeamData && (
        <JoinRequestModal 
          team={joinTeamData}
          onClose={() => {
            setJoinOpen(false);
            setJoinTeamData(null);
          }}
          onJoin={handleJoinSubmit}
        />
      )}
    </div>
  );
}

export default Teams;