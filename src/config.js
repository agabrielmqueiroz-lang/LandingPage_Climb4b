/* ============================================================
   config.js — single source of truth para URLs e IDs.
   ANTES DO GO-LIVE: substituir todos os PLACEHOLDER e
   GTM-XXXXXXX / G-XXXXXXXXXX / Pixel ID / Clarity ID pelos
   valores reais. Ver README.md → "Checklist pré go-live".
   ============================================================ */

/**
 * URL do checkout Eduzz. Padrão é `https://sun.eduzz.com/{ID}`
 * ou `https://chk.eduzz.com/...` — a Eduzz gera o link único
 * quando o produto é criado no painel.
 */
export const EDUZZ_CHECKOUT_URL = 'https://sun.eduzz.com/PLACEHOLDER';

/**
 * Metadata do produto — usado nos eventos de ecommerce GA4
 * (begin_checkout, purchase) para alimentar relatórios de funil.
 */
export const PRODUCT = {
  name: 'Curso de Entrada — Finanças Empresariais',
  sku: 'climb4b-curso-entrada-v1',
  price: 299,
  currency: 'BRL',
  category: 'Curso Online',
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
    'Olá! Cheguei pela página do Curso de Entrada da Climb4B e queria tirar uma dúvida.',
};

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
