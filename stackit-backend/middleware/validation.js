const { body, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  register: [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  
  question: [
    body('title')
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters')
      .trim(),
    body('description')
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters long'),
    body('tags')
      .isArray({ min: 1, max: 5 })
      .withMessage('Please provide 1-5 tags')
      .custom((tags) => {
        if (tags.some(tag => tag.length < 2 || tag.length > 20)) {
          throw new Error('Each tag must be between 2 and 20 characters');
        }
        return true;
      })
  ],
  
  answer: [
    body('content')
      .isLength({ min: 10 })
      .withMessage('Answer must be at least 10 characters long')
  ],
  
  comment: [
    body('content')
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters')
      .trim()
  ]
};

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validationRules,
  handleValidationErrors
};
