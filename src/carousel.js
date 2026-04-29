/* ============================================================
   carousel.js — converte qualquer [data-carousel] em carrossel
   horizontal auto-rotativo no mobile (≤719px). Desktop mantém
   o layout original (CSS já cuida disso).

   Comportamento:
   - Auto-advance a cada AUTO_ADVANCE_MS
   - Pausa em touch / hover / focus
   - Dots clicáveis para pular pra slide específica
   - Respeita prefers-reduced-motion (sem auto-advance)
   ============================================================ */

const AUTO_ADVANCE_MS = 4000;
const MOBILE_BREAKPOINT = '(max-width: 719px)';

export function initCarousels() {
  const mobileMq = window.matchMedia(MOBILE_BREAKPOINT);
  const carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => setupCarousel(carousel, mobileMq));
}

function setupCarousel(carousel, mobileMq) {
  // Children com data-carousel-skip não viram slide (ex.: divisor "vs"
  // do Pilar 2, que só faz sentido na visão lado a lado em desktop).
  const items = Array.from(carousel.children).filter(
    (child) => !child.hasAttribute('data-carousel-skip')
  );
  if (items.length < 2) return;

  // Cria o container de dots e insere imediatamente após o carousel
  const dotsList = document.createElement('ul');
  dotsList.className = 'carousel-dots';
  dotsList.setAttribute('aria-label', 'Navegação do carrossel');

  const dots = items.map((_, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'carousel-dot';
    button.setAttribute('aria-label', `Ir para item ${index + 1} de ${items.length}`);
    button.addEventListener('click', () => {
      stopRotation(state);
      scrollToIndex(carousel, items, index);
    });
    li.appendChild(button);
    dotsList.appendChild(li);
    return button;
  });
  carousel.insertAdjacentElement('afterend', dotsList);

  const state = {
    carousel,
    items,
    dots,
    currentIndex: 0,
    timer: null,
    paused: false,
  };

  setActiveDot(state, 0);

  // Atualiza dot ativo conforme scroll do usuário
  let scrollDebounce;
  carousel.addEventListener(
    'scroll',
    () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const newIndex = computeActiveIndex(state);
        if (newIndex !== state.currentIndex) {
          setActiveDot(state, newIndex);
        }
      }, 80);
    },
    { passive: true }
  );

  // Pausa em interação
  ['touchstart', 'mouseenter', 'focusin'].forEach((evt) =>
    carousel.addEventListener(evt, () => stopRotation(state), { passive: true })
  );
  ['mouseleave', 'focusout'].forEach((evt) =>
    carousel.addEventListener(evt, () => {
      if (mobileMq.matches) startRotation(state);
    })
  );

  // Pausa quando aba não está visível (não desperdiça frames)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRotation(state);
    else if (mobileMq.matches) startRotation(state);
  });

  // Liga/desliga conforme a viewport muda entre mobile e desktop
  const onChange = (event) => {
    if (event.matches) startRotation(state);
    else stopRotation(state);
  };
  if (typeof mobileMq.addEventListener === 'function') {
    mobileMq.addEventListener('change', onChange);
  } else if (typeof mobileMq.addListener === 'function') {
    mobileMq.addListener(onChange);
  }

  if (mobileMq.matches) startRotation(state);
}

function startRotation(state) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  stopRotation(state);
  state.timer = window.setInterval(() => {
    const nextIndex = (state.currentIndex + 1) % state.items.length;
    scrollToIndex(state.carousel, state.items, nextIndex);
  }, AUTO_ADVANCE_MS);
}

function stopRotation(state) {
  if (state.timer != null) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function scrollToIndex(carousel, items, index) {
  const item = items[index];
  if (!item) return;
  const offset = item.offsetLeft - carousel.offsetLeft;
  carousel.scrollTo({ left: offset, behavior: 'smooth' });
}

function computeActiveIndex(state) {
  const { carousel, items } = state;
  const center = carousel.scrollLeft + carousel.clientWidth / 2;
  let closest = 0;
  let closestDistance = Infinity;
  items.forEach((item, index) => {
    const itemCenter = item.offsetLeft - carousel.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(itemCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = index;
    }
  });
  return closest;
}

function setActiveDot(state, index) {
  state.dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === index);
  });
  state.currentIndex = index;
}
