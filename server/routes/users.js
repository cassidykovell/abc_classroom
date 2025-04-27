import express from 'express';
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Discussion from '../models/Discussion.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, grade, subjects, bio } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (grade) profileFields.grade = grade;
    if (subjects) profileFields.subjects = Array.isArray(subjects) ? subjects : [subjects];
    if (bio) profileFields.bio = bio;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/:id/lessons
// @desc    Get lessons created by a user
// @access  Public
router.get('/:id/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ author: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/:id/saved-lessons
// @desc    Get lessons saved by a user
// @access  Private
router.get('/:id/saved-lessons', auth, async (req, res) => {
  try {
    // Check if requesting user is the same as the profile being viewed
    if (req.userId.toString() !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized to view this data' });
    }
    
    const user = await User.findById(req.params.id).populate({
      path: 'savedLessons',
      populate: {
        path: 'author',
        select: 'name avatar'
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedLessons);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/:id/discussions
// @desc    Get discussions created by a user
// @access  Public
router.get('/:id/discussions', async (req, res) => {
  try {
    const discussions = await Discussion.find({ author: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.json(discussions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;