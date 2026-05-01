/**
 * WhatsApp service — genera URLs de WhatsApp
 */

function getWhatsAppUrl(number) {
  const message = encodeURIComponent('Hola Paola, quisiera pedir información sobre psicopedagogía.');
  return `https://wa.me/${number}?text=${message}`;
}

module.exports = { getWhatsAppUrl };
