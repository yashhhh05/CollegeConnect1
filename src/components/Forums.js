import React, { useState } from 'react';
import { usePosts } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';
import './Forums.css';

const Forums = () => {
  const { posts, loading, createPost, upvotePost } = usePosts();
  const { isAuthenticated } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim())
      });
      setNewPost({ title: '', content: '', category: 'general', tags: '' });
      setShowCreateForm(false);
    } catch (error) {
      alert('Failed to create post: ' + error.message);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
    } catch (error) {
      alert('Failed to upvote: ' + error.message);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="forums-container">
      <div className="forums-header">
        <h2>Community Forums</h2>
        {isAuthenticated && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Post'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="create-post-form">
          <h3>Create New Post</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              required
            />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({...newPost, category: e.target.value})}
            >
              <option value="general">General</option>
              <option value="tech">Tech</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="placement-prep">Placement Prep</option>
              <option value="hackathons">Hackathons</option>
            </select>
            <textarea
              placeholder="Post Content"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows="5"
              required
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
            />
            <button type="submit">Create Post</button>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <h3>{post.title}</h3>
              <span className="post-category">{post.category}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-meta">
              <span>By {post.author?.name}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <div className="post-actions">
                <button 
                  className="upvote-btn"
                  onClick={() => handleUpvote(post._id)}
                  disabled={!isAuthenticated}
                >
                  👍 {post.upvotes?.length || 0}
                </button>
                <span>Comments: {post.commentsCount || 0}</span>
              </div>
            </div>
            {post.tags && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forums;