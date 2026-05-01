/**
 * Rate limiting middleware — protección anti-spam
 * Máximo 3 consultas por IP por hora
 */
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Ya enviaste una consulta recientemente. Esperá unos minutos.'
  },
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  }
});

module.exports = { contactLimiter };
