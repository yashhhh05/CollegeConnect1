import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './UserSearch.css';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const searchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCollege) params.college = selectedCollege;
      if (selectedSkill) params.skills = selectedSkill;
      
      const response = await apiService.getUsers(params);
      setUsers(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers();
  }, []);

  return (
    <div className="user-search-container">
      <h2>Find Students</h2>
      
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by college"
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by skill"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        />
        <button onClick={searchUsers} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div key={user._id} className="user-card">
            <img 
              src={user.profileImage || 'https://via.placeholder.com/100'} 
              alt={user.name}
              className="user-avatar"
            />
            <h3>{user.name}</h3>
            <p className="user-college">{user.college}</p>
            <p className="user-course">{user.course}</p>
            {user.skills && user.skills.length > 0 && (
              <div className="user-skills">
                {user.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            )}
            <button className="connect-btn">Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;