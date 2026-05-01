/**
 * Servidor principal — Express + Node.js
 * Psicopedagogía Paola Zabala
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { initialize } = require('./database/init');
const { initTransporter } = require('./services/emailService');
const { getWhatsAppUrl } = require('./services/whatsappService');

const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

// ─── Inicializar base de datos (async) ───
let dbReady = initialize().catch(err => console.error('DB init error:', err));

// ─── Inicializar email (async) ───
initTransporter().catch(err => console.warn('⚠️  Email init error:', err.message));

// ─── Middlewares ───
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Permitir inline styles/scripts del HTML
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (IS_DEV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Trust proxy (para rate limiting detrás de reverse proxy) ───
app.set('trust proxy', 1);

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// ─── Servir admin panel ───
app.use('/admin', express.static(path.join(__dirname, '..', 'frontend', 'admin')));

// ─── Servir archivos estáticos (public/) ───
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// ─── Servir index.html con reemplazo de placeholders ───
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Reemplazar placeholders
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '5491112345678';
  const whatsappUrl = getWhatsAppUrl(whatsappNumber);
  const instagramUrl = process.env.INSTAGRAM_URL || '#';

  html = html.replace(/\{\{WHATSAPP_URL\}\}/g, whatsappUrl);
  html = html.replace(/\{\{WHATSAPP_NUMBER\}\}/g, whatsappNumber);
  html = html.replace(/\{\{INSTAGRAM_URL\}\}/g, instagramUrl);

  res.set('Content-Type', 'text/html');
  res.send(html);
});

// ─── SPA fallback — rutas no-API sirven index.html ───
app.get('*', (req, res, next) => {
  // No interceptar /admin ni /api
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
    return next();
  }
  const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '5491112345678';
    const whatsappUrl = getWhatsAppUrl(whatsappNumber);
    const instagramUrl = process.env.INSTAGRAM_URL || '#';
    html = html.replace(/\{\{WHATSAPP_URL\}\}/g, whatsappUrl);
    html = html.replace(/\{\{WHATSAPP_NUMBER\}\}/g, whatsappNumber);
    html = html.replace(/\{\{INSTAGRAM_URL\}\}/g, instagramUrl);
    res.set('Content-Type', 'text/html');
    res.send(html);
  } else {
    next();
  }
});

// ─── Error handler global ───
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: IS_DEV ? err.message : 'Error interno del servidor.'
  });
});

// ─── 404 handler ───
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada.'
  });
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   🧠 Psicopedagogía Paola Zabala — Servidor     ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║   🌐 http://localhost:${PORT}                      ║`);
  console.log(`║   🔧 Admin: http://localhost:${PORT}/admin           ║`);
  console.log(`║   📊 Env: ${IS_DEV ? 'desarrollo' : 'producción'}                         ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
