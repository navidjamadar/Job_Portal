const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: 'Job creation failed', error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { location, type, minSalary, maxSalary, keyword, page = 1, limit = 10, sort = '-postedDate' } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (minSalary || maxSalary) {
      filter['salaryRange.min'] = minSalary ? { $gte: Number(minSalary) } : { $exists: true };
      filter['salaryRange.max'] = maxSalary ? { $lte: Number(maxSalary) } : { $exists: true };
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Job.countDocuments(filter);
    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job', error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: 'Job update failed', error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Job deletion failed', error: err.message });
  }
}; 