import express from 'express';
import Discussion from '../models/Discussion.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/discussions
// @desc    Get all discussions with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tag, sort, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tag) {
      query.tags = { $in: Array.isArray(tag) ? tag : [tag] };
    }
    
    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (sort === 'popular') {
      sortOption = { 'replies.length': -1 };
    } else if (sort === 'views') {
      sortOption = { views: -1 };
    }
    
    // Execute query with pagination
    const discussions = await Discussion.find(query)
      .populate('author', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination
    const total = await Discussion.countDocuments(query);
    
    res.json({
      discussions,
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

// @route   GET api/discussions/:id
// @desc    Get discussion by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('replies.user', 'name avatar');
      
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Increment view count
    discussion.views += 1;
    await discussion.save();
    
    res.json(discussion);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/discussions
// @desc    Create a new discussion
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Create new discussion
    const newDiscussion = new Discussion({
      title,
      content,
      author: req.userId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    const discussion = await newDiscussion.save();
    
    // Populate author info before returning
    await discussion.populate('author', 'name avatar');
    
    res.status(201).json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/discussions/:id
// @desc    Update a discussion
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author
    if (discussion.author.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update fields
    const { title, content, tags } = req.body;
    
    if (title) discussion.title = title;
    if (content) discussion.content = content;
    if (tags) discussion.tags = tags.split(',').map(tag => tag.trim());
    
    await discussion.save();
    
    // Populate author info before returning
    await discussion.populate('author', 'name avatar');
    
    res.json(discussion);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/discussions/:id
// @desc    Delete a discussion
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author
    if (discussion.author.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await discussion.deleteOne();
    
    res.json({ message: 'Discussion removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/discussions/:id/reply
// @desc    Reply to a discussion
// @access  Private
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Add reply
    const newReply = {
      user: req.userId,
      content,
      likes: []
    };
    
    discussion.replies.push(newReply);
    
    await discussion.save();
    
    // Populate user info in the replies
    await discussion.populate('replies.user', 'name avatar');
    
    res.json(discussion.replies);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/discussions/:id/replies/:reply_id/like
// @desc    Like a reply
// @access  Private
router.post('/:id/replies/:reply_id/like', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Find the reply
    const reply = discussion.replies.id(req.params.reply_id);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    // Check if the reply has already been liked by this user
    if (reply.likes.some(like => like.toString() === req.userId.toString())) {
      // Remove like
      reply.likes = reply.likes.filter(like => like.toString() !== req.userId.toString());
    } else {
      // Add like
      reply.likes.push(req.userId);
    }
    
    await discussion.save();
    
    res.json(reply.likes);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Discussion or reply not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;