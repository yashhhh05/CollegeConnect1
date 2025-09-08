import React, { useState } from 'react';
import { useProjects } from '../contexts/ProjectsContext';
import { useAuth } from '../contexts/AuthContext';
import './Projects.css';
import './Model.css';

// Project Modal Component
const ProjectModal = ({ project, onClose, onJoin }) => (
  <>
    <div className="modal-overlay" onClick={onClose}></div>
    <div className="project-details-modal">
      <button className="close-btn" onClick={onClose}>✖</button>
      <div className="modal-content">
        <div className="project-header">
          <span className="project-type">{project.type}</span>
          <h2 className="project-title">{project.title}</h2>
          <p className="project-domain">Domain: {project.domain}</p>
        </div>
        
        <div className="project-description">
          <h3>Description</h3>
          <p>{project.description}</p>
        </div>

        <div className="project-details">
          <div className="detail-section">
            <h3>Team Information</h3>
            <p><strong>Current Members:</strong> {project.teamSize?.current || 0}</p>
            <p><strong>Required Members:</strong> {project.teamSize?.required || 0}</p>
            <p><strong>Available Spots:</strong> {project.availableSpots || 0}</p>
          </div>

          <div className="detail-section">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {project.requiredSkills?.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.skill} ({skill.level})
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Current Team Members</h3>
            <div className="team-members">
              {project.members?.map((member, index) => (
                <div key={index} className="member-card">
                  <img 
                    src={member.user?.profileImage || 'https://via.placeholder.com/40'} 
                    alt={member.user?.name}
                    className="member-avatar"
                  />
                  <div>
                    <h4>{member.user?.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {project.timeline && (
            <div className="detail-section">
              <h3>Project Timeline</h3>
              <p><strong>Start Date:</strong> {new Date(project.timeline.startDate).toLocaleDateString()}</p>
              <p><strong>Expected End:</strong> {new Date(project.timeline.expectedEndDate).toLocaleDateString()}</p>
              <p><strong>Progress:</strong> {project.progress || 0}%</p>
            </div>
          )}

          {project.links && (
            <div className="detail-section">
              <h3>Project Links</h3>
              {project.links.repository && (
                <a href={project.links.repository} target="_blank" rel="noopener noreferrer">
                  📁 Repository
                </a>
              )}
              {project.links.website && (
                <a href={project.links.website} target="_blank" rel="noopener noreferrer">
                  🌐 Website
                </a>
              )}
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  🎮 Demo
                </a>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="join-btn" onClick={() => onJoin(project._id)}>
            Request to Join
          </button>
        </div>
      </div>
    </div>
  </>
);

// Join Request Modal
const JoinRequestModal = ({ project, onClose, onJoin }) => {
  const [joinData, setJoinData] = useState({
    message: '',
    skills: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(project._id, joinData);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="join-request-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-content">
          <h2>Request to Join "{project.title}"</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Why do you want to join this project?"
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

// Create Project Modal
const CreateProjectModal = ({ onClose, createProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'web-development',
    domain: 'education',
    teamSize: {
      required: 3
    },
    requiredSkills: [
      { skill: '', level: 'intermediate', isRequired: true }
    ],
    timeline: {
      startDate: '',
      expectedEndDate: ''
    },
    links: {
      repository: '',
      website: '',
      demo: ''
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
    } else if (name.startsWith('timeline.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        timeline: { ...prev.timeline, [key]: value }
      }));
    } else if (name.startsWith('links.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        links: { ...prev.links, [key]: value }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData);
      onClose();
    } catch (error) {
      alert('Failed to create project: ' + error.message);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-project-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-content">
          <h2>Create New Project</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              required
            />

            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="web-development">Web Development</option>
              <option value="mobile-app">Mobile App</option>
              <option value="ai-ml">AI/ML</option>
              <option value="data-science">Data Science</option>
              <option value="iot">IoT</option>
              <option value="blockchain">Blockchain</option>
              <option value="game-development">Game Development</option>
              <option value="design">Design</option>
              <option value="research">Research</option>
              <option value="startup">Startup</option>
              <option value="open-source">Open Source</option>
            </select>

            <select name="domain" value={formData.domain} onChange={handleChange}>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="e-commerce">E-commerce</option>
              <option value="social-media">Social Media</option>
              <option value="productivity">Productivity</option>
              <option value="entertainment">Entertainment</option>
              <option value="gaming">Gaming</option>
              <option value="sustainability">Sustainability</option>
              <option value="agriculture">Agriculture</option>
              <option value="transportation">Transportation</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project Description"
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
                min="1"
                max="20"
                required
              />
              <input
                name="timeline.startDate"
                type="date"
                value={formData.timeline.startDate}
                onChange={handleChange}
                required
              />
              <input
                name="timeline.expectedEndDate"
                type="date"
                value={formData.timeline.expectedEndDate}
                onChange={handleChange}
                required
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
                    <option value="expert">Expert</option>
                  </select>
                  <button type="button" onClick={() => removeSkill(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addSkill} className="add-skill-btn">
                + Add Skill
              </button>
            </div>

            <div className="links-section">
              <h3>Project Links (Optional)</h3>
              <input
                name="links.repository"
                value={formData.links.repository}
                onChange={handleChange}
                placeholder="Repository URL"
              />
              <input
                name="links.website"
                value={formData.links.website}
                onChange={handleChange}
                placeholder="Website URL"
              />
              <input
                name="links.demo"
                value={formData.links.demo}
                onChange={handleChange}
                placeholder="Demo URL"
              />
            </div>

            <button type="submit" className="submit-btn">Create Project</button>
          </form>
        </div>
      </div>
    </>
  );
};

// Project Card Component
const ProjectCard = ({ project, onCardClick, onJoin }) => (
  <div className="project-card" onClick={() => onCardClick(project)}>
    <div className="project-header">
      <span className="project-type">{project.type}</span>
      <span className="project-domain">{project.domain}</span>
    </div>
    
    <h3 className="project-title">{project.title}</h3>
    <p className="project-description">{project.description.substring(0, 150)}...</p>
    
    <div className="project-meta">
      <div className="team-info">
        <span>👥 {project.teamSize?.current || 0}/{project.teamSize?.required || 0} members</span>
        <span>📅 {new Date(project.timeline?.startDate).toLocaleDateString()}</span>
      </div>
      
      <div className="skills-preview">
        {project.requiredSkills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-tag">{skill.skill}</span>
        ))}
        {project.requiredSkills?.length > 3 && (
          <span className="more-skills">+{project.requiredSkills.length - 3} more</span>
        )}
      </div>
    </div>

    <div className="project-actions">
      <button 
        className="join-btn"
        onClick={(e) => {
          e.stopPropagation();
          onJoin(project);
        }}
      >
        Request to Join
      </button>
    </div>
  </div>
);

// Main Projects Component
function Projects() {
  const { projects, loading, createProject, joinProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);
  const [joinProjectData, setJoinProjectData] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.type === filter;
  });

  const handleJoin = (project) => {
    setJoinProjectData(project);
    setJoinOpen(true);
  };

  const handleJoinSubmit = async (projectId, joinData) => {
    try {
      await joinProject(projectId, joinData);
      alert('Join request sent successfully!');
    } catch (error) {
      alert('Failed to send join request: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-container">
      <div className="section-header">
        <h2 className="projects-title">Project Collaboration Board</h2>
        <p className="projects-subtitle">
          Find exciting projects to work on or post your own project idea and find teammates.
        </p>
        
        <div className="projects-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={filter === 'web-development' ? 'active' : ''} 
              onClick={() => setFilter('web-development')}
            >
              Web Dev
            </button>
            <button 
              className={filter === 'mobile-app' ? 'active' : ''} 
              onClick={() => setFilter('mobile-app')}
            >
              Mobile Apps
            </button>
            <button 
              className={filter === 'ai-ml' ? 'active' : ''} 
              onClick={() => setFilter('ai-ml')}
            >
              AI/ML
            </button>
            <button 
              className={filter === 'data-science' ? 'active' : ''} 
              onClick={() => setFilter('data-science')}
            >
              Data Science
            </button>
          </div>
          
          {isAuthenticated && (
            <button className="create-new-btn" onClick={() => setCreateOpen(true)}>
              + Create Project
            </button>
          )}
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            onCardClick={setSelectedProject}
            onJoin={handleJoin}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          onJoin={handleJoin}
        />
      )}
      
      {isCreateOpen && (
        <CreateProjectModal 
          createProject={createProject} 
          onClose={() => setCreateOpen(false)} 
        />
      )}

      {isJoinOpen && joinProjectData && (
        <JoinRequestModal 
          project={joinProjectData}
          onClose={() => {
            setJoinOpen(false);
            setJoinProjectData(null);
          }}
          onJoin={handleJoinSubmit}
        />
      )}
    </div>
  );
}

export default Projects;