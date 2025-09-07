import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/login";
import Profile from "./components/Profile";
import Teams from "./components/Teams";
import Events from "./components/Events";
import Aurora from "./components/Aurora";
import HomePage from "./components/HomePage";
import { initialEventsData, initialTeamsData } from "./mockData"; // ✨ IMPORT MOCK DATA

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    // ... user profile data
  });

  // ✨ STATE FOR EVENTS AND TEAMS IS NOW CENTRALIZED HERE
  const [events, setEvents] = useState(initialEventsData);
  const [teams, setTeams] = useState(initialTeamsData);

  // ✨ FUNCTIONS TO ADD NEW DATA
  const addEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
  };

  const addTeam = (newTeam) => {
    setTeams([newTeam, ...teams]);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Aurora />
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex-grow-1 container mt-4 ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* ✨ PASS DATA AND FUNCTIONS DOWN AS PROPS */}
            <Route path="/events" element={<Events eventsData={events} addEvent={addEvent} />} />
            <Route path="/teams" element={<Teams teamsData={teams} addTeam={addTeam} />} />

            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/profile" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile userProfile={userProfile} setUserProfile={setUserProfile} /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

