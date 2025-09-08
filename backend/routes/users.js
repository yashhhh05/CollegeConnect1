const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsersBySkills,
  getUsersByCollege
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', validatePagination, getUsers);

// @route   GET /api/users/search/skills
// @desc    Search users by skills
// @access  Public
router.get('/search/skills', searchUsersBySkills);

// @route   GET /api/users/college/:college
// @desc    Get users by college
// @access  Public
router.get('/college/:college', validatePagination, getUsersByCollege);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Public
router.get('/:id', validateObjectId('id'), getUser);

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', validateObjectId('id'), getUserStats);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, validateObjectId('id'), validateProfileUpdate, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteUser);

module.exports = router;
