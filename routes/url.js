const express = require('express');
const { handleGenerateNewShortURL, handleGetAnalytics } = require('../controllers/url');

const router = express.Router();

router.post('/', handleGenerateNewShortURL);  // Handles form submission
router.get('/analytics/:shortId', handleGetAnalytics);  // For analytics

module.exports = router;
