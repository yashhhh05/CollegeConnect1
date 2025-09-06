// src/components/Navbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import pfp from "./pfpp.webp"; // Make sure this path is correct

// Receives props from App.js; does NOT have its own state.
function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsLoggedIn(false);
      navigate("/"); // Redirect to home on logout
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          CollegeConnect
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Your Nav Links */}
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/teams">Teams</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/forums">Forums</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {/* This is the critical part that uses the prop from App.js */}
            {isLoggedIn ? (
              <>
                <li className="nav-item me-3">
                  <Link to="/profile" title="View Profile">
                    <img src={pfp} alt="Profile" className="rounded-circle" style={{ width: "40px", height: "40px", objectFit: "cover" }}/>
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">Login / Sign Up</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;