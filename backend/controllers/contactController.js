/**
 * Contact controller — maneja consultas del formulario
 */
const Consultation = require('../models/Consultation');
const { sendNotificationToAdmin, sendConfirmationToClient } = require('../services/emailService');

const ALLOWED_AUDIENCES = [
  'Para mi hijo/a (4-12 años)',
  'Para un adolescente',
  'Para mí (adulto)',
  'Asesoramiento docente/familiar'
];

function sanitizeHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitContact(req, res) {
  try {
    let { name, email, phone, audience, message } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string') { errors.push('El nombre es obligatorio.'); }
    else { name = sanitizeHtml(name); if (name.length < 2) errors.push('El nombre debe tener al menos 2 caracteres.'); if (name.length > 100) errors.push('El nombre no puede superar los 100 caracteres.'); }

    if (!email || typeof email !== 'string') { errors.push('El email es obligatorio.'); }
    else { email = sanitizeHtml(email).toLowerCase(); if (!isValidEmail(email)) errors.push('El formato del email no es válido.'); }

    if (phone) { phone = sanitizeHtml(phone); if (!/^[\d\s\-+()]*$/.test(phone)) errors.push('El teléfono solo puede contener números, espacios y guiones.'); if (phone.length > 20) errors.push('El teléfono no puede superar los 20 caracteres.'); }

    if (!audience || typeof audience !== 'string') { errors.push('Seleccioná para quién es la consulta.'); }
    else { audience = sanitizeHtml(audience); if (!ALLOWED_AUDIENCES.includes(audience)) errors.push('La opción seleccionada no es válida.'); }

    if (!message || typeof message !== 'string') { errors.push('El mensaje es obligatorio.'); }
    else { message = sanitizeHtml(message); if (message.length < 10) errors.push('El mensaje debe tener al menos 10 caracteres.'); if (message.length > 1000) errors.push('El mensaje no puede superar los 1000 caracteres.'); }

    if (errors.length > 0) return res.status(400).json({ success: false, error: errors[0], errors });

    const consultation = await Consultation.create({
      name, email, phone: phone || null, audience, message,
      ip_address: req.ip || req.headers['x-forwarded-for'] || null,
      user_agent: req.headers['user-agent'] || null
    });

    sendNotificationToAdmin(consultation).catch(e => console.error('Email admin error:', e.message));
    sendConfirmationToClient(consultation).catch(e => console.error('Email client error:', e.message));

    return res.status(201).json({ success: true, message: '¡Tu consulta fue enviada con éxito! Te responderé dentro de las próximas 24 horas. 💜' });
  } catch (error) {
    console.error('Error en submitContact:', error);
    return res.status(500).json({ success: false, error: 'Ocurrió un error interno. Por favor, intentá nuevamente más tarde.' });
  }
}

module.exports = { submitContact };
