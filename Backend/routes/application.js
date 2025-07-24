const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isCandidate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, isCandidate, applicationController.applyForJob);

module.exports = router; 