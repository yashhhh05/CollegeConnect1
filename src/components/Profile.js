// src/components/Profile.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    course: "",
    year: "",
    bio: "",
    skills: [],
    interests: [],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: ""
    }
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        course: user.course || "",
        year: user.year || "",
        bio: user.bio || "",
        skills: user.skills || [],
        interests: user.interests || [],
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          portfolio: user.socialLinks?.portfolio || "",
          twitter: user.socialLinks?.twitter || ""
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else if (name === 'skills' || name === 'interests') {
      // Handle comma-separated values
      const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({ ...prev, [name]: arrayValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Update Your Profile</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        
        <label>College / University</label>
        <input 
          type="text" 
          name="college" 
          value={formData.college} 
          onChange={handleChange} 
          required 
        />
        
        <label>Course / Branch</label>
        <input 
          type="text" 
          name="course" 
          value={formData.course} 
          onChange={handleChange} 
        />
        
        <label>Year / Semester</label>
        <input 
          type="text" 
          name="year" 
          value={formData.year} 
          onChange={handleChange} 
        />
        
        <label>Skills (comma-separated)</label>
        <input 
          type="text" 
          name="skills" 
          value={formData.skills.join(', ')} 
          onChange={handleChange} 
          placeholder="JavaScript, React, Node.js"
        />
        
        <label>Interests (comma-separated)</label>
        <input 
          type="text" 
          name="interests" 
          value={formData.interests.join(', ')} 
          onChange={handleChange} 
          placeholder="Web Development, AI, Design"
        />
        
        <label>Bio / About Me</label>
        <textarea 
          name="bio" 
          value={formData.bio} 
          onChange={handleChange} 
          rows="4"
          placeholder="Tell us about yourself..."
        />
        
        <h3>Social Links</h3>
        
        <label>LinkedIn</label>
        <input 
          type="url" 
          name="socialLinks.linkedin" 
          value={formData.socialLinks.linkedin} 
          onChange={handleChange} 
          placeholder="https://linkedin.com/in/yourname"
        />
        
        <label>GitHub</label>
        <input 
          type="url" 
          name="socialLinks.github" 
          value={formData.socialLinks.github} 
          onChange={handleChange} 
          placeholder="https://github.com/yourname"
        />
        
        <label>Portfolio Website</label>
        <input 
          type="url" 
          name="socialLinks.portfolio" 
          value={formData.socialLinks.portfolio} 
          onChange={handleChange} 
          placeholder="https://yourname.com"
        />
        
        <label>Twitter</label>
        <input 
          type="url" 
          name="socialLinks.twitter" 
          value={formData.socialLinks.twitter} 
          onChange={handleChange} 
          placeholder="https://twitter.com/yourname"
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;