const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public: Get all jobs with filters, pagination, sorting
router.get('/', jobController.getJobs);
// Public: Get single job by ID
router.get('/:id', jobController.getJobById);

// Admin only: Create, update, delete jobs
router.post('/', authenticate, isAdmin, jobController.createJob);
router.put('/:id', authenticate, isAdmin, jobController.updateJob);
router.delete('/:id', authenticate, isAdmin, jobController.deleteJob);

module.exports = router; 