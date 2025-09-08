const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide project title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide project description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  
  // Project Owner
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Project Status
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled'],
    default: 'planning'
  },
  
  // Project Type
  type: {
    type: String,
    required: [true, 'Please select project type'],
    enum: [
      'web-development',
      'mobile-app',
      'ai-ml',
      'data-science',
      'iot',
      'blockchain',
      'game-development',
      'design',
      'research',
      'startup',
      'open-source',
      'other'
    ]
  },
  
  // Project Details
  domain: {
    type: String,
    required: [true, 'Please specify project domain'],
    enum: [
      'education',
      'healthcare',
      'finance',
      'e-commerce',
      'social-media',
      'productivity',
      'entertainment',
      'gaming',
      'sustainability',
      'agriculture',
      'transportation',
      'other'
    ]
  },
  
  // Team Information
  teamSize: {
    current: {
      type: Number,
      default: 1
    },
    required: {
      type: Number,
      required: [true, 'Please specify required team size']
    }
  },
  
  // Required Skills
  requiredSkills: [{
    skill: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  
  // Team Members
  members: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      required: true
    },
    skills: [String],
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'left'],
      default: 'active'
    }
  }],
  
  // Join Requests
  joinRequests: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    message: String,
    skills: [String],
    experience: String,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    respondedAt: Date,
    responseMessage: String
  }],
  
  // Project Timeline
  timeline: {
    startDate: Date,
    expectedEndDate: Date,
    actualEndDate: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }]
  },
  
  // Project Resources
  resources: {
    budget: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      },
      source: String
    },
    tools: [String],
    technologies: [String],
    platforms: [String]
  },
  
  // Project Links
  links: {
    repository: String,
    website: String,
    demo: String,
    documentation: String,
    design: String
  },
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    title: String,
    description: String
  }],
  
  // Tags
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Collaboration
  collaboration: {
    isOpen: {
      type: Boolean,
      default: true
    },
    maxMembers: Number,
    allowExternalMembers: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    }
  },
  
  // Project Visibility
  visibility: {
    type: String,
    enum: ['public', 'college-only', 'private'],
    default: 'public'
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  bookmarks: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    bookmarkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Project Updates
  updates: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      filename: String,
      url: String,
      type: String
    }]
  }],
  
  // Awards and Recognition
  awards: [{
    name: String,
    description: String,
    receivedAt: Date,
    event: String
  }],
  
  // Moderation
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ type: 1 });
projectSchema.index({ domain: 1 });
projectSchema.index({ 'requiredSkills.skill': 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// Virtual for available spots
projectSchema.virtual('availableSpots').get(function() {
  const currentMembers = this.members.filter(member => member.status === 'active').length;
  return Math.max(0, this.teamSize.required - currentMembers);
});

// Virtual for progress percentage
projectSchema.virtual('progress').get(function() {
  if (this.timeline.milestones.length === 0) return 0;
  const completedMilestones = this.timeline.milestones.filter(milestone => milestone.completed).length;
  return Math.round((completedMilestones / this.timeline.milestones.length) * 100);
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update team size
projectSchema.pre('save', function(next) {
  this.teamSize.current = this.members.filter(member => member.status === 'active').length;
  next();
});

// Static method to get projects by skill
projectSchema.statics.getProjectsBySkill = function(skill, limit = 20) {
  return this.find({
    status: { $in: ['planning', 'active'] },
    visibility: 'public',
    'requiredSkills.skill': new RegExp(skill, 'i')
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('owner', 'name profileImage college')
    .populate('members.user', 'name profileImage');
};

// Static method to get projects by type
projectSchema.statics.getProjectsByType = function(type, limit = 20) {
  return this.find({
    type: type,
    status: { $in: ['planning', 'active'] },
    visibility: 'public'
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('owner', 'name profileImage college')
    .populate('members.user', 'name profileImage');
};

// Static method to search projects
projectSchema.statics.searchProjects = function(query, options = {}) {
  const { type, domain, skill, limit = 20, skip = 0 } = options;
  
  let searchQuery = {
    status: { $in: ['planning', 'active'] },
    visibility: 'public',
    $text: { $search: query }
  };
  
  if (type) searchQuery.type = type;
  if (domain) searchQuery.domain = domain;
  if (skill) searchQuery['requiredSkills.skill'] = new RegExp(skill, 'i');
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip)
    .populate('owner', 'name profileImage college')
    .populate('members.user', 'name profileImage');
};

module.exports = mongoose.model('Project', projectSchema);
