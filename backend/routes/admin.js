/**
 * Admin routes
 */
const express = require('express');
const router = express.Router();
const { login, listConsultations, getStats, updateStatus } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');

// Login — no requiere auth
router.post('/login', login);

// Rutas protegidas — requieren JWT
router.get('/consultations', authMiddleware, listConsultations);
router.get('/stats', authMiddleware, getStats);
router.patch('/consultations/:id/status', authMiddleware, updateStatus);

module.exports = router;
