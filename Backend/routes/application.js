const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isCandidate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, isCandidate, applicationController.applyForJob);

// Admin: Get all applications for a specific job
router.get('/job/:jobId', authenticate, isAdmin, applicationController.getApplicationsByJob);

module.exports = router; 