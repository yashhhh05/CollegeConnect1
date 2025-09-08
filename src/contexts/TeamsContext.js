import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const TeamsContext = createContext();

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeams = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getTeams(params);
      setTeams(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData) => {
    try {
      const response = await apiService.createTeam(teamData);
      setTeams(prev => [response.data, ...prev]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const joinTeam = async (teamId, joinData) => {
    try {
      const response = await apiService.joinTeam(teamId, joinData);
      setTeams(prev => prev.map(team => 
        team._id === teamId 
          ? { ...team, joinRequests: response.data.joinRequests }
          : team
      ));
    } catch (error) {
      throw error;
    }
  };

  const respondToJoinRequest = async (teamId, requestId, response) => {
    try {
      const result = await apiService.respondToTeamJoinRequest(teamId, requestId, response);
      setTeams(prev => prev.map(team => 
        team._id === teamId ? result.data : team
      ));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const value = {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    joinTeam,
    respondToJoinRequest,
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
};
