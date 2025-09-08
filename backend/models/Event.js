const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide event name'],
    trim: true,
    maxlength: [200, 'Event name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  
  // Event Type
  type: {
    type: String,
    required: [true, 'Please select event type'],
    enum: [
      'hackathon',
      'conference',
      'workshop',
      'tech-talk',
      'competition',
      'meetup',
      'webinar',
      'seminar',
      'training',
      'other'
    ]
  },
  
  // Organizer Information
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  organizerType: {
    type: String,
    enum: ['individual', 'club', 'college', 'company'],
    default: 'individual'
  },
  
  // Event Details
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please provide registration deadline']
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline'
    },
    venue: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    onlineLink: String,
    meetingId: String,
    password: String
  },
  
  // Event Status
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Registration
  registration: {
    isRequired: {
      type: Boolean,
      default: true
    },
    isFree: {
      type: Boolean,
      default: true
    },
    fee: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    maxParticipants: Number,
    currentParticipants: {
      type: Number,
      default: 0
    },
    registrationLink: String,
    requirements: [String]
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'attended', 'cancelled'],
      default: 'registered'
    },
    teamId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team'
    }
  }],
  
  // Event Content
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String
  }],
  speakers: [{
    name: String,
    title: String,
    company: String,
    bio: String,
    image: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze']
    }
  }],
  
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
  
  // Tags and Categories
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  categories: [{
    type: String,
    enum: [
      'programming',
      'design',
      'business',
      'ai-ml',
      'web-development',
      'mobile-development',
      'data-science',
      'cybersecurity',
      'blockchain',
      'iot',
      'robotics',
      'other'
    ]
  }],
  
  // Prizes and Rewards
  prizes: [{
    position: String,
    title: String,
    description: String,
    value: String
  }],
  
  // Resources
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'download']
    }
  }],
  
  // Social Media
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
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
eventSchema.index({ organizer: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ categories: 1 });
eventSchema.index({ name: 'text', description: 'text' });

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  if (now < this.registrationDeadline) {
    return 'open';
  } else if (now >= this.startDate && now <= this.endDate) {
    return 'ongoing';
  } else if (now > this.endDate) {
    return 'closed';
  }
  return 'closed';
});

// Virtual for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  if (this.registration.maxParticipants) {
    return Math.max(0, this.registration.maxParticipants - this.registration.currentParticipants);
  }
  return null;
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update participant count
eventSchema.pre('save', function(next) {
  this.registration.currentParticipants = this.participants.length;
  next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(limit = 20, skip = 0) {
  return this.find({
    status: 'published',
    startDate: { $gte: new Date() }
  })
    .sort({ startDate: 1 })
    .limit(limit)
    .skip(skip)
    .populate('organizer', 'name profileImage college')
    .populate('participants.user', 'name profileImage');
};

// Static method to get events by location
eventSchema.statics.getEventsByLocation = function(city, limit = 20) {
  return this.find({
    status: 'published',
    'location.city': new RegExp(city, 'i')
  })
    .sort({ startDate: 1 })
    .limit(limit)
    .populate('organizer', 'name profileImage college');
};

// Static method to search events
eventSchema.statics.searchEvents = function(query, options = {}) {
  const { type, category, city, limit = 20, skip = 0 } = options;
  
  let searchQuery = {
    status: 'published',
    $text: { $search: query }
  };
  
  if (type) searchQuery.type = type;
  if (category) searchQuery.categories = category;
  if (city) searchQuery['location.city'] = new RegExp(city, 'i');
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip)
    .populate('organizer', 'name profileImage college');
};

module.exports = mongoose.model('Event', eventSchema);
