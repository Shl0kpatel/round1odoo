const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const { auth, optionalAuth } = require('../middleware/auth');
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

// @route   POST /api/answers
// @desc    Create a new answer
// @access  Private
router.post('/', auth, validationRules.answer, handleValidationErrors, async (req, res) => {
  try {
    const { content, questionId } = req.body;

    const question = await Question.findById(questionId).populate('author', 'username');
    if (!question || !question.isActive) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content,
      author: req.user._id,
      question: questionId
    });

    await answer.save();
    await answer.populate('author', 'username avatar reputation');

    // Add answer to question
    question.answers.push(answer._id);
    await question.save();

    // Create notification for question author
    await createNotification(
      'answer',
      question.author._id,
      req.user._id,
      `${req.user.username} answered your question: ${question.title}`,
      question._id,
      answer._id
    );

    res.status(201).json({
      message: 'Answer created successfully',
      answer
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/answers/:id
// @desc    Update an answer
// @access  Private (Owner or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check ownership or admin
    if (answer.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content } = req.body;
    if (content) answer.content = content;

    await answer.save();
    await answer.populate('author', 'username avatar reputation');

    res.json({
      message: 'Answer updated successfully',
      answer
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/answers/:id
// @desc    Delete an answer (soft delete)
// @access  Private (Owner or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check ownership or admin
    if (answer.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    answer.isActive = false;
    await answer.save();

    // Remove from question's answers array
    await Question.findByIdAndUpdate(
      answer.question,
      { $pull: { answers: answer._id } }
    );

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/answers/:id/vote
// @desc    Vote on an answer
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id).populate('question');

    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Can't vote on own answer
    if (answer.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot vote on your own answer' });
    }

    const userId = req.user._id;
    const upvotes = answer.votes.upvotes;
    const downvotes = answer.votes.downvotes;

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

    await answer.save();

    // Create notification for answer author
    if (voteType === 'up' && upvoteIndex === -1) {
      await createNotification(
        'vote',
        answer.author,
        req.user._id,
        `${req.user.username} upvoted your answer`,
        answer.question._id,
        answer._id
      );
    }

    res.json({
      message: 'Vote recorded',
      voteScore: answer.voteScore,
      userVote: voteType === 'up' && upvoteIndex === -1 ? 'up' : 
                voteType === 'down' && downvoteIndex === -1 ? 'down' : null
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/answers/:id/accept
// @desc    Accept an answer (only question owner)
// @access  Private
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate('question');
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = answer.question;

    // Only question owner can accept answers
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only question owner can accept answers' });
    }

    // Unaccept previous answer if exists
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    await question.save();

    // Create notification for answer author
    await createNotification(
      'accept',
      answer.author,
      req.user._id,
      `${req.user.username} accepted your answer`,
      question._id,
      answer._id
    );

    res.json({
      message: 'Answer accepted successfully',
      answer
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/answers/:id/comments
// @desc    Add a comment to an answer
// @access  Private
router.post('/:id/comments', auth, validationRules.comment, handleValidationErrors, async (req, res) => {
  try {
    const { content } = req.body;
    const answer = await Answer.findById(req.params.id).populate('question');

    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const comment = {
      author: req.user._id,
      content,
      createdAt: new Date()
    };

    answer.comments.push(comment);
    await answer.save();
    
    await answer.populate('comments.author', 'username avatar');

    // Create notification for answer author
    await createNotification(
      'comment',
      answer.author,
      req.user._id,
      `${req.user.username} commented on your answer`,
      answer.question._id,
      answer._id
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: answer.comments[answer.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/answers/:answerId/comments/:commentId
// @desc    Delete a comment
// @access  Private (Owner or Admin)
router.delete('/:answerId/comments/:commentId', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const comment = answer.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.remove();
    await answer.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
