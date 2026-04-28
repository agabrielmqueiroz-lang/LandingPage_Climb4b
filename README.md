# Landing Page · Curso de Entrada Climb4B

Sales letter one-pager para vender o **Curso de Entrada de Finanças Empresariais** (R$ 299) com checkout via Eduzz.

Plano de execução completo: [Plano de Ação.md](./Plano%20de%20Ação.md).

## Stack

- **Vite** (vanilla — HTML + CSS + JS puro, sem framework)
- **Fraunces** (display) + **Inter** (body) via Google Fonts
- **GTM** orquestrando Meta Pixel + GA4 + Microsoft Clarity

## Requisitos

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
npm run dev      # localhost:5173
npm run build    # gera dist/
npm run preview  # serve dist/ localmente
```

## Estrutura

```
LandingPage_Climb4b/
├── index.html              # LP principal (10 seções + footer)
├── obrigado.html           # confirmação pós-Eduzz (Purchase event)
├── public/                 # assets estáticos (favicon, og.jpg, etc)
├── src/
│   ├── main.js             # entry da LP — CSS + tracking + observers
│   ├── obrigado.js         # entry da página de obrigado
│   ├── config.js           # ÚNICO lugar de URLs/IDs (substituir antes do go-live)
│   ├── checkout.js         # buildCheckoutUrl com UTM preservation
│   ├── tracking.js         # helpers de dataLayer.push
│   └── styles/
│       ├── tokens.css      # cores, tipografia, espaçamento
│       ├── base.css        # reset, focus-visible, prefers-reduced-motion
│       ├── typography.css  # hierarquia editorial + utilitários
│       ├── components/     # header, buttons, sticky-cta, footer
│       ├── sections/       # uma CSS por seção
│       └── pages/          # obrigado.css
├── .claude/skills/         # frontend-design + web-design-guidelines
├── .agents/skills/         # page-cro + copywriting + landing-page-design
├── Plano de Ação.md
├── package.json
└── vite.config.js
```

---

## ⚠️ Checklist pré go-live

Substituir TODOS os placeholders abaixo antes de subir em produção:

### 1. Eduzz checkout URL

Em [src/config.js](src/config.js):

```js
export const EDUZZ_CHECKOUT_URL = 'https://sun.eduzz.com/PLACEHOLDER';
//                                                       ^^^^^^^^^^^
```

→ Substituir `PLACEHOLDER` pelo ID real do produto criado no painel Eduzz.

### 2. IDs de tracking

Em [src/config.js](src/config.js):

```js
export const TRACKING = {
  GTM_ID: 'GTM-XXXXXXX',         // ← seu container GTM
  GA4_ID: 'G-XXXXXXXXXX',        // ← seu measurement ID GA4 (config no GTM)
  META_PIXEL_ID: '000000000000', // ← seu Pixel ID Meta (config no GTM)
  CLARITY_ID: 'XXXXXXXXXX',      // ← seu Clarity ID (config no GTM)
};
```

E nos snippets GTM hardcoded em **dois arquivos** (procurar por `GTM-XXXXXXX`):

- [index.html](index.html) — duas ocorrências (head script + body noscript)
- [obrigado.html](obrigado.html) — duas ocorrências (head script + body noscript)

Total: **4 substituições** do GTM_ID nos arquivos HTML.

### 3. Footer

Em [index.html](index.html) e [obrigado.html](obrigado.html):

- CNPJ: substituir `00.000.000/0001-00` pelo CNPJ real
- Links de Política de privacidade e Termos de uso: ajustar URLs reais

### 4. Author placeholder

Em [index.html](index.html), seção `#autoridade`, o `<figure data-placeholder>` exibe um SVG geométrico com badge "Foto real entra aqui".

→ Substituir o conteúdo do `<div class="author-portrait">` por `<img>` real e remover o atributo `data-placeholder` da `<figure>`.

### 5. OG image — SVG → PNG

[public/og.svg](public/og.svg) é a fonte de design (criado no Sprint 5). Para máxima compatibilidade com Facebook/WhatsApp/iMessage (que não renderizam SVG bem), converter para PNG/JPG 1200×630:

```bash
# Opção 1: usar Figma/Photoshop manualmente — exportar como og.png
# Opção 2: linha de comando com librsvg
rsvg-convert -w 1200 -h 630 public/og.svg -o public/og.png

# Opção 3: usar serviço online (cloudconvert, svgtopng.com)
```

Depois trocar em [index.html](index.html):

```html
<meta property="og:image" content="/og.png" />
<meta property="og:image:type" content="image/png" />
<meta name="twitter:image" content="/og.png" />
```

[public/favicon.svg](public/favicon.svg) já está pronto — marca navy + verde.

### 6. Onde obter cada ID/URL

| Placeholder | Onde obter |
|---|---|
| `EDUZZ_CHECKOUT_URL` | Painel Eduzz → produto criado → link de checkout |
| `GTM_ID` | Tag Manager → container → Admin → IDs |
| `GA4_ID` | Google Analytics → Admin → fluxo de dados |
| `META_PIXEL_ID` | Meta Business → Eventos → Pixels |
| `CLARITY_ID` | Microsoft Clarity → Setup → tag de instalação |

---

## ⚙️ Setup no painel Eduzz

Antes do checkout funcionar, alguém precisa configurar:

1. **Criar o produto na Eduzz** com:
   - Nome: "Curso de Entrada — Finanças Empresariais"
   - Preço: R$ 299
   - Parcelamento: até 12x no cartão
   - Tipo: Produto digital

2. **Copiar o link único** que a Eduzz gera (formato `https://sun.eduzz.com/{ID}`) e colar em [src/config.js](src/config.js) → `EDUZZ_CHECKOUT_URL`.

3. **Configurar `success_url`** no painel do produto Eduzz apontando para `https://{seu-dominio}/obrigado.html`. Sem isso, o evento `purchase` não dispara e métrica de conversão fica perdida.

4. *(Opcional)* Configurar webhook Eduzz para integração com CRM/email marketing — fora do escopo desta LP.

---

## 📊 Tracking — eventos disparados

Todos via `dataLayer.push`. Configurar tags GTM correspondentes para disparar Pixel/GA4/Clarity.

| Evento | Quando | Payload |
|---|---|---|
| `gtm.js` | Carregamento do GTM (auto) | — |
| `view_section` | Quando uma `<section[id]>` fica ≥50% visível | `section_name: "hero"` |
| `scroll_depth` | 25 / 50 / 75 / 90% de scroll | `percent: 50` |
| `cta_click` | Clique em qualquer `[data-cta]` | `section_name`, `cta_label` |
| `begin_checkout` | Mesmo clique acima (GA4 ecommerce) | `value: 299, currency: "BRL", items: [...]` |
| `purchase` | Carregamento de `/obrigado.html` | `transaction_id, value, currency, items: [...]` |

### Como debugar tracking

```bash
# 1. Rodar dev
npm run dev

# 2. Abrir DevTools → Console
# 3. Inspecionar dataLayer
window.dataLayer
# → array de eventos

# 4. Rolar a página, clicar em CTA — ver eventos novos
```

### Validar no GTM antes de publicar

1. Abrir GTM Preview Mode
2. Acessar a LP
3. Ver eventos chegando no painel "Variables" e "Events" do GTM
4. Confirmar que tags Pixel/GA4 disparam nas condições corretas

---

## 🧪 Smoke test (5 min antes de subir)

Depois de substituir todos os placeholders, rodar este checklist no navegador:

```bash
npm run build && npm run preview
```

Abre em `http://localhost:4173`. Validar:

1. **Hero scaneável em 5s** — eyebrow + H1 + CTA + microcopy aparecem acima da dobra em desktop e mobile (375px).
2. **Sticky header** — rolar 100px → header fica off-white com blur, marca passa para navy.
3. **Sticky CTA mobile** — em viewport <1080px, rolar para fora do hero → barra navy aparece em baixo com R$ 299 + "Garantir vaga".
4. **CTAs com tracking** — abrir DevTools → Console → `window.dataLayer` → ver `gtm.js`. Clicar qualquer CTA → ver `cta_click` + `begin_checkout`. Aba abre em `https://sun.eduzz.com/{ID}` (vai dar 404 se ainda for placeholder — esperado).
5. **UTMs preservadas** — abrir `http://localhost:4173/?utm_source=test&utm_campaign=smoke` → clicar CTA → confirmar que destino tem `?utm_source=test&utm_campaign=smoke`.
6. **`/obrigado.html?transactionId=TEST-123`** — `dataLayer` recebe `purchase` event com `transaction_id: "TEST-123"`.
7. **Acessibilidade Tab** — Tab a partir do topo → skip-link aparece → Enter pula para `#main` → continuar tabulando → CTA, links e detalhes do FAQ ganham focus-visible verde.
8. **FAQ nativo** — clicar em pergunta → abre com chevron rotacionando 180°. Funciona com teclado (Enter/Space).
9. **prefers-reduced-motion** — DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → animações de entrada do hero somem, transições ficam instantâneas.
10. **Lighthouse** — DevTools → Lighthouse → Mobile + Performance + A11y + Best Practices + SEO. Alvos: Performance ≥90, A11y 100, BP ≥95, SEO 100.

---

## 🤔 Decisões de implementação documentadas

### FAQ — `<details>/<summary>` nativo (sem JS)

**Decisão (Sprint 6):** mantido o elemento HTML nativo, com chevron via pseudo-elemento CSS rotacionando em `details[open]`.

**Por quê:**
- Acessibilidade nativa (teclado, leitor de tela, sem ARIA manual)
- Zero JS necessário — performance e simplicidade
- Funciona sem JavaScript habilitado
- A regra do `web-design-guidelines` que diz "use semantic HTML antes de ARIA" se aplica perfeitamente

**Trade-off conhecido:** alguns leitores de tela mais antigos podem anunciar o `<h3>` dentro do `<summary>` de forma um pouco inconsistente, mas isso é aceito por axe-core e WCAG. Se aparecer demanda real, refatorar para `<button aria-expanded>` + container animado.

### Trust strip do hero — microcopy em vez de card

**Decisão (Sprint 2.5):** removido o card `.trust-strip` original; autoridade above-the-fold passou a ser a microcopy `.cta-microcopy--auth` com ícone star verde.

**Por quê:** o card pesava demais visualmente e competia com o H1. A microcopy preserva o sinal de social proof prescrito pela `landing-page-design` skill ("posição 2 = social proof") sem inflar a área above-the-fold.

### Reorder de seções — Autoridade na posição 2 (em vez de 3)

**Decisão (Sprint 2.5, pós-auditoria):** seção `#autoridade` movida de #3 para #2 (logo após hero), antes de Dor.

**Por quê:** `landing-page-design` prescreve "social proof imediatamente após hero". Como não temos depoimentos ainda (turma fundadora), `#autoridade` substitui esse papel. PAS clássico (Problem → Agitate → Solution) cede para a regra de cold-traffic landing page.

### OG image em SVG (não PNG)

**Decisão (Sprint 5):** entregue [public/og.svg](public/og.svg) como source of truth. Twitter/X/LinkedIn rendem SVG, mas Facebook/WhatsApp/iMessage exigem PNG.

**Ação pendente para o time:** converter para `og.png` antes do go-live (instruções na seção 5 do checklist acima).

---

## 🛠️ Skills aplicadas

- **frontend-design** — direção estética, anti-AI-slop. Aplicar antes de codar cada seção.
- **web-design-guidelines** — auditoria a11y/perf. Rodar antes de marcar qualquer task como concluída.
- **landing-page-design** — above-the-fold formula, structure, CTA psychology
- **copywriting** — headline/CTA writing, princípios de conversão
- **page-cro** — auditoria de conversion rate optimization

---

## 📝 Histórico de sprints

- ✅ Sprint 1 — Fundação (tokens, base, tipografia)
- ✅ Sprint 2 — Esqueleto semântico
- ✅ Sprint 2.5 — Reescrita + reordenação (pós-auditoria)
- ✅ Sprint 3 — Visual de 10 seções
- ✅ Sprint 4 — Plumbing comercial (Eduzz + GTM + tracking)
- ⏳ Sprint 5 — Polimento (OG image, lazy load, Lighthouse, page-cro final)
- ⏳ Sprint 6 — Handoff final (build + revisão completa do checklist)
