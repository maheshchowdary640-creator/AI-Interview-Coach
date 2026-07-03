const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    default: ''
  },
  jobDescription: {
    type: String,
    default: ''
  },
  interviewType: {
    type: String,
    enum: ['HR Interview', 'Technical Interview', 'Project-Based Interview', 'Internship Interview'],
    default: 'HR Interview'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [{
    id: { type: Number, required: true },
    question: { type: String, required: true }
  }],
  answers: [{
    questionId: { type: Number, required: true },
    answer: { type: String, default: '' }
  }],
  feedback: [{
    questionId: { type: Number, required: true },
    score: { type: Number, required: true },
    strengths: { type: String, default: '' },
    mistakes: { type: String, default: '' },
    improvedAnswer: { type: String, default: '' },
    prepTip: { type: String, default: '' }
  }],
  scores: {
    overall: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  weakAreas: [{ type: String }],
  strongAreas: [{ type: String }],
  improvementRoadmap: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
