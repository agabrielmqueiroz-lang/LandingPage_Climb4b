/* ============================================================
   config.js — single source of truth para URLs e IDs.
   ANTES DO GO-LIVE: substituir todos os PLACEHOLDER e
   GTM-XXXXXXX / G-XXXXXXXXXX / Pixel ID / Clarity ID pelos
   valores reais. Ver README.md → "Checklist pré go-live".
   ============================================================ */

/**
 * URL do checkout Eduzz para o produto recorrente Climb Pass.
 * IMPORTANTE: o produto na Eduzz precisa estar configurado como
 * cobrança recorrente mensal (não pagamento único). Padrão:
 * `https://sun.eduzz.com/{ID}` ou `https://chk.eduzz.com/...`.
 */
export const EDUZZ_CHECKOUT_URL = 'https://sun.eduzz.com/PLACEHOLDER';

/**
 * Metadata do produto — usado nos eventos de ecommerce GA4
 * (begin_checkout, purchase) para alimentar relatórios de funil.
 * `billing` é metadado nosso (não padrão GA4) — descreve o modelo.
 */
export const PRODUCT = {
  name: 'Climb Pass — Assinatura Mensal',
  sku: 'climb4b-climb-pass-monthly',
  price: 99.9,
  currency: 'BRL',
  category: 'Assinatura',
  billing: 'monthly_recurring',
};

/**
 * IDs das ferramentas de tracking. Todos disparados via container
 * GTM único — código da LP só faz dataLayer.push, configuração de
 * Pixel/GA4/Clarity acontece dentro do GTM.
 */
export const TRACKING = {
  GTM_ID: 'GTM-XXXXXXX',
  GA4_ID: 'G-XXXXXXXXXX',
  META_PIXEL_ID: '000000000000',
  CLARITY_ID: 'XXXXXXXXXX',
};

/**
 * Suporte via WhatsApp — widget flutuante no canto inferior direito.
 * Número no formato internacional sem símbolos: 55 + DDD + número.
 * Exemplo: 5511987654321 (Brasil 11 9 8765-4321).
 */
export const WHATSAPP = {
  NUMBER: '5511000000000', // ← substituir pelo número real antes do go-live
  MESSAGE:
    'Olá! Cheguei pela página do Climb Pass e queria tirar uma dúvida sobre a assinatura.',
};

/**
 * URL do grupo de assinantes no WhatsApp, exibido em /obrigado.html
 * após confirmação da assinatura. Substituir pelo link real antes do go-live.
 */
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/D6qZHcqDz4sHlUuZp6tx3k';

/**
 * Marcos de scroll a disparar (em % da página). Mantido enxuto —
 * cada evento extra polui o relatório sem ganho proporcional.
 */
export const SCROLL_DEPTHS = [25, 50, 75, 90];

/**
 * Parâmetros de query string a preservar do referrer (ads, campanhas)
 * para o checkout — sem isso, atribuição de conversão se perde.
 */
export const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',   // Google Ads click ID
  'fbclid',  // Facebook click ID
  'msclkid', // Microsoft Ads click ID
];
