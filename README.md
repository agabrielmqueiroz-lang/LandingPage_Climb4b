# Landing Page · Climb Pass

Landing page de assinatura para o **Climb Pass** — clube mensal de educação em finanças empresariais da Climb4B Academy. R$ 99,90/mês com cobrança recorrente via Eduzz.

Branch ativa do redesign: `redesign`. A LP do **Curso de Entrada** (R$ 299 pagamento único) continua em `main` e hospedada em https://landing-page-climb4b.vercel.app/.

Plano de execução: [plans/1-assinatura-perene-2-clever-token.md](C:\Users\Gabriel\.claude\plans\1-assinatura-perene-2-clever-token.md).

## Stack

- **Vite** (vanilla — HTML + CSS + JS puro, sem framework)
- **Montserrat** (display) + **Manrope** (body) via Google Fonts
- **GTM** orquestrando Meta Pixel + GA4 + Microsoft Clarity
- **Eduzz** com cobrança recorrente mensal

## Requisitos

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
npm run dev      # localhost:5173
npm run build    # gera dist/
npm run preview  # serve dist/ localmente (porta 4173)
```

## Estrutura

```
LandingPage_Climb4b/
├── index.html              # LP Climb Pass (11 seções + footer)
├── obrigado.html           # confirmação pós-Eduzz (Purchase event)
├── public/
│   ├── favicon.svg
│   └── og.svg              # OG image (1200×630) — converter para PNG antes do go-live
├── src/
│   ├── main.js             # entry da LP
│   ├── obrigado.js         # entry da página de obrigado
│   ├── config.js           # ÚNICO lugar de URLs/IDs (substituir antes do go-live)
│   ├── checkout.js         # buildCheckoutUrl com UTM preservation
│   ├── tracking.js         # helpers de dataLayer.push
│   ├── carousel.js         # carrossel auto-rotativo (não usado nesta LP, mas mantido)
│   ├── whatsapp.js         # widget flutuante WhatsApp
│   └── styles/
│       ├── tokens.css      # cores, tipografia, espaçamento
│       ├── base.css        # reset, focus-visible, prefers-reduced-motion
│       ├── typography.css  # hierarquia editorial + utilitários
│       ├── components/     # header, buttons, sticky-cta, footer, carousel, whatsapp
│       ├── sections/       # 11 CSS, uma por seção
│       └── pages/obrigado.css
├── .claude/skills/         # frontend-design, web-design-guidelines, copywriting, landing-page-design, page-cro
├── package.json
└── vite.config.js
```

## Seções da LP (em ordem)

1. **#hero** — H1 outcome-focused + CTA primário + trust strip
2. **#autoridade** — quote editorial + linha de empresas onde a CFO atuou
3. **#problema** — 3 dores que justificam assinatura sobre curso pontual
4. **#metodo** — ritmo semanal (Segunda → Quarta → Sexta)
5. **#incluso** — 5 benefícios da assinatura
6. **#temas** — 7 áreas que a assinatura cobre
7. **#publicos** — 3 personas para auto-seleção
8. **#professora** — Marissa Guimarães (CFO, Conselheira, Professora)
9. **#oferta** — pricing card R$ 99,90/mês
10. **#faq** — 6 objeções comuns
11. **#cta-final** — last call

---

## Checklist pré go-live

Substituir TODOS os placeholders antes de subir em produção.

### 1. Eduzz checkout URL (cobrança recorrente)

Em [src/config.js](src/config.js):

```js
export const EDUZZ_CHECKOUT_URL = 'https://sun.eduzz.com/PLACEHOLDER';
//                                                       ^^^^^^^^^^^
```

**Importante:** o produto na Eduzz precisa estar criado com **cobrança recorrente mensal** (não pagamento único). Ver seção "Setup no painel Eduzz" abaixo.

### 2. Número de WhatsApp do widget de suporte

Em [src/config.js](src/config.js):

```js
export const WHATSAPP = {
  NUMBER: '5511000000000', // formato internacional sem símbolos: 55 + DDD + número
  MESSAGE: 'Olá! Cheguei pela página do Climb Pass...',
};
```

### 3. URL do grupo de assinantes no WhatsApp

Em [src/config.js](src/config.js):

```js
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/...';
```

Esse grupo é exibido no `/obrigado.html` após confirmação da assinatura.

### 4. IDs de tracking

Em [src/config.js](src/config.js):

```js
export const TRACKING = {
  GTM_ID: 'GTM-XXXXXXX',
  GA4_ID: 'G-XXXXXXXXXX',
  META_PIXEL_ID: '000000000000',
  CLARITY_ID: 'XXXXXXXXXX',
};
```

E nos snippets GTM hardcoded em **dois arquivos** (procurar por `GTM-XXXXXXX`):

- [index.html](index.html) — duas ocorrências (head script + body noscript)
- [obrigado.html](obrigado.html) — duas ocorrências

Total: **4 substituições** do GTM_ID nos arquivos HTML.

### 5. Foto da Marissa Guimarães

Em [index.html](index.html), seção `#professora`, o `<div class="professora-portrait">` exibe um retrato placeholder com as iniciais "MG" sobre fundo navy + acento verde.

Quando a foto real chegar, substituir:

```html
<div class="professora-portrait" aria-hidden="true">
  <span class="professora-initials">MG</span>
</div>
```

Por:

```html
<div class="professora-portrait">
  <img src="/marissa.jpg" alt="Marissa Guimarães" width="240" height="240" />
</div>
```

E remover a regra `.professora-initials` em [src/styles/sections/professora.css](src/styles/sections/professora.css) se não for mais usada.

### 6. CNPJ no footer

Em [index.html](index.html) e [obrigado.html](obrigado.html): confirmar/atualizar o CNPJ no rodapé (`41.620.187/0001-03`).

### 7. OG image — SVG → PNG

[public/og.svg](public/og.svg) é a fonte. Facebook/WhatsApp/iMessage não renderizam SVG bem — converter para PNG 1200×630:

```bash
# librsvg (recomendado)
rsvg-convert -w 1200 -h 630 public/og.svg -o public/og.png

# ou Figma / Photoshop / cloudconvert.com manualmente
```

Depois trocar em [index.html](index.html):

```html
<meta property="og:image" content="/og.png" />
<meta property="og:image:type" content="image/png" />
<meta name="twitter:image" content="/og.png" />
```

---

## Setup no painel Eduzz

Antes do checkout funcionar, configurar na Eduzz:

1. **Criar o produto recorrente** com:
   - Nome: "Climb Pass — Assinatura Mensal"
   - Preço: R$ 99,90/mês
   - **Tipo: assinatura recorrente** (não pagamento único)
   - Periodicidade: mensal
   - Métodos de pagamento: cartão de crédito com cobrança recorrente
     (Pix recorrente fica desabilitado por enquanto — disponibilizar depois
     quando o fluxo estiver pronto)
   - Garantia: 7 dias
2. **Copiar o link único** (formato `https://sun.eduzz.com/{ID}`) e colar em [src/config.js](src/config.js) → `EDUZZ_CHECKOUT_URL`.
3. **Configurar `success_url`** no painel do produto apontando para `https://{seu-dominio}/obrigado.html`. Sem isso, o evento `purchase` não dispara e a métrica de conversão fica perdida.
4. *(Opcional)* Configurar webhook Eduzz para sincronizar status de assinatura com CRM/plataforma de conteúdo — fora do escopo desta LP.

---

## Tracking — eventos disparados

Todos via `dataLayer.push`. Tags GTM correspondentes configuradas no painel.

| Evento | Quando | Payload principal |
|---|---|---|
| `gtm.js` | Carregamento do GTM (auto) | — |
| `view_section` | Quando uma `<section[id]>` fica ≥50% visível | `section_name` |
| `scroll_depth` | 25 / 50 / 75 / 90% de scroll | `percent` |
| `cta_click` | Clique em qualquer `[data-cta]` | `section_name`, `cta_label` |
| `begin_checkout` | Mesmo clique acima (GA4 ecommerce) | `value: 99.90, currency: "BRL", items` |
| `purchase` | Carregamento de `/obrigado.html` | `transaction_id`, `value`, `currency`, `items` |

### Como debugar tracking

```bash
npm run dev
# Abrir DevTools → Console
window.dataLayer  // array de eventos
# Rolar a página, clicar em CTA — observar eventos novos
```

### Validar no GTM antes de publicar

1. Abrir GTM Preview Mode
2. Acessar a LP
3. Confirmar eventos chegando e tags Pixel/GA4 disparando

---

## Smoke test local

Após substituir os placeholders, rodar este checklist:

```bash
npm run build && npm run preview
# abre em http://localhost:4173
```

1. **Hero scaneável em 5s** — eyebrow + H1 + CTA + trust strip visíveis acima da dobra em 375px e 1280px.
2. **Sticky header desktop** — rolar 100px → header fica off-white com blur, marca passa para navy.
3. **Sticky CTA mobile** — em <1080px, rolar para fora do hero → barra navy aparece em baixo com R$ 99,90 + "Assinar".
4. **CTAs com tracking** — DevTools → Console → `window.dataLayer` → ver `gtm.js`. Clicar CTA → ver `cta_click` + `begin_checkout` com `value: 99.9`. Aba abre em `https://sun.eduzz.com/{ID}` (404 esperado com placeholder).
5. **UTMs preservadas** — `http://localhost:4173/?utm_source=test&utm_campaign=smoke` → clicar CTA → destino tem `?utm_source=test&utm_campaign=smoke`.
6. **`/obrigado.html?transactionId=TEST-123`** — `dataLayer` recebe `purchase` com `transaction_id: "TEST-123"` e `value: 99.9`.
7. **Acessibilidade Tab** — Tab a partir do topo → skip-link aparece → Enter pula para `#main` → tabular pelos CTAs, links, FAQ → focus-visible verde em tudo.
8. **FAQ nativo** — clicar em pergunta → expande com indicador "+/×" rotacionando. Funciona com teclado (Enter/Space).
9. **prefers-reduced-motion** — DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → transições ficam instantâneas.
10. **Lighthouse** — DevTools → Lighthouse → Mobile + Performance + A11y + Best Practices + SEO. Alvos: Performance ≥90, A11y 100, BP ≥95, SEO 100.

---

## Decisões de implementação

### Assinatura ≠ Curso fechado

O Climb Pass é um produto distinto do Curso de Entrada. Concorre mentalmente com Alura/Hotmart Club/Domestika, não com infoproduto pontual. Toda a copy, estrutura e CTAs foram reescritos para o modelo de assinatura — reaproveitando apenas a arquitetura técnica (Vite, design tokens, tracking, Eduzz integration).

### FAQ — `<details>/<summary>` nativo (sem JS)

Acessibilidade gratuita (teclado, leitor de tela). Indicador "+ / ×" via CSS no estado `[open]`. Zero JS — performance e simplicidade.

### Retrato da Marissa — placeholder SVG editorial

Até a foto real chegar, o `<div class="professora-portrait">` renderiza as iniciais "MG" em moldura navy + acento verde. Substituir por `<img>` quando disponível (instruções na seção 5 do checklist).

### Form ICP removido

A LP atual (Curso de Entrada) tinha modal Typeform com qualificação de ICP via Google Sheets. Para assinatura, não faz sentido: CTA vai direto para checkout, sem captura de lead intermediária. Modal, formulário e endpoint do Google Sheets foram removidos.

---

## Skills aplicadas

- **frontend-design** — direção estética, anti-AI-slop. Aplicada antes de codar cada seção.
- **landing-page-design** — above-the-fold formula, section order, CTA psychology.
- **copywriting** — headlines ≤12 palavras, leads ≤25, CTAs ação+valor.
- **page-cro** — auditoria de conversion rate optimization.
- **web-design-guidelines** — auditoria a11y/perf. Rodada antes de fechar cada sprint.

---

## Itens em aberto

- URL real do produto Eduzz recorrente (substitui `EDUZZ_CHECKOUT_URL`)
- Foto real da Marissa Guimarães (substitui retrato SVG placeholder)
- IDs reais GTM/GA4/Pixel/Clarity
- URL real do grupo de assinantes no WhatsApp (substitui `WHATSAPP_GROUP_URL`)
- Política de garantia (7 dias está no FAQ — confirmar política Climb4B)
