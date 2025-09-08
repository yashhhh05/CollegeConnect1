import React, { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';
import './Events.css';
import './Model.css';

// Event Modal Component
const EventModal = ({ event, onClose, onRSVP }) => (
  <>
    <div className="modal-overlay" onClick={onClose}></div>
    <div className="event-details-modal">
      <button className="close-btn" onClick={onClose}>✖</button>
      <img src={event.image || 'https://via.placeholder.com/600x300'} alt={event.name} className="modal-event-image" />
      <div className="modal-content">
        <span className="modal-event-type">{event.type}</span>
        <h2 className="modal-event-name">{event.name}</h2>
        <p className="modal-event-meta">{event.location?.venue || event.location?.city} | {new Date(event.startDate).toLocaleDateString()}</p>
        <p className="modal-event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-row">
            <strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}
          </div>
          <div className="detail-row">
            <strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}
          </div>
          <div className="detail-row">
            <strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}
          </div>
          <div className="detail-row">
            <strong>Location:</strong> {event.location?.venue || 'Online'}
          </div>
          <div className="detail-row">
            <strong>Participants:</strong> {event.registration?.currentParticipants || 0} / {event.registration?.maxParticipants || 'Unlimited'}
          </div>
        </div>

        {event.speakers && event.speakers.length > 0 && (
          <div className="speakers-section">
            <h3>Speakers</h3>
            {event.speakers.map((speaker, index) => (
              <div key={index} className="speaker-card">
                <img src={speaker.image || 'https://via.placeholder.com/60'} alt={speaker.name} />
                <div>
                  <h4>{speaker.name}</h4>
                  <p>{speaker.title} at {speaker.company}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="register-btn" onClick={() => onRSVP(event._id)}>
            RSVP Now
          </button>
          {event.registration?.registrationLink && (
            <a href={event.registration.registrationLink} target="_blank" rel="noopener noreferrer" className="external-link-btn">
              External Registration
            </a>
          )}
        </div>
      </div>
    </div>
  </>
);

// Create Event Modal Component
const CreateEventModal = ({ onClose, createEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'hackathon',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: {
      type: 'offline',
      venue: '',
      city: '',
      address: ''
    },
    registration: {
      isRequired: true,
      isFree: true,
      maxParticipants: '',
      requirements: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationKey]: value }
      }));
    } else if (name.startsWith('registration.')) {
      const regKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        registration: { ...prev.registration, [regKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      onClose();
    } catch (error) {
      alert('Failed to create event: ' + error.message);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-modal-content">
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Event Name" 
            required 
          />
          
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="hackathon">Hackathon</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="tech-talk">Tech Talk</option>
            <option value="competition">Competition</option>
            <option value="meetup">Meetup</option>
          </select>

          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Event Description" 
            rows="4"
            required 
          />

          <div className="form-row">
            <input 
              name="startDate" 
              type="datetime-local"
              value={formData.startDate} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="endDate" 
              type="datetime-local"
              value={formData.endDate} 
              onChange={handleChange} 
              required 
            />
          </div>

          <input 
            name="registrationDeadline" 
            type="datetime-local"
            value={formData.registrationDeadline} 
            onChange={handleChange} 
            required 
          />

          <select name="location.type" value={formData.location.type} onChange={handleChange}>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {formData.location.type !== 'online' && (
            <>
              <input 
                name="location.venue" 
                value={formData.location.venue} 
                onChange={handleChange} 
                placeholder="Venue Name" 
              />
              <input 
                name="location.city" 
                value={formData.location.city} 
                onChange={handleChange} 
                placeholder="City" 
              />
              <input 
                name="location.address" 
                value={formData.location.address} 
                onChange={handleChange} 
                placeholder="Full Address" 
              />
            </>
          )}

          <div className="form-row">
            <input 
              name="registration.maxParticipants" 
              type="number"
              value={formData.registration.maxParticipants} 
              onChange={handleChange} 
              placeholder="Max Participants" 
            />
            <label>
              <input 
                name="registration.isFree" 
                type="checkbox"
                checked={formData.registration.isFree} 
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  registration: { ...prev.registration, isFree: e.target.checked }
                }))} 
              />
              Free Event
            </label>
          </div>

          <button type="submit" className="submit-btn">Create Event</button>
        </form>
      </div>
    </>
  );
};

// Event Card Component
const EventCard = ({ event, onCardClick, onRSVP }) => (
  <div className="event-card" onClick={() => onCardClick(event)}>
    <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.name} className="event-image" />
    <div className="event-overlay">
      <div>
        <span className="event-type">{event.type}</span>
        <h3 className="event-name">{event.name}</h3>
        <p className="event-date">{new Date(event.startDate).toLocaleDateString()}</p>
      </div>
      <p className="event-location">{event.location?.venue || event.location?.city || 'Online'}</p>
      <div className="event-stats">
        <span>👥 {event.registration?.currentParticipants || 0} participants</span>
        <button 
          className="rsvp-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRSVP(event._id);
          }}
        >
          RSVP
        </button>
      </div>
    </div>
  </div>
);

// Main Events Component
function Events() {
  const { events, loading, createEvent, rsvpEvent } = useEvents();
  const { isAuthenticated } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const handleRSVP = async (eventId) => {
    try {
      await rsvpEvent(eventId);
      alert('Successfully RSVPed to the event!');
    } catch (error) {
      alert('Failed to RSVP: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-page-container">
      <div className="section-header">
        <h2 className="events-page-title">Discover Tech Events</h2>
        <p className="events-page-subtitle">
          Your gateway to the most exciting hackathons, conferences, and tech talks.
        </p>
        
        <div className="events-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button 
              className={filter === 'hackathon' ? 'active' : ''} 
              onClick={() => setFilter('hackathon')}
            >
              Hackathons
            </button>
            <button 
              className={filter === 'conference' ? 'active' : ''} 
              onClick={() => setFilter('conference')}
            >
              Conferences
            </button>
            <button 
              className={filter === 'workshop' ? 'active' : ''} 
              onClick={() => setFilter('workshop')}
            >
              Workshops
            </button>
          </div>
          
          {isAuthenticated && (
            <button className="create-new-btn" onClick={() => setCreateOpen(true)}>
              + Create Event
            </button>
          )}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard 
            key={event._id} 
            event={event} 
            onCardClick={setSelectedEvent}
            onRSVP={handleRSVP}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onRSVP={handleRSVP}
        />
      )}
      
      {isCreateOpen && (
        <CreateEventModal 
          createEvent={createEvent} 
          onClose={() => setCreateOpen(false)} 
        />
      )}
    </div>
  );
}

export default Events;