const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Notification = require('../models/Notification');
const { auth, optionalAuth, isOwnerOrAdmin } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Helper function to create notification
const createNotification = async (type, recipient, sender, message, relatedQuestion, relatedAnswer = null) => {
  if (recipient.toString() !== sender.toString()) {
    await Notification.create({
      type,
      recipient,
      sender,
      message,
      relatedQuestion,
      relatedAnswer
    });
  }
};

// @route   GET /api/questions
// @desc    Get all questions with pagination and filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || 'recent'; // recent, popular, votes
    const tag = req.query.tag;
    const search = req.query.search;

    // Build filter
    let filter = { isActive: true };
    
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { views: -1, createdAt: -1 };
        break;
      case 'votes':
        sort = { voteScore: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const questions = await Question.find(filter)
      .populate('author', 'username avatar reputation')
      .populate('acceptedAnswer')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Add answer count and vote status for authenticated users
    const questionsWithMetadata = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ 
          question: question._id, 
          isActive: true 
        });

        let userVote = null;
        if (req.user) {
          if (question.votes.upvotes.some(id => id.toString() === req.user._id.toString())) {
            userVote = 'up';
          } else if (question.votes.downvotes.some(id => id.toString() === req.user._id.toString())) {
            userVote = 'down';
          }
        }

        return {
          ...question,
          answerCount,
          userVote,
          isOwner: req.user ? question.author._id.toString() === req.user._id.toString() : false
        };
      })
    );

    const total = await Question.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      questions: questionsWithMetadata,
      pagination: {
        currentPage: page,
        totalPages,
        totalQuestions: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question with answers
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation')
      .populate('acceptedAnswer');

    if (!question || !question.isActive) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment views (only if not the author)
    if (!req.user || question.author._id.toString() !== req.user._id.toString()) {
      question.views += 1;
      await question.save();
    }

    // Get answers
    const answers = await Answer.find({ 
      question: req.params.id, 
      isActive: true 
    })
      .populate('author', 'username avatar reputation')
      .populate('comments.author', 'username avatar')
      .sort({ voteScore: -1, createdAt: 1 });

    // Add user vote status
    let questionUserVote = null;
    if (req.user) {
      if (question.votes.upvotes.some(id => id.toString() === req.user._id.toString())) {
        questionUserVote = 'up';
      } else if (question.votes.downvotes.some(id => id.toString() === req.user._id.toString())) {
        questionUserVote = 'down';
      }
    }

    const answersWithVotes = answers.map(answer => {
      let userVote = null;
      if (req.user) {
        if (answer.votes.upvotes.some(id => id.toString() === req.user._id.toString())) {
          userVote = 'up';
        } else if (answer.votes.downvotes.some(id => id.toString() === req.user._id.toString())) {
          userVote = 'down';
        }
      }
      
      return {
        ...answer.toObject(),
        userVote,
        isOwner: req.user ? answer.author._id.toString() === req.user._id.toString() : false
      };
    });

    res.json({
      question: {
        ...question.toObject(),
        userVote: questionUserVote,
        isOwner: req.user ? question.author._id.toString() === req.user._id.toString() : false
      },
      answers: answersWithVotes
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', auth, validationRules.question, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Create or update tags
    const tagPromises = tags.map(async (tagName) => {
      const normalizedTag = tagName.toLowerCase().trim();
      let tag = await Tag.findOne({ name: normalizedTag });
      
      if (!tag) {
        tag = await Tag.create({ name: normalizedTag });
      }
      
      tag.questionsCount += 1;
      await tag.save();
      
      return normalizedTag;
    });

    const processedTags = await Promise.all(tagPromises);

    const question = new Question({
      title,
      description,
      tags: processedTags,
      author: req.user._id
    });

    await question.save();
    await question.populate('author', 'username avatar reputation');

    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private (Owner or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question || !question.isActive) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check ownership or admin
    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, tags } = req.body;

    if (title) question.title = title;
    if (description) question.description = description;
    
    if (tags) {
      // Update tag counts
      const oldTags = question.tags;
      const newTags = tags.map(tag => tag.toLowerCase().trim());

      // Decrease count for removed tags
      for (const oldTag of oldTags) {
        if (!newTags.includes(oldTag)) {
          await Tag.findOneAndUpdate(
            { name: oldTag },
            { $inc: { questionsCount: -1 } }
          );
        }
      }

      // Increase count for new tags
      for (const newTag of newTags) {
        if (!oldTags.includes(newTag)) {
          let tag = await Tag.findOne({ name: newTag });
          if (!tag) {
            tag = await Tag.create({ name: newTag });
          } else {
            tag.questionsCount += 1;
            await tag.save();
          }
        }
      }

      question.tags = newTags;
    }

    await question.save();
    await question.populate('author', 'username avatar reputation');

    res.json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question (soft delete)
// @access  Private (Owner or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question || !question.isActive) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check ownership or admin
    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    question.isActive = false;
    await question.save();

    // Update tag counts
    for (const tagName of question.tags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { $inc: { questionsCount: -1 } }
      );
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/questions/:id/vote
// @desc    Vote on a question
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question || !question.isActive) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Can't vote on own question
    if (question.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot vote on your own question' });
    }

    const userId = req.user._id;
    const upvotes = question.votes.upvotes;
    const downvotes = question.votes.downvotes;

    // Remove previous votes
    const upvoteIndex = upvotes.indexOf(userId);
    const downvoteIndex = downvotes.indexOf(userId);
    
    if (upvoteIndex > -1) upvotes.splice(upvoteIndex, 1);
    if (downvoteIndex > -1) downvotes.splice(downvoteIndex, 1);

    // Add new vote if different from removed vote
    if (voteType === 'up' && upvoteIndex === -1) {
      upvotes.push(userId);
    } else if (voteType === 'down' && downvoteIndex === -1) {
      downvotes.push(userId);
    }

    await question.save();
    
    // Create notification for question author
    if (voteType === 'up' && upvoteIndex === -1) {
      await createNotification(
        'vote',
        question.author,
        req.user._id,
        `${req.user.username} upvoted your question`,
        question._id
      );
    }

    res.json({
      message: 'Vote recorded',
      voteScore: question.voteScore,
      userVote: voteType === 'up' && upvoteIndex === -1 ? 'up' : 
                voteType === 'down' && downvoteIndex === -1 ? 'down' : null
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
