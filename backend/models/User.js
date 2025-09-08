const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Role-based Access
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  
  // Academic Information
  college: {
    type: String,
    required: [true, 'Please provide your college name'],
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  
  // Profile Information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  
  // Social Links
  socialLinks: {
    linkedin: {
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/, 'Please provide a valid LinkedIn URL']
    },
    github: {
      type: String,
      match: [/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/, 'Please provide a valid GitHub URL']
    },
    portfolio: {
      type: String,
      match: [/^https?:\/\//, 'Please provide a valid portfolio URL']
    },
    twitter: {
      type: String,
      match: [/^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/, 'Please provide a valid Twitter URL']
    }
  },
  
  // Profile Image
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150x150/007bff/ffffff?text=Profile'
  },
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpire: Date,
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  stats: {
    postsCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    projectsCount: {
      type: Number,
      default: 0
    },
    eventsAttended: {
      type: Number,
      default: 0
    },
    reputation: {
      type: Number,
      default: 0
    }
  },
  
  // Badges and Achievements
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'college-only', 'private'],
      default: 'public'
    }
  },
  
  // Timestamps
  lastLogin: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date
}, {
  timestamps: true
});

// Index for better search performance
userSchema.index({ email: 1 });
userSchema.index({ college: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Update password changed timestamp
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) {
    next();
  }
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
