import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
// --- SVG Icons for the cards (self-contained and styled with CSS) ---
const CalendarIcon = () => (
  <svg className="cta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
  </svg>
);

const GroupIcon = () => (
  <svg className="cta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);


// --- Main HomePage Component ---
function HomePage() {
  return (
    <div className="homepage-container">
      {/* --- The main welcome header --- */}
      <div className="section-header">
        <h1 className="homepage-title">Welcome to CollegeConnect</h1>
        <p className="homepage-subtitle">
          Your central hub for discovering tech events, joining innovative teams, and launching your career.
        </p>
      </div>

      {/* --- The interactive "Call to Action" cards --- */}
      <div className="cta-card-container">
        {/* Card linking to the Events page */}
        <Link to="/events" className="cta-card">
          <CalendarIcon />
          <h2 className="cta-title">Explore Events</h2>
          <p className="cta-description">
            Find the next big hackathon, conference, or tech talk.
          </p>
        </Link>

        {/* Card linking to the Teams page */}
        <Link to="/teams" className="cta-card">
          <GroupIcon />
          <h2 className="cta-title">Find a Team</h2>
          <p className="cta-description">
            Connect with peers and build your dream team for any event.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
