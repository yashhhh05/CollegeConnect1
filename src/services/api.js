// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication API calls
  async register(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Users API calls
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async searchUsersBySkills(skills) {
    return this.request(`/users/search/skills?skills=${skills}`);
  }

  async getUsersByCollege(college) {
    return this.request(`/users/college/${college}`);
  }

  // Posts API calls
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  async getPostById(postId) {
    return this.request(`/posts/${postId}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async upvotePost(postId) {
    return this.request(`/posts/${postId}/upvote`, {
      method: 'POST',
    });
  }

  async downvotePost(postId) {
    return this.request(`/posts/${postId}/downvote`, {
      method: 'POST',
    });
  }

  async removeVote(postId) {
    return this.request(`/posts/${postId}/vote`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

// Events API calls
async getEvents(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/events${queryString ? `?${queryString}` : ''}`);
}

async getEventById(eventId) {
  return this.request(`/events/${eventId}`);
}

async createEvent(eventData) {
  return this.request('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

async updateEvent(eventId, eventData) {
  return this.request(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

async deleteEvent(eventId) {
  return this.request(`/events/${eventId}`, {
    method: 'DELETE',
  });
}

async rsvpEvent(eventId) {
  return this.request(`/events/${eventId}/rsvp`, {
    method: 'POST',
  });
}
// Add these methods to your ApiService class

// Projects API calls
async getProjects(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/projects${queryString ? `?${queryString}` : ''}`);
}

async getProjectById(projectId) {
  return this.request(`/projects/${projectId}`);
}

async createProject(projectData) {
  return this.request('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}

async updateProject(projectId, projectData) {
  return this.request(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

async deleteProject(projectId) {
  return this.request(`/projects/${projectId}`, {
    method: 'DELETE',
  });
}

async joinProject(projectId, joinData) {
  return this.request(`/projects/${projectId}/join`, {
    method: 'POST',
    body: JSON.stringify(joinData),
  });
}

async respondToJoinRequest(projectId, requestId, response) {
  return this.request(`/projects/${projectId}/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(response),
  });
}
async getTeams(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return this.request(`/teams${queryString ? `?${queryString}` : ''}`);
}

async getTeamById(teamId) {
  return this.request(`/teams/${teamId}`);
}

async createTeam(teamData) {
  return this.request('/teams', {
    method: 'POST',
    body: JSON.stringify(teamData),
  });
}

async updateTeam(teamId, teamData) {
  return this.request(`/teams/${teamId}`, {
    method: 'PUT',
    body: JSON.stringify(teamData),
  });
}

async deleteTeam(teamId) {
  return this.request(`/teams/${teamId}`, {
    method: 'DELETE',
  });
}

async joinTeam(teamId, joinData) {
  return this.request(`/teams/${teamId}/join`, {
    method: 'POST',
    body: JSON.stringify(joinData),
  });
}

async respondToTeamJoinRequest(teamId, requestId, response) {
  return this.request(`/teams/${teamId}/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(response),
  });
}
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
