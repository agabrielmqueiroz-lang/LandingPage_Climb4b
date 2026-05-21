/* ============================================================
   tracking.js — helpers de dataLayer.push.
   Padrão: código da LP só empurra eventos para dataLayer; tags de
   Pixel/GA4/Clarity ficam configuradas dentro do GTM. Vantagem:
   trocar/adicionar pixel não exige mexer no código.
   ============================================================ */

import { PRODUCT, PRODUCTS_BY_PLAN, SCROLL_DEPTHS } from './config.js';

// Garante que dataLayer existe ANTES do GTM tentar inicializá-lo.
// O snippet GTM no <head> do HTML já cria dataLayer, mas isso aqui
// é defesa contra ordem de execução em casos extremos.
window.dataLayer = window.dataLayer || [];

/**
 * Empurra um evento bruto para o dataLayer. Use os helpers
 * específicos abaixo em vez deste, exceto para casos novos.
 */
export function track(event, payload = {}) {
  window.dataLayer.push({ event, ...payload });
}

/**
 * Disparado quando uma section entra em vista (≥50% visível).
 * Permite medir profundidade de leitura por section, não só
 * scroll bruto — útil para identificar onde o lead "desiste".
 */
export function trackSectionView(sectionId) {
  track('view_section', { section_name: sectionId });
}

/**
 * Disparado em cada clique de CTA. Dispara DOIS eventos:
 * - cta_click: granular, identifica QUAL CTA foi clicado
 * - begin_checkout: padrão GA4 ecommerce, alimenta funil
 *
 * `plan` pode ser 'monthly' ou 'annual' — vem do data-plan do CTA.
 * Default = monthly se ausente.
 */
export function trackCtaClick(sectionLabel, ctaText, plan = 'monthly') {
  const product = PRODUCTS_BY_PLAN[plan] || PRODUCT;

  track('cta_click', {
    section_name: sectionLabel,
    cta_label: ctaText,
    plan,
  });

  track('begin_checkout', {
    currency: product.currency,
    value: product.price,
    plan,
    items: [
      {
        item_id: product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Scroll depth: dispara em 25/50/75/90% (configurável em config.js).
 * Usa rAF para não bloquear scroll. Cada marco dispara uma única vez.
 */
export function initScrollDepth() {
  const fired = new Set();
  let ticking = false;

  const checkScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) {
      ticking = false;
      return;
    }

    const percent = (window.scrollY / max) * 100;

    SCROLL_DEPTHS.forEach((depth) => {
      if (percent >= depth && !fired.has(depth)) {
        fired.add(depth);
        track('scroll_depth', { percent: depth });
      }
    });

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * Section observer: dispara view_section quando cada <section[id]>
 * fica ≥50% visível. Cada section dispara uma única vez por sessão.
 */
export function initSectionObserver() {
  if (!('IntersectionObserver' in window)) return;

  const sections = document.querySelectorAll('section[id]');
  const fired = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired.has(entry.target.id)) {
          fired.add(entry.target.id);
          trackSectionView(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((s) => observer.observe(s));
}

/**
 * CTA click tracking: listener delegado no document. Captura cliques
 * em qualquer <a data-cta="..."> e dispara cta_click. Para CTAs de
 * compra (todos exceto whatsapp) também dispara begin_checkout.
 * NÃO chama preventDefault — link navega normalmente.
 */
export function initCtaTracking() {
  document.addEventListener('click', (event) => {
    const cta = event.target.closest('[data-cta]');
    if (!cta) return;

    const sectionLabel = cta.dataset.cta || 'unknown';
    const ctaText = (cta.textContent || '').trim().replace(/\s+/g, ' ');

    // CTAs de contato (whatsapp, email) e navegação interna (href="#...")
    // não são intent de checkout — disparamos só cta_click sem evento
    // ecommerce. O sticky-mobile, por exemplo, rola pra #oferta onde
    // o usuário escolhe o plano antes de comprar.
    const href = cta.getAttribute('href') || '';
    const isInternalNav = href.startsWith('#');

    if (sectionLabel === 'whatsapp' || sectionLabel === 'contact' || isInternalNav) {
      track('cta_click', {
        section_name: sectionLabel,
        cta_label: ctaText || sectionLabel,
        nav_type: isInternalNav ? 'scroll' : 'contact',
      });
      return;
    }

    // Plano vem do data-plan do CTA — diferencia mensal vs anual
    // pra GA4 ecommerce. Default = monthly.
    const plan = cta.dataset.plan || 'monthly';
    trackCtaClick(sectionLabel, ctaText, plan);
  });
}

/**
 * Purchase event para a página /obrigado.html. Lê parâmetros que a
 * Eduzz costuma passar no success_url (transactionId/key/contract)
 * — qualquer um pode estar presente, prevalece o primeiro encontrado.
 */
export function trackPurchase() {
  const params = new URLSearchParams(window.location.search);

  const transactionId =
    params.get('transactionId') ||
    params.get('contract') ||
    params.get('key') ||
    params.get('order') ||
    `unknown-${Date.now()}`;

  // Plano vem do success_url da Eduzz (configurar como
  // /obrigado.html?plan=monthly ou /obrigado.html?plan=annual).
  // Default = monthly se não vier.
  const plan = params.get('plan') || 'monthly';
  const product = PRODUCTS_BY_PLAN[plan] || PRODUCT;

  // Eduzz às vezes envia value/currency — se não, usa do produto.
  const value = parseFloat(params.get('value')) || product.price;
  const currency = params.get('currency') || product.currency;

  track('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    plan,
    items: [
      {
        item_id: product.sku,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}
