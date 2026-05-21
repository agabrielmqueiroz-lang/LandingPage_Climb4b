/* ============================================================
   config.js — single source of truth para URLs e IDs.
   ANTES DO GO-LIVE: substituir todos os PLACEHOLDER e
   GTM-XXXXXXX / G-XXXXXXXXXX / Pixel ID / Clarity ID pelos
   valores reais. Ver README.md → "Checklist pré go-live".
   ============================================================ */

/**
 * URL do checkout Ticto da ASSINATURA MENSAL recorrente R$ 99,90/mês.
 * Produto na Ticto configurado como cobrança recorrente mensal SOMENTE
 * no cartão de crédito (Pix recorrente desabilitado por enquanto —
 * disponibilizar depois quando o fluxo estiver pronto).
 */
export const CHECKOUT_URL_MONTHLY = 'https://checkout.ticto.app/OD06121A0';

/**
 * URL do checkout Ticto da ANUIDADE À VISTA R$ 999,90/ano (Pix ou boleto).
 * Produto na Ticto configurado como pagamento único à vista, acesso de
 * 12 meses (não vitalício). Configurar revogação automática de acesso
 * no dia 366 caso o assinante não renove.
 */
export const CHECKOUT_URL_ANNUAL = 'https://checkout.ticto.app/OB5AADACB';

/**
 * Alias pra compatibilidade: rewriteCheckoutLinks em checkout.js usa
 * CHECKOUT_URL como fallback se um link não tiver href próprio.
 * Aponta pra mensal por ser o caminho recomendado.
 */
export const CHECKOUT_URL = CHECKOUT_URL_MONTHLY;

/**
 * Metadata dos produtos — usado nos eventos GA4 ecommerce
 * (begin_checkout, purchase) pra alimentar relatórios de funil.
 * Tracking diferencia os dois planos via data-plan no CTA.
 */
export const PRODUCT_MONTHLY = {
  name: 'Climb Pass — Assinatura Mensal',
  sku: 'climb4b-climb-pass-monthly',
  price: 99.9,
  priceAnchor: 159.9, // de R$ 159,90 (riscado) → por R$ 99,90
  currency: 'BRL',
  category: 'Assinatura',
  billing: 'monthly_recurring',
};

export const PRODUCT_ANNUAL = {
  name: 'Climb Pass — Anuidade à vista (12 meses)',
  sku: 'climb4b-climb-pass-annual',
  price: 999.9,
  priceAnchor: 1198.8, // de R$ 1.198,80 (riscado) → por R$ 999,90
  currency: 'BRL',
  category: 'Anuidade',
  billing: 'annual_upfront',
};

/**
 * Alias do produto padrão (mensal). tracking.js usa esse pra
 * eventos sem data-plan explícito.
 */
export const PRODUCT = PRODUCT_MONTHLY;

/**
 * Mapa de planos pra lookup em tracking.js — quando um CTA tem
 * data-plan="annual", busca aqui o produto correspondente.
 */
export const PRODUCTS_BY_PLAN = {
  monthly: PRODUCT_MONTHLY,
  annual: PRODUCT_ANNUAL,
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
  NUMBER: '5511000000000', // ← substituir pelo número real antes do go-live
  MESSAGE:
    'Olá! Cheguei pela página do Climb Pass e queria tirar uma dúvida sobre a assinatura.',
};

/**
 * URL do grupo de assinantes no WhatsApp, exibido em /obrigado.html
 * após confirmação da assinatura.
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
