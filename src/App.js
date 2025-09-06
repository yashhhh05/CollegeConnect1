import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Import All Page Components ---
// NOTE: EventsSection is removed and HomePage is added.
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/login"; // Consider renaming login.js to Login.js for consistency
import Profile from "./components/Profile";
import Teams from "./components/Teams"; 
import Events from "./components/Events";
import Aurora from "./components/Aurora";
import HomePage from "./components/HomePage"; // ✨ IMPORT THE NEW HOMEPAGE COMPONENT

// --- Main App Component ---
function App() {
  // Central state to manage login status.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Central state for user profile data.
  const [userProfile, setUserProfile] = useState({
    college: "Modern College of Engineering",
    course: "Computer Science",
    year: "3rd Year",
    skills: "React, Node.js, AI/ML",
    bio: "Passionate developer creating solutions for the future.",
    projects: "CollegeConnect Platform",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* ✨ Aurora is now the permanent background for the entire site */}
        <Aurora /> 
        
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="flex-grow-1 container mt-4">
          <Routes>
            {/* ✨ USE THE NEW HOMEPAGE COMPONENT FOR THE ROOT PATH */}
            <Route path="/" element={<HomePage />} />

            {/* --- Other Application Routes --- */}
            <Route path="/events" element={<Events />} />
            <Route path="/teams" element={<Teams />} />

            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/profile" /> : <Login setIsLoggedIn={setIsLoggedIn} />
              }
            />

            {/* Protected Profile Route */}
            <Route
              path="/profile"
              element={
                isLoggedIn ? (
                  <Profile userProfile={userProfile} setUserProfile={setUserProfile} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;

