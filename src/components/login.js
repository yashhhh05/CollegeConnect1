// src/components/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    course: "",
    year: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          course: formData.course,
          year: formData.year,
        };
        
        await register(userData);
        navigate("/profile");
      } else {
        const credentials = {
          email: formData.email,
          password: formData.password,
        };
        
        await login(credentials);
        navigate("/profile");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? "Create Account" : "Log In"}</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <label htmlFor="name">📛 Full Name</label>
            <input 
              id="name" 
              type="text" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
            <label htmlFor="college">🏫 College</label>
            <input 
              id="college" 
              type="text" 
              value={formData.college} 
              onChange={handleInputChange} 
              required 
            />
            <label htmlFor="course">📚 Course</label>
            <input 
              id="course" 
              type="text" 
              value={formData.course} 
              onChange={handleInputChange} 
            />
            <label htmlFor="year">📅 Year</label>
            <input 
              id="year" 
              type="text" 
              value={formData.year} 
              onChange={handleInputChange} 
            />
          </>
        )}

        <label htmlFor="email">📧 Email</label>
        <input 
          id="email" 
          type="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
        />

        <label htmlFor="password">🔒 Password</label>
        <input 
          id="password" 
          type={showPassword ? "text" : "password"} 
          value={formData.password} 
          onChange={handleInputChange} 
          required 
        />

        {isSignup && (
          <>
            <label htmlFor="confirmPassword">✅ Confirm Password</label>
            <input 
              id="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              required 
            />
          </>
        )}

        <div className="show-password-container">
          <input 
            id="showpass" 
            type="checkbox" 
            checked={showPassword} 
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label htmlFor="showpass">Show password</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : (isSignup ? "Sign Up" : "Log In")}
        </button>
      </form>

      <p className="toggle-auth-text">
        {isSignup ? "Already have an account?" : "New user?"}{" "}
        <span className="auth-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Log In" : "Create Account"}
        </span>
      </p>
    </div>
  );
}

export default Login;