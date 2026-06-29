/* ============================================================
   tracking.js — helpers de dataLayer.push.
   Padrão: código da LP só empurra eventos para dataLayer; tags de
   Pixel/GA4/Clarity ficam configuradas dentro do GTM. Vantagem:
   trocar/adicionar pixel não exige mexer no código.
   ============================================================ */

import { PRODUCT, SCROLL_DEPTHS } from './config.js';

// Garante que dataLayer existe ANTES do GTM tentar inicializá-lo.
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
 */
export function trackSectionView(sectionId) {
  track('view_section', { section_name: sectionId });
}

/**
 * Disparado em cada clique de CTA. Dispara DOIS eventos:
 * - cta_click: granular, identifica QUAL CTA foi clicado
 * - begin_checkout: padrão GA4 ecommerce, alimenta funil
 */
export function trackCtaClick(sectionLabel, ctaText) {
  track('cta_click', {
    section_name: sectionLabel,
    cta_label: ctaText,
  });

  track('begin_checkout', {
    currency: PRODUCT.currency,
    value: PRODUCT.price,
    items: [
      {
        item_id: PRODUCT.sku,
        item_name: PRODUCT.name,
        item_category: PRODUCT.category,
        price: PRODUCT.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Scroll depth: dispara em 25/50/75/90% (configurável em config.js).
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
 * compra também dispara begin_checkout.
 */
export function initCtaTracking() {
  document.addEventListener('click', (event) => {
    const cta = event.target.closest('[data-cta]');
    if (!cta) return;

    const sectionLabel = cta.dataset.cta || 'unknown';
    const ctaText = (cta.textContent || '').trim().replace(/\s+/g, ' ');

    // CTAs de contato (whatsapp, email) e navegação interna (href="#...")
    // não são intent de checkout — disparamos só cta_click sem evento
    // ecommerce.
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

    trackCtaClick(sectionLabel, ctaText);
  });
}

/**
 * Purchase event para a página /obrigado.html. Lê parâmetros que o
 * gateway costuma passar no success_url (transactionId/order/etc).
 */
export function trackPurchase() {
  const params = new URLSearchParams(window.location.search);

  const transactionId =
    params.get('transactionId') ||
    params.get('order_id') ||
    params.get('order') ||
    params.get('contract') ||
    params.get('key') ||
    `unknown-${Date.now()}`;

  const value = parseFloat(params.get('value')) || PRODUCT.price;
  const currency = params.get('currency') || PRODUCT.currency;

  track('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items: [
      {
        item_id: PRODUCT.sku,
        item_name: PRODUCT.name,
        item_category: PRODUCT.category,
        price: PRODUCT.price,
        quantity: 1,
      },
    ],
  });
}
