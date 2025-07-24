const Application = require('../models/Application');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resumeLink, coverLetter } = req.body;
    const candidateId = req.user.userId;
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }
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

exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId }).populate('candidateId', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
}; 