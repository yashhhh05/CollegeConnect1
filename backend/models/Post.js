const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Category and Tags
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'tech',
      'design',
      'business',
      'placement-prep',
      'hackathons',
      'projects',
      'general',
      'announcements',
      'questions',
      'resources'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Engagement Metrics
  upvotes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  downvotes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  
  // Post Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'deleted'],
    default: 'published'
  },
  
  // Visibility
  visibility: {
    type: String,
    enum: ['public', 'college-only', 'private'],
    default: 'public'
  },
  
  // Featured/Sticky Posts
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  
  // Post Type
  postType: {
    type: String,
    enum: ['discussion', 'question', 'announcement', 'resource', 'project-showcase'],
    default: 'discussion'
  },
  
  // Question-specific fields
  isQuestion: {
    type: Boolean,
    default: false
  },
  acceptedAnswer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  uniqueViews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Moderation
  reportedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  moderationReason: String
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'upvotes': 1 });
postSchema.index({ title: 'text', content: 'text' });

// Virtual for vote count
postSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for popularity score
postSchema.virtual('popularityScore').get(function() {
  const voteWeight = this.upvotes.length - this.downvotes.length;
  const commentWeight = this.commentsCount * 2;
  const viewWeight = this.views * 0.1;
  const timeWeight = Math.max(0, 7 - (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  
  return voteWeight + commentWeight + viewWeight + timeWeight;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update comment count
postSchema.pre('save', function(next) {
  this.commentsCount = this.comments.length;
  next();
});

// Static method to get popular posts
postSchema.statics.getPopularPosts = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .populate('author', 'name profileImage college')
    .populate('comments', 'content author createdAt');
};

// Static method to search posts
postSchema.statics.searchPosts = function(query, options = {}) {
  const { category, tags, author, limit = 20, skip = 0 } = options;
  
  let searchQuery = {
    status: 'published',
    $text: { $search: query }
  };
  
  if (category) searchQuery.category = category;
  if (tags && tags.length > 0) searchQuery.tags = { $in: tags };
  if (author) searchQuery.author = author;
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip)
    .populate('author', 'name profileImage college')
    .populate('comments', 'content author createdAt');
};

module.exports = mongoose.model('Post', postSchema);
