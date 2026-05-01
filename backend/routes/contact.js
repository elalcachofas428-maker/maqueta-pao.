/**
 * Contact routes
 */
const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimit');

// POST /api/contact — nueva consulta con rate limiting
router.post('/', contactLimiter, submitContact);

module.exports = router;
