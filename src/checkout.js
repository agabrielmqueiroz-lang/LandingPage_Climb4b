/* ============================================================
   checkout.js — montagem da URL do Eduzz com UTMs do referrer.
   Sem isso, o Eduzz recebe o lead mas não consegue atribuir a
   campanha que o trouxe. Conversão "vira órfã" no painel de Ads.
   ============================================================ */

import { EDUZZ_CHECKOUT_URL, TRACKED_PARAMS } from './config.js';

/**
 * Monta a URL final do checkout, propagando UTMs (e click IDs do
 * Google/Meta/MS) presentes na query string da landing page.
 *
 * @param {string} baseUrl - URL base do checkout (default: config)
 * @returns {string} URL com UTMs adicionadas
 */
export function buildCheckoutUrl(baseUrl = EDUZZ_CHECKOUT_URL) {
  if (typeof window === 'undefined') return baseUrl;

  try {
    const url = new URL(baseUrl, window.location.origin);
    const incomingParams = new URLSearchParams(window.location.search);

    TRACKED_PARAMS.forEach((key) => {
      const value = incomingParams.get(key);
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  } catch {
    // URL malformada (placeholder, etc) — devolve sem mexer.
    return baseUrl;
  }
}

/**
 * Aplica buildCheckoutUrl em todos os <a data-cta="..."> da página.
 * Roda uma vez no carregamento. Click handler subsequente só dispara
 * tracking — link navega normalmente para a URL já preparada.
 */
export function rewriteCheckoutLinks() {
  document.querySelectorAll('a[data-cta]').forEach((cta) => {
    const original = cta.getAttribute('href');
    if (!original) return;
    cta.setAttribute('href', buildCheckoutUrl(original));
  });
}
