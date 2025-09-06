import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // signup logic (API call normally)
      alert("Account created successfully! Please login.");
      setIsSignup(false);
    } else {
      // login logic
      setIsLoggedIn(true);
      navigate("/");
    }
  };

  return (
    <div className={`login-container ${isSignup ? "signup-mode" : ""}`}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <label htmlFor="fullname">📛 Full Name</label>
            <input
              id="fullname"
              type="text"
              placeholder="Your full name"
              required
            />

            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </>
        )}

        {!isSignup && (
          <>
            <label htmlFor="loginid">👤 Username or Email</label>
            <input
              id="loginid"
              type="text"
              placeholder="Enter username or email"
              required
            />
          </>
        )}

        <label htmlFor="password">🔒 Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          required
        />

        {isSignup && (
          <>
            <label htmlFor="confirmpassword">✅ Confirm Password</label>
            <input
              id="confirmpassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              required
            />
          </>
        )}

        <div className="showp">
          <input
            type="checkbox"
            id="showpass"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          <label htmlFor="showpass">Show password</label>
        </div>

        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>

      <p className="toggle-auth">
        {isSignup ? "Already have an account?" : "New user?"}{" "}
        <span
          className="auth-link"
          onClick={() => setIsSignup((prev) => !prev)}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}

export default Login;
