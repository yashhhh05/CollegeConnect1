const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Content
  content: {
    type: String,
    required: [true, 'Please provide comment content'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  
  // Author
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Parent Post
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  
  // Reply to another comment (for nested comments)
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  // Nested replies
  replies: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }],
  repliesCount: {
    type: Number,
    default: 0
  },
  
  // Engagement
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
  
  // Status
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  },
  
  // Answer status (for Q&A posts)
  isAnswer: {
    type: Boolean,
    default: false
  },
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  },
  
  // Mentions
  mentions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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
  moderationReason: String,
  
  // Edit history
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  lastEditedAt: Date
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ status: 1 });

// Virtual for vote count
commentSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Ensure virtual fields are serialized
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update replies count
commentSchema.pre('save', function(next) {
  this.repliesCount = this.replies.length;
  next();
});

// Pre-save middleware to track edits
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.lastEditedAt = new Date();
    
    // Add to edit history
    this.editHistory.push({
      content: this.content,
      editedAt: new Date()
    });
  }
  next();
});

// Static method to get comments for a post
commentSchema.statics.getPostComments = function(postId, options = {}) {
  const { limit = 50, skip = 0, sortBy = 'createdAt', sortOrder = 'asc' } = options;
  
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  return this.find({ 
    post: postId, 
    status: 'active',
    parentComment: null // Only top-level comments
  })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('author', 'name profileImage college')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'name profileImage college'
      }
    });
};

// Static method to get comment replies
commentSchema.statics.getCommentReplies = function(commentId, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({ 
    parentComment: commentId, 
    status: 'active' 
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .skip(skip)
    .populate('author', 'name profileImage college');
};

module.exports = mongoose.model('Comment', commentSchema);
