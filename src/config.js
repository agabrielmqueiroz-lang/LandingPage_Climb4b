/* ============================================================
   config.js — single source of truth para URLs e IDs.
   ANTES DO GO-LIVE: substituir todos os GTM-XXXXXXX /
   G-XXXXXXXXXX / Pixel ID / Clarity ID pelos valores reais.
   Ver README.md → "Checklist pré go-live".
   ============================================================ */

/**
 * URL do checkout Kiwify da mentoria Intensivo CFO.
 * Pagamento único R$ 997 (1º lote · primeira turma).
 * Suporta cartão de crédito, Pix e boleto via Kiwify.
 */
export const CHECKOUT_URL = 'https://pay.kiwify.com.br/l8r4Sdr';

/**
 * Metadata do produto — usado nos eventos GA4 ecommerce
 * (begin_checkout, purchase) pra alimentar relatórios de funil.
 */
export const PRODUCT = {
  name: 'Intensivo CFO — Mentoria ao Vivo',
  sku: 'climb4b-intensivo-cfo-2026-08',
  price: 997,
  priceAnchor: 1297, // de R$ 1.297 (riscado) → por R$ 997 (1º lote)
  currency: 'BRL',
  category: 'Mentoria',
  billing: 'one_time',
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
 */
export const WHATSAPP = {
  NUMBER: '554192155299', // +55 41 9215-5299 (Climb4B suporte)
  MESSAGE:
    'Olá! Cheguei pela página do Intensivo CFO e queria tirar uma dúvida sobre a mentoria.',
};

/**
 * URL do grupo de assinantes no WhatsApp, exibido em /obrigado.html
 * após confirmação da inscrição.
 */
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/D6qZHcqDz4sHlUuZp6tx3k';

/**
 * Marcos de scroll a disparar (em % da página).
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
  'gclid',
  'fbclid',
  'msclkid',
];
