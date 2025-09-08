import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getProjects(params);
      setProjects(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await apiService.createProject(projectData);
      setProjects(prev => [response.data, ...prev]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const joinProject = async (projectId, joinData) => {
    try {
      const response = await apiService.joinProject(projectId, joinData);
      setProjects(prev => prev.map(project => 
        project._id === projectId 
          ? { ...project, joinRequests: response.data.joinRequests }
          : project
      ));
    } catch (error) {
      throw error;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await apiService.updateProject(projectId, projectData);
      setProjects(prev => prev.map(project => 
        project._id === projectId ? response.data : project
      ));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    joinProject,
    updateProject,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};