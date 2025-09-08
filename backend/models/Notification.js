const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Sender (optional - for user-to-user notifications)
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Notification Type
  type: {
    type: String,
    required: true,
    enum: [
      'post_comment',
      'post_upvote',
      'post_mention',
      'project_join_request',
      'project_request_accepted',
      'project_request_rejected',
      'event_reminder',
      'event_registration',
      'team_invitation',
      'team_join_request',
      'badge_earned',
      'achievement_unlocked',
      'system_announcement',
      'profile_view',
      'connection_request',
      'message_received',
      'project_update',
      'event_update',
      'moderation_action',
      'verification_status'
    ]
  },
  
  // Notification Content
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  
  // Related Entity
  relatedEntity: {
    type: {
      type: String,
      enum: ['post', 'comment', 'project', 'event', 'user', 'team', 'badge', 'system']
    },
    id: {
      type: mongoose.Schema.ObjectId
    }
  },
  
  // Notification Status
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Delivery Channels
  delivery: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery Status
  deliveryStatus: {
    inApp: {
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date
    },
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      opened: {
        type: Boolean,
        default: false
      },
      openedAt: Date
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date
    }
  },
  
  // Action Data
  actionData: {
    actionType: {
      type: String,
      enum: ['view', 'reply', 'accept', 'reject', 'dismiss', 'custom']
    },
    actionUrl: String,
    actionText: String,
    actionColor: String
  },
  
  // Metadata
  metadata: {
    source: String,
    category: String,
    tags: [String],
    customData: mongoose.Schema.Types.Mixed
  },
  
  // Expiration
  expiresAt: Date,
  
  // Read/Interaction Tracking
  readAt: Date,
  interactedAt: Date,
  interactionType: String
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ 'relatedEntity.type': 1, 'relatedEntity.id': 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for isExpired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Ensure virtual fields are serialized
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

// Pre-save middleware to set expiration
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set default expiration to 30 days
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const { 
    status = 'unread', 
    type, 
    limit = 20, 
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  let query = { recipient: userId };
  
  if (status !== 'all') {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }
  
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  return this.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('sender', 'name profileImage')
    .populate('relatedEntity.id');
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function(userId, notificationIds) {
  return this.updateMany(
    { 
      recipient: userId, 
      _id: { $in: notificationIds },
      status: 'unread'
    },
    { 
      status: 'read',
      readAt: new Date()
    }
  );
};

// Static method to get notification count
notificationSchema.statics.getNotificationCount = function(userId, status = 'unread') {
  return this.countDocuments({ recipient: userId, status });
};

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  return this.create(notificationData);
};

// Static method to create bulk notifications
notificationSchema.statics.createBulkNotifications = function(notifications) {
  return this.insertMany(notifications);
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Instance method to archive
notificationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
