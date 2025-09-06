import React, { useState } from 'react';
import './Events.css';

// --- Mock Data for Events ---
const eventsData = [
  {
    id: 1,
    type: 'Hackathon',
    name: 'MEDHA 2025 - Medical Device Hackathon',
    location: 'GHRCE, Nagpur',
    date: 'Sept 19-20, 2025',
    image: 'https://placehold.co/600x400/5227FF/FFFFFF?text=Med-Tech',
    description: 'A premier hackathon focused on creating innovative solutions for the healthcare industry. Participants will tackle real-world challenges in medical technology under the mentorship of experts from BETiC IIT Bombay.',
    registerLink: 'https://unstop.com/p/medha-2025-medical-device-hackathon-gh-raisoni-college-of-engineering-nagpur-12345'
  },
  {
    id: 2,
    type: 'National Hackathon',
    name: 'India Open Hackathon 2025',
    location: 'Hybrid (Online & IIT Bombay)',
    date: 'Sept 18-26, 2025',
    image: 'https://placehold.co/600x400/7cff67/000000?text=Open+Hack',
    description: 'A multi-day, intensive event to help developers optimize and accelerate their HPC & AI applications using cutting-edge technologies, with mentorship from NVIDIA and C-DAC experts.',
    registerLink: 'https://www.openhackathons.org/s/siteevent/a0CUP00001FSe3d2AD/se000392'
  },
  {
    id: 3,
    type: 'Conference',
    name: 'Nasscom Design & Engineering Summit',
    location: 'Bangalore',
    date: 'Sept 11, 2025',
    image: 'https://placehold.co/600x400/FF5733/FFFFFF?text=Nasscom+Summit',
    description: 'The 17th edition of this premier summit brings together global leaders to discuss the future of intelligent systems, AI integration, and engineering R&D. A must-attend for tech leaders and innovators.',
    registerLink: 'https://nasscom.in/events/nasscom-design-engineering-summit-2025'
  },
  {
    id: 4,
    type: 'Tech Expo',
    name: 'TECHSPO Delhi NCR 2025',
    location: 'Westin Gurgaon, Delhi NCR',
    date: 'Sept 24-25, 2025',
    image: 'https://placehold.co/600x400/FFC300/000000?text=TECHSPO',
    description: 'An expo showcasing the next generation of technology & innovation, including Internet, Mobile, AdTech, MarTech & SaaS Technology. Connect with developers, brands, and marketers.',
    registerLink: 'https://techspodelhi.in/'
  }
];

// --- Sub-component for the Details Modal ---
const EventModal = ({ event, onClose }) => (
  <>
    <div className="modal-overlay" onClick={onClose}></div>
    <div className="event-details-modal">
      <button className="close-btn" onClick={onClose}>✖</button>
      <img src={event.image} alt={`${event.name}`} className="modal-event-image" />
      <div className="modal-content">
        <span className="modal-event-type">{event.type}</span>
        <h2 className="modal-event-name">{event.name}</h2>
        <p className="modal-event-meta">{event.location} | {event.date}</p>
        <p className="modal-event-description">{event.description}</p>
        <a href={event.registerLink} target="_blank" rel="noopener noreferrer" className="register-btn">
          Register Now
        </a>
      </div>
    </div>
  </>
);

// --- Sub-component for an Event Card ---
const EventCard = ({ event, onCardClick }) => (
  <div className="event-card" onClick={() => onCardClick(event)}>
    <img src={event.image} alt={event.name} className="event-image" />
    <div className="event-overlay">
      <div>
        <span className="event-type">{event.type}</span>
        <h3 className="event-name">{event.name}</h3>
      </div>
      <p className="event-location">{event.location}</p>
    </div>
  </div>
);

// --- Main Events Component ---
function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="events-page-container">
      <div className="section-header">
        <h2 className="events-page-title">Discover Tech Events</h2>
        <p className="events-page-subtitle">
          Your gateway to the most exciting hackathons, conferences, and tech talks.
        </p>
      </div>

      <div className="events-grid">
        {eventsData.map((event) => (
          <EventCard key={event.id} event={event} onCardClick={setSelectedEvent} />
        ))}
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}

export default Events;
