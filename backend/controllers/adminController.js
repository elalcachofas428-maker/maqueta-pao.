/**
 * Admin controller — login, listado de consultas, cambio de estado
 */
const jwt = require('jsonwebtoken');
const Consultation = require('../models/Consultation');

function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Usuario y contraseña son obligatorios.' });
    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) return res.status(401).json({ success: false, error: 'Credenciales incorrectas.' });

    const token = jwt.sign({ user: username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    return res.json({ success: true, token, message: 'Sesión iniciada correctamente.' });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
  }
}

async function listConsultations(req, res) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;
    const consultations = await Consultation.findAll(filters);
    return res.json({ success: true, data: consultations, total: consultations.length });
  } catch (error) {
    console.error('Error en listConsultations:', error);
    return res.status(500).json({ success: false, error: 'Error al obtener consultas.' });
  }
}

async function getStats(req, res) {
  try {
    const stats = await Consultation.getStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error en getStats:', error);
    return res.status(500).json({ success: false, error: 'Error al obtener estadísticas.' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'El campo status es obligatorio.' });

    const valid = ['pending', 'contacted', 'closed'];
    if (!valid.includes(status)) return res.status(400).json({ success: false, error: `Estado inválido. Valores permitidos: ${valid.join(', ')}` });

    const consultation = await Consultation.updateStatus(parseInt(id), status);
    if (!consultation) return res.status(404).json({ success: false, error: 'Consulta no encontrada.' });

    return res.json({ success: true, data: consultation, message: `Estado actualizado a "${status}".` });
  } catch (error) {
    console.error('Error en updateStatus:', error);
    return res.status(500).json({ success: false, error: 'Error al actualizar el estado.' });
  }
}

module.exports = { login, listConsultations, getStats, updateStatus };
