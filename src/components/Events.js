import React, { useState } from 'react';
import './Events.css';
import "./Model.css";
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
        <a href={event.registerLink || '#'} target="_blank" rel="noopener noreferrer" className="register-btn">
          Register Now
        </a>
      </div>
    </div>
  </>
);

// --- Sub-component for the "Create Event" Form ---
const CreateEventModal = ({ onClose, addEvent }) => {
  const [formData, setFormData] = useState({
    name: '', location: '', date: '', description: '', type: 'Hackathon'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(), // Use timestamp for a simple unique ID
      image: `https://placehold.co/600x400/random/FFFFFF?text=${formData.name.substring(0, 10).replace(' ', '+')}`,
      ...formData
    };
    addEvent(newEvent); // This function comes from App.js
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-modal-content">
        <h2>Create a New Event</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., Nagpur)" required />
          <input name="date" value={formData.date} onChange={handleChange} placeholder="Date (e.g., Oct 1-3, 2025)" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Specific Requirement(s)" required />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option>Hackathon</option>
            <option>Conference</option>
            <option>Workshop</option>
            <option>Tech Talk</option>
          </select>
          <button type="submit" className="submit-btn">Add Event</button>
        </form>
      </div>
    </>
  );
};

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
function Events({ eventsData, addEvent }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <div className="events-page-container">
      <div className="section-header">
        <h2 className="events-page-title">Discover Tech Events</h2>
        <p className="events-page-subtitle">
          Your gateway to the most exciting hackathons, conferences, and tech talks.
        </p>
        <button className="create-new-btn" onClick={() => setCreateOpen(true)}>+ Create Event</button>
      </div>

      <div className="events-grid">
        {eventsData.map((event) => (
          <EventCard key={event.id} event={event} onCardClick={setSelectedEvent} />
        ))}
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {isCreateOpen && <CreateEventModal addEvent={addEvent} onClose={() => setCreateOpen(false)} />}
    </div>
  );
}

export default Events;

