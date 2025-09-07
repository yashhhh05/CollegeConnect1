// src/components/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    loginId: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert("Account created successfully! Please log in.");
      setIsSignup(false);
    } else {
      setIsLoggedIn(true);
      navigate("/profile");
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? "Create Account" : "Log In"}</h2>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <label htmlFor="fullName">📛 Full Name</label>
            <input id="fullName" type="text" value={formData.fullName} onChange={handleInputChange} required />
            <label htmlFor="email">📧 Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </>
        )}

        {!isSignup && (
          <>
            <label htmlFor="loginId">👤 Username or Email</label>
            <input id="loginId" type="text" value={formData.loginId} onChange={handleInputChange} required />
          </>
        )}

        <label htmlFor="password">🔒 Password</label>
        <input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} required />

        {isSignup && (
          <>
            <label htmlFor="confirmPassword">✅ Confirm Password</label>
            <input id="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} required />
          </>
        )}

        <div className="show-password-container">
          <input id="showpass" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
          <label htmlFor="showpass">Show password</label>
        </div>

        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
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