/**
 * Email service — Nodemailer
 * Gmail con App Password en producción, Ethereal en desarrollo
 */
const nodemailer = require('nodemailer');

let transporter = null;
let etherealAccount = null;

/**
 * Inicializar el transporter de email
 */
async function initTransporter() {
  if (transporter) return transporter;

  // Si hay credenciales Gmail configuradas, usar Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
      process.env.EMAIL_USER !== 'tucorreo@gmail.com' &&
      process.env.EMAIL_PASS !== 'xxxx_xxxx_xxxx_xxxx') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Email configurado con Gmail');
  } else {
    // Modo desarrollo: usar Ethereal Email
    try {
      etherealAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: etherealAccount.smtp.host,
        port: etherealAccount.smtp.port,
        secure: etherealAccount.smtp.secure,
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass
        }
      });
      console.log('📧 Email en modo desarrollo (Ethereal)');
      console.log(`   Usuario: ${etherealAccount.user}`);
    } catch (err) {
      console.warn('⚠️  No se pudo crear cuenta Ethereal. Emails deshabilitados.');
      transporter = null;
    }
  }

  return transporter;
}

/**
 * Generar template HTML base para emails
 */
function emailWrapper(content) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6B3FA0,#FF00CC);border-radius:20px 20px 0 0;padding:30px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
        Psicopedagogía · Paola Zabala
      </h1>
    </div>
    <!-- Body -->
    <div style="background:white;padding:30px;border-radius:0 0 20px 20px;box-shadow:0 4px 20px rgba(107,63,160,0.1);">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding:20px;font-size:12px;color:#999;">
      <p style="margin:0;">Psicopedagogía Paola Zabala · Buenos Aires, Argentina</p>
      ${process.env.INSTAGRAM_URL ? `<p style="margin:5px 0 0;"><a href="${process.env.INSTAGRAM_URL}" style="color:#FF00CC;text-decoration:none;">Instagram</a></p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Enviar email de notificación a la psicopedagoga
 */
async function sendNotificationToAdmin(consultation) {
  const t = await initTransporter();
  if (!t) {
    console.warn('⚠️  Transporter no disponible — email de notificación omitido');
    return null;
  }

  const dateStr = new Date(consultation.created_at || Date.now()).toLocaleString('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  const content = `
    <h2 style="color:#6B3FA0;font-size:20px;margin:0 0 20px;">📬 Nueva consulta recibida</h2>
    
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;font-weight:600;color:#6B3FA0;width:140px;">Nombre</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;color:#2A1245;">${consultation.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;font-weight:600;color:#6B3FA0;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;">
          <a href="mailto:${consultation.email}" style="color:#FF00CC;text-decoration:none;">${consultation.email}</a>
        </td>
      </tr>
      ${consultation.phone ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;font-weight:600;color:#6B3FA0;">Teléfono</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;color:#2A1245;">${consultation.phone}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;font-weight:600;color:#6B3FA0;">Para quién</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;color:#2A1245;">${consultation.audience}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;font-weight:600;color:#6B3FA0;">Fecha</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8fa;color:#2A1245;">${dateStr}</td>
      </tr>
    </table>

    <div style="margin:20px 0;padding:16px;background:#f9f5ff;border-radius:12px;border-left:4px solid #FF00CC;">
      <p style="margin:0 0 5px;font-weight:600;color:#6B3FA0;font-size:13px;">MENSAJE:</p>
      <p style="margin:0;color:#2A1245;line-height:1.7;font-size:14px;">${consultation.message}</p>
    </div>

    <div style="text-align:center;margin-top:25px;">
      <a href="mailto:${consultation.email}?subject=Re: Tu consulta en Psicopedagogía Paola Zabala&body=Hola ${consultation.name},%0A%0AGracias por tu consulta.%0A%0A"
         style="display:inline-block;background:linear-gradient(135deg,#FF00CC,#6B3FA0);color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 4px 15px rgba(255,0,204,0.3);">
        Responder por email →
      </a>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Psicopedagogía Paola Zabala" <noreply@psicopedagogia.com>',
    to: process.env.EMAIL_TO || 'paolazabala.psico@gmail.com',
    subject: `📬 Nueva consulta de ${consultation.name} - Psicopedagogía Paola Zabala`,
    html: emailWrapper(content)
  };

  try {
    const info = await t.sendMail(mailOptions);
    if (etherealAccount) {
      console.log(`📧 Preview email admin: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    console.error('❌ Error enviando email de notificación:', error.message);
    return null;
  }
}

/**
 * Enviar email de confirmación al cliente
 */
async function sendConfirmationToClient(consultation) {
  const t = await initTransporter();
  if (!t) {
    console.warn('⚠️  Transporter no disponible — email de confirmación omitido');
    return null;
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER || '';
  const instagramUrl = process.env.INSTAGRAM_URL || '';

  const content = `
    <h2 style="color:#6B3FA0;font-size:20px;margin:0 0 10px;">¡Hola ${consultation.name}! 💜</h2>
    
    <p style="color:#5A4070;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Recibí tu consulta y la voy a revisar con atención. Te responderé dentro de las próximas 
      <strong style="color:#FF00CC;">24 horas</strong>.
    </p>

    <div style="background:#f9f5ff;border-radius:12px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#6B3FA0;font-size:13px;">📋 RESUMEN DE TU CONSULTA:</p>
      <p style="margin:0 0 4px;color:#5A4070;font-size:13px;"><strong>Para quién:</strong> ${consultation.audience}</p>
      <p style="margin:0;color:#5A4070;font-size:13px;"><strong>Mensaje:</strong> ${consultation.message.substring(0, 150)}${consultation.message.length > 150 ? '...' : ''}</p>
    </div>

    <p style="color:#5A4070;font-size:14px;line-height:1.7;margin:15px 0;">
      Si necesitás una respuesta más rápida, podés contactarme por estos medios alternativos:
    </p>

    <div style="margin:15px 0;">
      ${whatsappNumber ? `
      <a href="https://wa.me/${whatsappNumber}" 
         style="display:inline-block;background:#25D366;color:white;padding:10px 20px;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;margin:5px 5px 5px 0;">
        💬 WhatsApp
      </a>` : ''}
      ${instagramUrl ? `
      <a href="${instagramUrl}" 
         style="display:inline-block;background:linear-gradient(135deg,#E1306C,#C13584,#833AB4);color:white;padding:10px 20px;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;margin:5px;">
        📷 Instagram
      </a>` : ''}
    </div>

    <p style="color:#999;font-size:13px;margin:25px 0 0;line-height:1.6;">
      ¡Gracias por confiar en mí! 🌟<br>
      <strong style="color:#6B3FA0;">Paola Zabala</strong> · Psicopedagoga
    </p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Psicopedagogía Paola Zabala" <noreply@psicopedagogia.com>',
    to: consultation.email,
    subject: `✅ Recibimos tu consulta - Psicopedagogía Paola Zabala`,
    html: emailWrapper(content)
  };

  try {
    const info = await t.sendMail(mailOptions);
    if (etherealAccount) {
      console.log(`📧 Preview email cliente: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error.message);
    return null;
  }
}

module.exports = { initTransporter, sendNotificationToAdmin, sendConfirmationToClient };
