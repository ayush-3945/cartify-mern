const express = require('express');
const router = express.Router();
const { getAnalyticsSummary } = require('../controllers/Analytics');

router.get('/summary', getAnalyticsSummary);

module.exports = router;
