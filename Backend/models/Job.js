const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship'],
    required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema); 