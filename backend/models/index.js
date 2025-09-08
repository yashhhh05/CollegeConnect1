// Export all models from a single file for easier imports
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Event = require('./Event');
const Project = require('./Project');
const Team = require('./Team');
const Notification = require('./Notification');

module.exports = {
  User,
  Post,
  Comment,
  Event,
  Project,
  Team,
  Notification
};
