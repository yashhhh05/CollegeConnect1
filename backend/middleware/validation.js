const { body, param, query } = require('express-validator');

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('college')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('College name must be between 2 and 100 characters'),
  
  body('course')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Course name cannot exceed 100 characters'),
  
  body('year')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Year cannot exceed 20 characters'),
  
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin'])
    .withMessage('Role must be student, faculty, or admin')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('College name must be between 2 and 100 characters'),
  
  body('course')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Course name cannot exceed 100 characters'),
  
  body('year')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Year cannot exceed 20 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array')
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Post validation
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  body('category')
    .isIn(['tech', 'design', 'business', 'placement-prep', 'hackathons', 'projects', 'general', 'announcements', 'questions', 'resources'])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'college-only', 'private'])
    .withMessage('Visibility must be public, college-only, or private')
];

// Comment validation
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  body('post')
    .isMongoId()
    .withMessage('Invalid post ID'),
  
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID')
];

// Event validation
const validateEvent = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Event name must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('type')
    .isIn(['hackathon', 'conference', 'workshop', 'tech-talk', 'competition', 'meetup', 'webinar', 'seminar', 'training', 'other'])
    .withMessage('Invalid event type'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('registrationDeadline')
    .isISO8601()
    .withMessage('Registration deadline must be a valid date')
];

// Project validation
const validateProject = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Project title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('type')
    .isIn(['web-development', 'mobile-app', 'ai-ml', 'data-science', 'iot', 'blockchain', 'game-development', 'design', 'research', 'startup', 'open-source', 'other'])
    .withMessage('Invalid project type'),
  
  body('domain')
    .isIn(['education', 'healthcare', 'finance', 'e-commerce', 'social-media', 'productivity', 'entertainment', 'gaming', 'sustainability', 'agriculture', 'transportation', 'other'])
    .withMessage('Invalid project domain'),
  
  body('teamSize.required')
    .isInt({ min: 1, max: 20 })
    .withMessage('Required team size must be between 1 and 20'),
  
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required')
];

// Team validation
const validateTeam = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('event')
    .isMongoId()
    .withMessage('Invalid event ID'),
  
  body('teamSize.required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Required team size must be between 1 and 10'),
  
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required')
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`)
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validatePost,
  validateComment,
  validateEvent,
  validateProject,
  validateTeam,
  validateObjectId,
  validatePagination
};
