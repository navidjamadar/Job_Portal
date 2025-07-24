const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isCandidate, isAdmin } = require('../middleware/auth');

// Candidate applies for a job
router.post('/', authenticate, isCandidate, applicationController.applyForJob);
// Removed getMyApplications and getAllApplications routes

module.exports = router; 