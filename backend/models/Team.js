const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide team name'],
    trim: true,
    maxlength: [100, 'Team name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide team description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  // Team Leader
  leader: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Related Event
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  
  // Team Status
  status: {
    type: String,
    enum: ['forming', 'active', 'completed', 'disbanded'],
    default: 'forming'
  },
  
  // Team Size
  teamSize: {
    current: {
      type: Number,
      default: 1
    },
    required: {
      type: Number,
      required: [true, 'Please specify required team size']
    },
    max: {
      type: Number,
      default: 5
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
      enum: ['beginner', 'intermediate', 'advanced'],
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
      enum: ['pending', 'active', 'inactive'],
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
  
  // Team Project
  project: {
    title: String,
    description: String,
    technologies: [String],
    repository: String,
    demo: String,
    presentation: String
  },
  
  // Team Performance
  performance: {
    score: Number,
    rank: Number,
    awards: [{
      name: String,
      description: String,
      receivedAt: Date
    }],
    feedback: String
  },
  
  // Team Communication
  communication: {
    discord: String,
    slack: String,
    whatsapp: String,
    other: String
  },
  
  // Team Preferences
  preferences: {
    meetingSchedule: String,
    timezone: String,
    communicationStyle: {
      type: String,
      enum: ['formal', 'casual', 'mixed'],
      default: 'casual'
    },
    workStyle: {
      type: String,
      enum: ['collaborative', 'independent', 'mixed'],
      default: 'collaborative'
    }
  },
  
  // Team Visibility
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  
  // Team Tags
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
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
  }]
}, {
  timestamps: true
});

// Indexes
teamSchema.index({ leader: 1 });
teamSchema.index({ event: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ 'requiredSkills.skill': 1 });
teamSchema.index({ tags: 1 });
teamSchema.index({ name: 'text', description: 'text' });

// Virtual for available spots
teamSchema.virtual('availableSpots').get(function() {
  const currentMembers = this.members.filter(member => member.status === 'active').length;
  return Math.max(0, this.teamSize.required - currentMembers);
});

// Virtual for team completion percentage
teamSchema.virtual('completionPercentage').get(function() {
  return Math.round((this.teamSize.current / this.teamSize.required) * 100);
});

// Ensure virtual fields are serialized
teamSchema.set('toJSON', { virtuals: true });
teamSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update team size
teamSchema.pre('save', function(next) {
  this.teamSize.current = this.members.filter(member => member.status === 'active').length;
  next();
});

// Static method to get teams by event
teamSchema.statics.getTeamsByEvent = function(eventId, options = {}) {
  const { status = 'active', limit = 20, skip = 0 } = options;
  
  return this.find({ event: eventId, status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('leader', 'name profileImage college')
    .populate('members.user', 'name profileImage')
    .populate('event', 'name startDate endDate');
};

// Static method to get teams by skill
teamSchema.statics.getTeamsBySkill = function(skill, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({
    status: 'forming',
    visibility: 'public',
    'requiredSkills.skill': new RegExp(skill, 'i')
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('leader', 'name profileImage college')
    .populate('members.user', 'name profileImage')
    .populate('event', 'name startDate endDate');
};

// Static method to search teams
teamSchema.statics.searchTeams = function(query, options = {}) {
  const { eventId, skill, limit = 20, skip = 0 } = options;
  
  let searchQuery = {
    status: 'forming',
    visibility: 'public',
    $text: { $search: query }
  };
  
  if (eventId) searchQuery.event = eventId;
  if (skill) searchQuery['requiredSkills.skill'] = new RegExp(skill, 'i');
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip)
    .populate('leader', 'name profileImage college')
    .populate('members.user', 'name profileImage')
    .populate('event', 'name startDate endDate');
};

// Instance method to add member
teamSchema.methods.addMember = function(userId, role, skills) {
  const member = {
    user: userId,
    role: role,
    skills: skills,
    joinedAt: new Date(),
    status: 'active'
  };
  
  this.members.push(member);
  return this.save();
};

// Instance method to remove member
teamSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

// Instance method to send join request
teamSchema.methods.sendJoinRequest = function(userId, message, skills, experience) {
  const request = {
    user: userId,
    message: message,
    skills: skills,
    experience: experience,
    requestedAt: new Date(),
    status: 'pending'
  };
  
  this.joinRequests.push(request);
  return this.save();
};

// Instance method to respond to join request
teamSchema.methods.respondToJoinRequest = function(requestId, status, responseMessage) {
  const request = this.joinRequests.id(requestId);
  if (request) {
    request.status = status;
    request.respondedAt = new Date();
    request.responseMessage = responseMessage;
    
    if (status === 'accepted') {
      this.addMember(request.user, 'Member', request.skills);
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('Team', teamSchema);
