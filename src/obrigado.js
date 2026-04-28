/* ============================================================
   obrigado.js — entrada da página /obrigado.html.
   Job único: disparar o evento `purchase` no dataLayer assim que
   a página carregar (lead chega aqui via redirect Eduzz após
   pagamento confirmado). GTM cuida de Pixel/GA4 Purchase tags.
   ============================================================ */

import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/components/header.css';
import './styles/components/buttons.css';
import './styles/components/footer.css';
import './styles/components/whatsapp.css';
import './styles/pages/obrigado.css';

import { trackPurchase, initCtaTracking } from './tracking.js';
import { wireWhatsappWidget } from './whatsapp.js';

trackPurchase();
wireWhatsappWidget();
initCtaTracking();
