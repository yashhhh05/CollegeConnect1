const { Post, Comment, User } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'published' };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags.map(tag => tag.trim().toLowerCase()) };
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Search posts
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'popular') {
      sort = { 'upvotes': -1, 'commentsCount': -1 };
    } else if (req.query.sortBy === 'trending') {
      sort = { 'popularityScore': -1 };
    }

    const posts = await Post.find(query)
      .populate('author', 'name profileImage college')
      .populate('comments', 'content author createdAt')
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profileImage college')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profileImage college'
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const postData = {
      ...req.body,
      author: req.user.id
    };

    const post = await Post.create(postData);

    // Populate author information
    await post.populate('author', 'name profileImage college');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during post creation'
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name profileImage college');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during post update'
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Soft delete - change status to deleted
    post.status = 'deleted';
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during post deletion'
    });
  }
};

// @desc    Upvote post
// @route   POST /api/posts/:id/upvote
// @access  Private
const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already upvoted
    const existingUpvote = post.upvotes.find(
      upvote => upvote.user.toString() === req.user.id
    );

    if (existingUpvote) {
      return res.status(400).json({
        success: false,
        message: 'You have already upvoted this post'
      });
    }

    // Check if user downvoted and remove it
    post.downvotes = post.downvotes.filter(
      downvote => downvote.user.toString() !== req.user.id
    );

    // Add upvote
    post.upvotes.push({ user: req.user.id });
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post upvoted successfully',
      data: {
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
        voteCount: post.upvotes.length - post.downvotes.length
      }
    });
  } catch (error) {
    console.error('Upvote post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upvote'
    });
  }
};

// @desc    Downvote post
// @route   POST /api/posts/:id/downvote
// @access  Private
const downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already downvoted
    const existingDownvote = post.downvotes.find(
      downvote => downvote.user.toString() === req.user.id
    );

    if (existingDownvote) {
      return res.status(400).json({
        success: false,
        message: 'You have already downvoted this post'
      });
    }

    // Check if user upvoted and remove it
    post.upvotes = post.upvotes.filter(
      upvote => upvote.user.toString() !== req.user.id
    );

    // Add downvote
    post.downvotes.push({ user: req.user.id });
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post downvoted successfully',
      data: {
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
        voteCount: post.upvotes.length - post.downvotes.length
      }
    });
  } catch (error) {
    console.error('Downvote post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during downvote'
    });
  }
};

// @desc    Remove vote from post
// @route   DELETE /api/posts/:id/vote
// @access  Private
const removeVote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Remove upvote if exists
    post.upvotes = post.upvotes.filter(
      upvote => upvote.user.toString() !== req.user.id
    );

    // Remove downvote if exists
    post.downvotes = post.downvotes.filter(
      downvote => downvote.user.toString() !== req.user.id
    );

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
        voteCount: post.upvotes.length - post.downvotes.length
      }
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vote removal'
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  removeVote
};
