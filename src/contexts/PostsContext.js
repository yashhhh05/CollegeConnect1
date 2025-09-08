import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const PostsContext = createContext();

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getPosts(params);
      setPosts(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await apiService.createPost(postData);
      setPosts(prev => [response.data, ...prev]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upvotePost = async (postId) => {
    try {
      const response = await apiService.upvotePost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, upvotes: response.data.upvotes, downvotes: response.data.downvotes }
          : post
      ));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const value = {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    upvotePost,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};