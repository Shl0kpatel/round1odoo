const express = require('express');
const Tag = require('../models/Tag');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tags
// @desc    Get all tags
// @access  Public
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    const limit = parseInt(req.query.limit) || 50;
    
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const tags = await Tag.find(filter)
      .sort({ questionsCount: -1, name: 1 })
      .limit(limit);

    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tags/popular
// @desc    Get popular tags
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const tags = await Tag.find({ questionsCount: { $gt: 0 } })
      .sort({ questionsCount: -1 })
      .limit(limit);

    res.json({ tags });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tags
// @desc    Create a new tag (Admin only)
// @access  Private (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = new Tag({
      name: name.toLowerCase(),
      description,
      color
    });

    await tag.save();

    res.status(201).json({
      message: 'Tag created successfully',
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tags/:id
// @desc    Update a tag (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { description, color } = req.body;
    
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { description, color },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({
      message: 'Tag updated successfully',
      tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tags/:id
// @desc    Delete a tag (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    if (tag.questionsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete tag that is used in questions' 
      });
    }

    await Tag.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
