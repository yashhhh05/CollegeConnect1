import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/login";
import Profile from "./components/Profile";
import Teams from "./components/Teams";
import Events from "./components/Events";
import Aurora from "./components/Aurora";
import HomePage from "./components/HomePage";
import Forums from "./components/Forums";
import UserSearch from "./components/UserSearch";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import Projects from "./components/Projects";
import { PostsProvider } from "./contexts/PostsContext";
import { TeamsProvider } from "./contexts/TeamsContext";
import { initialEventsData, initialTeamsData } from "./mockData"; 
import { EventsProvider } from "./contexts/EventsContext";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  
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
        <Navbar />
        <main className="flex-grow-1 container mt-4 ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/*  PASS DATA AND FUNCTIONS DOWN AS PROPS */}
            <Route path="/events" element={<Events eventsData={events} addEvent={addEvent} />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/search" element={<UserSearch />} />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/profile" /> : <Login />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <EventsProvider>
          <ProjectsProvider>
            <TeamsProvider>
              <AppContent />
            </TeamsProvider>
          </ProjectsProvider>
        </EventsProvider>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;

