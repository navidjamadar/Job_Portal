const Application = require('../models/Application');

// Candidate applies for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resumeLink, coverLetter } = req.body;
    const candidateId = req.user.userId;
    // Prevent admin from applying
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }
    // Prevent duplicate applications
    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    const application = new Application({ jobId, candidateId, resumeLink, coverLetter });
    await application.save();
    res.status(201).json({ message: 'Application submitted', application });
  } catch (err) {
    res.status(400).json({ message: 'Application failed', error: err.message });
  }
};

// Removed getMyApplications and getAllApplications endpoints 