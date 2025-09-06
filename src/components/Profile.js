// src/components/Profile.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Make sure this path is correct

// Receives the central userProfile state and the function to update it
function Profile({ userProfile, setUserProfile }) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h2>Update Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>College / University</label>
        <input type="text" name="college" value={userProfile.college} onChange={handleChange} />
        <label>Course / Branch</label>
        <input type="text" name="course" value={userProfile.course} onChange={handleChange} />
        <label>Year / Semester</label>
        <input type="text" name="year" value={userProfile.year} onChange={handleChange} />
        <label>Skills / Interests</label>
        <input type="text" name="skills" value={userProfile.skills} onChange={handleChange} />
        <label>Bio / About Me</label>
        <textarea name="bio" value={userProfile.bio} onChange={handleChange} />
        <label>Projects / Research Interests</label>
        <textarea name="projects" value={userProfile.projects} onChange={handleChange} />
        <label>LinkedIn</label>
        <input type="url" name="linkedin" value={userProfile.linkedin} onChange={handleChange} />
        <label>GitHub</label>
        <input type="url" name="github" value={userProfile.github} onChange={handleChange} />
        <label>Portfolio Website</label>
        <input type="url" name="portfolio" value={userProfile.portfolio} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;