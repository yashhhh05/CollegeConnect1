import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getEvents(params);
      setEvents(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await apiService.createEvent(eventData);
      setEvents(prev => [response.data, ...prev]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const rsvpEvent = async (eventId) => {
    try {
      const response = await apiService.rsvpEvent(eventId);
      setEvents(prev => prev.map(event => 
        event._id === eventId 
          ? { ...event, participants: response.data.participants }
          : event
      ));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    rsvpEvent,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};