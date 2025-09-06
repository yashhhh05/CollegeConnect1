import React, { useState } from "react";
import "./EventsSection.css";

// Example dummy events data (replace with your own)
const eventsData = [
  {
    id: 1,
    title: "AI Hackathon",
    description: "Build innovative AI-powered apps in 48 hours!",
    date: "Sept 15, 2025",
    location: "Online",
  },
  {
    id: 2,
    title: "Web Dev Challenge",
    description: "Create a responsive full-stack app in 3 days.",
    date: "Oct 5, 2025",
    location: "New York, USA",
  },
];

// ✅ Event Modal (defined inside same file)
function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>

        <button className="btn btn-danger mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section className="events-section">
      <div className="section-header">
        <h2 className="events-title">Featured Hackathons</h2>
        <p className="events-subtitle">
          Explore exciting hackathons and coding competitions
        </p>
      </div>

      <div className="events-grid">
        {eventsData.map((event) => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => setSelectedEvent(event)}
          >
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}

export default EventsSection;
