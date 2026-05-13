/* ============================================================
   obrigado.js — entrada da página /obrigado.html.
   Climb Pass flow: assinatura confirmada após checkout Eduzz.
   Dispara `purchase` no carregamento (com transactionId do success_url
   da Eduzz) e direciona para o grupo de assinantes no WhatsApp.
   ============================================================ */

import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/components/header.css';
import './styles/components/buttons.css';
import './styles/components/footer.css';
import './styles/components/whatsapp.css';
import './styles/pages/obrigado.css';

import { initCtaTracking, trackPurchase } from './tracking.js';
import { wireWhatsappWidget } from './whatsapp.js';
import { WHATSAPP_GROUP_URL } from './config.js';

wireWhatsappWidget();
initCtaTracking();
trackPurchase();

/* Wire WhatsApp group button on obrigado page */
const obrigadoWhatsappBtn = document.getElementById('obrigado-whatsapp-group');
if (obrigadoWhatsappBtn) {
  obrigadoWhatsappBtn.setAttribute('href', WHATSAPP_GROUP_URL);
}
