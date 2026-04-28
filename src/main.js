/* ============================================================
   main.js — entrada da landing page.
   Sprint 1 → tokens + base + tipografia.
   Sprint 3 → componentes globais + 10 seções implementadas.
   Sprint 4 → checkout (UTMs preservadas) + tracking (GTM dataLayer).
   ============================================================ */

// Sistema de design
import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';

// Componentes globais
import './styles/components/header.css';
import './styles/components/buttons.css';
import './styles/components/sticky-cta.css';
import './styles/components/footer.css';

// Seções (10 + footer)
import './styles/sections/hero.css';
import './styles/sections/autoridade.css';
import './styles/sections/dor.css';
import './styles/sections/metodo.css';
import './styles/sections/aulas.css';
import './styles/sections/publicos.css';
import './styles/sections/bonus.css';
import './styles/sections/oferta.css';
import './styles/sections/faq.css';
import './styles/sections/cta-final.css';

// Lógica de checkout + tracking
import { rewriteCheckoutLinks } from './checkout.js';
import {
  initCtaTracking,
  initScrollDepth,
  initSectionObserver,
} from './tracking.js';

/* ---------- Header: glass-morphism após scroll ---------- */
const header = document.querySelector('header[role="banner"]');

if (header) {
  const SCROLL_THRESHOLD = 24;
  let ticking = false;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateHeader();
}

/* ---------- CTAs persistentes: header (desktop) + sticky bar (mobile)
   aparecem QUANDO o hero sai de vista. Garante que existe apenas UM
   CTA visível por vez — hero CTA above-the-fold, persistentes depois. */
const stickyCta = document.querySelector('.sticky-cta');
const headerCta = document.querySelector('.header-cta');
const heroSection = document.querySelector('#hero');

if (heroSection && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const heroOutOfView = !entry.isIntersecting;
        if (stickyCta) stickyCta.classList.toggle('is-visible', heroOutOfView);
        if (headerCta) headerCta.classList.toggle('is-visible', heroOutOfView);
      });
    },
    {
      rootMargin: '-90% 0px 0px 0px',
      threshold: 0,
    }
  );

  heroObserver.observe(heroSection);
}

/* ---------- Checkout + Tracking ----------
   Ordem importa: rewrite primeiro (atualiza href com UTMs), depois
   o listener de tracking. Quando usuário clica, link já tem URL final
   e tracking dispara antes da navegação. */
rewriteCheckoutLinks();

initCtaTracking();
initScrollDepth();
initSectionObserver();
