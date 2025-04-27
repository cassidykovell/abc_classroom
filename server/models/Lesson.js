import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gradeLevel: [{
    type: String,
    required: true
  }],
  subjects: [{
    type: String,
    required: true
  }],
  objectives: {
    type: String
  },
  materials: {
    type: String
  },
  duration: {
    type: String
  },
  instructions: {
    type: String
  },
  files: [{
    filename: String,
    url: String,
    type: String
  }],
  tags: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  trending: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
LessonSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

const Lesson = mongoose.model('Lesson', LessonSchema);

export default Lesson;