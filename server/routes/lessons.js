import express from 'express';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/lessons
// @desc    Get all lessons with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { grade, subject, search, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};
    
    if (grade) {
      query.gradeLevel = { $in: Array.isArray(grade) ? grade : [grade] };
    }
    
    if (subject) {
      query.subjects = { $in: Array.isArray(subject) ? subject : [subject] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute query with pagination
    const lessons = await Lesson.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination
    const total = await Lesson.countDocuments(query);
    
    res.json({
      lessons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/lessons/recommended
// @desc    Get recommended lessons for user
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Build recommendation query based on user preferences
    let query = {};
    
    if (user.grade) {
      query.gradeLevel = { $in: [user.grade] };
    }
    
    if (user.subjects && user.subjects.length > 0) {
      query.subjects = { $in: user.subjects };
    }
    
    // Get recommendations
    const recommendations = await Lesson.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);
      
    // Get trending lessons as fallback
    const trending = await Lesson.find({ trending: true })
      .populate('author', 'name avatar')
      .limit(6);
      
    // Combine and deduplicate
    const combined = [...recommendations];
    
    // Add trending lessons that aren't already in recommendations
    trending.forEach(lesson => {
      if (!combined.some(rec => rec._id.toString() === lesson._id.toString())) {
        combined.push(lesson);
      }
    });
    
    res.json(combined.slice(0, 6));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
      
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Increment view count
    lesson.views += 1;
    await lesson.save();
    
    res.json(lesson);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/lessons
// @desc    Create a new lesson
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      gradeLevel,
      subjects,
      objectives,
      materials,
      duration,
      instructions,
      tags
    } = req.body;
    
    // Create new lesson
    const newLesson = new Lesson({
      title,
      description,
      author: req.userId,
      gradeLevel: Array.isArray(gradeLevel) ? gradeLevel : [gradeLevel],
      subjects: Array.isArray(subjects) ? subjects : [subjects],
      objectives,
      materials,
      duration,
      instructions,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    const lesson = await newLesson.save();
    
    // Populate author info before returning
    await lesson.populate('author', 'name avatar');
    
    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/lessons/:id
// @desc    Update a lesson
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is the author
    if (lesson.author.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update fields
    const {
      title,
      description,
      gradeLevel,
      subjects,
      objectives,
      materials,
      duration,
      instructions,
      tags
    } = req.body;
    
    if (title) lesson.title = title;
    if (description) lesson.description = description;
    if (gradeLevel) lesson.gradeLevel = Array.isArray(gradeLevel) ? gradeLevel : [gradeLevel];
    if (subjects) lesson.subjects = Array.isArray(subjects) ? subjects : [subjects];
    if (objectives) lesson.objectives = objectives;
    if (materials) lesson.materials = materials;
    if (duration) lesson.duration = duration;
    if (instructions) lesson.instructions = instructions;
    if (tags) lesson.tags = tags.split(',').map(tag => tag.trim());
    
    await lesson.save();
    
    // Populate author info before returning
    await lesson.populate('author', 'name avatar');
    
    res.json(lesson);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/lessons/:id
// @desc    Delete a lesson
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if user is the author
    if (lesson.author.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await lesson.deleteOne();
    
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/lessons/:id/like
// @desc    Like a lesson
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if the lesson has already been liked by this user
    if (lesson.likes.some(like => like.toString() === req.userId.toString())) {
      // Remove like
      lesson.likes = lesson.likes.filter(like => like.toString() !== req.userId.toString());
      
      // Remove from user's liked lessons
      await User.findByIdAndUpdate(req.userId, {
        $pull: { likedLessons: req.params.id }
      });
    } else {
      // Add like
      lesson.likes.unshift(req.userId);
      
      // Add to user's liked lessons
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { likedLessons: req.params.id }
      });
    }
    
    await lesson.save();
    
    res.json(lesson.likes);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/lessons/:id/save
// @desc    Save a lesson
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Check if the lesson has already been saved by this user
    if (lesson.saves.some(save => save.toString() === req.userId.toString())) {
      // Remove save
      lesson.saves = lesson.saves.filter(save => save.toString() !== req.userId.toString());
      
      // Remove from user's saved lessons
      await User.findByIdAndUpdate(req.userId, {
        $pull: { savedLessons: req.params.id }
      });
    } else {
      // Add save
      lesson.saves.unshift(req.userId);
      
      // Add to user's saved lessons
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { savedLessons: req.params.id }
      });
    }
    
    await lesson.save();
    
    res.json(lesson.saves);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/lessons/:id/comment
// @desc    Comment on a lesson
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Add comment
    const newComment = {
      user: req.userId,
      text
    };
    
    lesson.comments.unshift(newComment);
    
    await lesson.save();
    
    // Populate user info in the new comment
    await lesson.populate('comments.user', 'name avatar');
    
    res.json(lesson.comments);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;