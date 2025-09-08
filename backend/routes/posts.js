const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  removeVote
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const {
  validatePost,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', validatePagination, getPosts);

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', validateObjectId('id'), getPost);

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', protect, validatePost, createPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', protect, validateObjectId('id'), validatePost, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', protect, validateObjectId('id'), deletePost);

// @route   POST /api/posts/:id/upvote
// @desc    Upvote post
// @access  Private
router.post('/:id/upvote', protect, validateObjectId('id'), upvotePost);

// @route   POST /api/posts/:id/downvote
// @desc    Downvote post
// @access  Private
router.post('/:id/downvote', protect, validateObjectId('id'), downvotePost);

// @route   DELETE /api/posts/:id/vote
// @desc    Remove vote from post
// @access  Private
router.delete('/:id/vote', protect, validateObjectId('id'), removeVote);

module.exports = router;
