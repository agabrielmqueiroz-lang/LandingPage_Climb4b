/* ============================================================
   whatsapp.js — wira o widget flutuante de WhatsApp.
   Lê NUMBER + MESSAGE de config.js, monta a URL wa.me com a
   mensagem URL-encoded e injeta no <a class="whatsapp-widget">.
   ============================================================ */

import { WHATSAPP } from './config.js';

export function wireWhatsappWidget() {
  const widget = document.querySelector('.whatsapp-widget');
  if (!widget) return;

  const number = (WHATSAPP.NUMBER || '').replace(/\D/g, '');
  if (!number) return;

  const message = encodeURIComponent(WHATSAPP.MESSAGE || '');
  const url = message
    ? `https://wa.me/${number}?text=${message}`
    : `https://wa.me/${number}`;

  widget.setAttribute('href', url);
}
