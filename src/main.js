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
import './styles/components/whatsapp.css';
import './styles/components/carousel.css';
import './styles/components/typeform-modal.css';

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

// Lógica de checkout + tracking + widgets + carrossel
import { rewriteCheckoutLinks } from './checkout.js';
import { wireWhatsappWidget } from './whatsapp.js';
import { initCarousels } from './carousel.js';
import { WHATSAPP_GROUP_URL, GOOGLE_SHEETS_ENDPOINT } from './config.js';
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

/* ---------- Checkout + Tracking ---------- */
rewriteCheckoutLinks();
wireWhatsappWidget();
initCarousels();

/* ---------- WhatsApp group: wire URL from config ---------- */
const whatsappGroupBtn = document.getElementById('whatsapp-group-btn');
if (whatsappGroupBtn) whatsappGroupBtn.setAttribute('href', WHATSAPP_GROUP_URL);

initCtaTracking();
initScrollDepth();
initSectionObserver();

/* ---------- Modal: Escape key + body scroll lock ---------- */
const typeformModal = document.getElementById('typeform-modal');

if (typeformModal) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && typeformModal.classList.contains('is-open')) {
      typeformModal.classList.remove('is-open');
    }
  });

  const observer = new MutationObserver(() => {
    document.body.style.overflow = typeformModal.classList.contains('is-open')
      ? 'hidden'
      : '';
  });

  observer.observe(typeformModal, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

/* ---------- Formulário ICP: validação + envio Google Sheets ---------- */
const icpForm = document.getElementById('icp-form');
const formStep = document.getElementById('form-step');
const successStep = document.getElementById('success-step');
const formError = document.getElementById('icp-form-error');

if (icpForm) {
  // Lógica para os campos "Outro"
  const outroInputs = ['perfil', 'desafio', 'origem'];
  outroInputs.forEach(name => {
    const radios = icpForm.querySelectorAll(`input[name="${name}"]`);
    const outroInputText = icpForm.querySelector(`input[name="${name}_outro"]`);
    
    if (radios.length > 0 && outroInputText) {
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.value === 'outro') {
            outroInputText.style.display = '';
            outroInputText.required = true;
            // Scroll to the input nicely
            setTimeout(() => outroInputText.focus(), 50);
          } else {
            outroInputText.style.display = 'none';
            outroInputText.required = false;
            outroInputText.value = '';
          }
        });
      });
    }
  });

  icpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validação: text inputs obrigatórios
    const nome = icpForm.querySelector('#icp-nome');
    const email = icpForm.querySelector('#icp-email');
    const whatsapp = icpForm.querySelector('#icp-whatsapp');

    const textsFilled = nome.value.trim() && email.value.trim() && whatsapp.value.trim();

    // Validação: radio groups obrigatórios (todos)
    const requiredRadios = ['faixa_etaria', 'perfil', 'escolaridade', 'faturamento', 'desafio', 'objetivo', 'origem'];
    const radiosFilled = requiredRadios.every(
      (name) => icpForm.querySelector(`input[name="${name}"]:checked`)
    );

    if (!textsFilled || !radiosFilled) {
      if (formError) formError.style.display = '';
      // Scroll to first empty required field
      const firstInvalid = icpForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (formError) formError.style.display = 'none';

    // Loading state
    const submitBtn = icpForm.querySelector('.icp-form__submit');
    const submitText = icpForm.querySelector('.icp-form__submit-text');
    const submitLoading = icpForm.querySelector('.icp-form__submit-loading');
    submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitLoading) submitLoading.style.display = '';

    // Montar dados do formulário
    const formData = new FormData(icpForm);

    // Mesclar valores de "Outro" no campo principal para a planilha
    outroInputs.forEach(name => {
      const val = formData.get(name);
      if (val === 'outro') {
        const textVal = formData.get(`${name}_outro`);
        formData.set(name, textVal ? `Outro: ${textVal}` : 'Outro');
      }
      formData.delete(`${name}_outro`); // Remove o campo extra
    });

    // Adicionar metadata
    formData.append('timestamp', new Date().toISOString());
    formData.append('page_url', window.location.href);
    const params = new URLSearchParams(window.location.search);
    formData.append('utm_source', params.get('utm_source') || '');
    formData.append('utm_medium', params.get('utm_medium') || '');
    formData.append('utm_campaign', params.get('utm_campaign') || '');

    try {
      // Enviar para Google Sheets via Apps Script
      if (GOOGLE_SHEETS_ENDPOINT && !GOOGLE_SHEETS_ENDPOINT.includes('PLACEHOLDER')) {
        const urlEncodedData = new URLSearchParams(formData).toString();
        await fetch(GOOGLE_SHEETS_ENDPOINT, {
          method: 'POST',
          body: urlEncodedData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          mode: 'no-cors',
        });
      } else {
        console.log('[Climb4B] Form data (configure GOOGLE_SHEETS_ENDPOINT):', Object.fromEntries(formData));
        await new Promise((r) => setTimeout(r, 800));
      }

      // Tracking event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'icp_form_submit',
        form_perfil: formData.get('perfil'),
        form_desafio: formData.get('desafio') || 'not_answered',
        form_faturamento: formData.get('faturamento') || 'not_answered',
        form_objetivo: formData.get('objetivo') || 'not_answered',
      });

      // Transição: form → sucesso + WhatsApp
      if (formStep) formStep.style.display = 'none';
      if (successStep) successStep.style.display = '';

      // Scroll panel to top para ver a tela de sucesso
      const panel = document.querySelector('.typeform-overlay__panel');
      if (panel) panel.scrollTop = 0;

    } catch (err) {
      console.error('[Climb4B] Form submission error:', err);
      if (formStep) formStep.style.display = 'none';
      if (successStep) successStep.style.display = '';
    } finally {
      submitBtn.disabled = false;
      if (submitText) submitText.style.display = '';
      if (submitLoading) submitLoading.style.display = 'none';
    }
  });
}
