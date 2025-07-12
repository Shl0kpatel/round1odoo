const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  color: {
    type: String,
    default: '#3B82F6' // blue-500
  },
  questionsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
tagSchema.index({ name: 'text' });

module.exports = mongoose.model('Tag', tagSchema);
