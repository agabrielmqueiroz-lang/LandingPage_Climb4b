# Landing Page — Curso de Entrada Climb4B (R$ 299)

## Contexto

Climb4B vai lançar o **Curso de Entrada de Finanças Empresariais** a R$ 299 como porta de entrada para o curso premium (R$ 1.998). O material estratégico está em [Planejamento_Estrategico_Curso_Entrada.pdf](C:\Users\Gabriel\Downloads\Planejamento_Estrategico_Curso_Entrada.pdf) e define: posicionamento (CFO em atuação), 3 pilares de diferenciação, grade de 5 aulas, 3 públicos-alvo, bônus, cenários de receita e meta de 300–1.000 alunos na primeira turma.

**Objetivo desta tarefa:** entregar uma landing page **one-page** de venda direta cujo único job é converter visitante → checkout Eduzz no plano de R$ 299 — funil principal do degrau 2 da escada de valor.

**Decisões já tomadas (via clarificações):**

- Stack: **Vite + HTML/CSS/JS puro** (sem React) — máxima performance, zero overhead, ideal para sales letter
- Eduzz URL: **placeholder** centralizado em `src/config.js` (produto ainda não criado na Eduzz)
- Tracking: **GTM + Meta Pixel + GA4 + Microsoft Clarity** (todos via container GTM único)
- Hospedagem: **agnóstica** — entregar `dist/` estático buildado, deploy fica fora desta tarefa
- Pasta destino: `c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\` — **fora** do `prototype/`. Do `prototype/` herdamos apenas as duas skills de design via cópia local (frontend-design + web-design-guidelines).

---

## Direção estética

Tom: **editorial executivo**, herdado da identidade visual do PDF estratégico — paleta navy + verde, tipografia hierárquica densa, ar de relatório de board adaptado para sales letter. Não é "SaaS template". Não é "infoproduto colorido". É **CFO em atuação falando com tomadores de decisão**.

Aplicar [frontend-design SKILL](c:\Users\Gabriel\Desktop\Climb4b\prototype\.claude\skills\frontend-design\SKILL.md) **antes** de codar cada seção: declarar a direção em comentário no topo do bloco e cometer com ela.

**Tokens visuais base:**
- Cor primária: `--navy-900: #0F1E3D` (fundo escuro / headings)
- Cor secundária: `--navy-700: #1B2B5C` (cards / divisores)
- Acento: `--green-500: #2EBE5A` (CTAs / destaques numéricos)
- Acento alt: `--green-300: #7BD89A` (highlights tipográficos)
- Neutro: `--off-white: #F7F8F5`, `--ink: #0A1124`, `--mute: #5C6680`
- Tipografia display: serifada com personalidade (sugestão: **Fraunces** ou **Source Serif 4**) para H1/H2
- Tipografia body: **Inter** ou **Open Sans** (consistente com o prototype) — peso 400/500/600
- Numerais: `font-variant-numeric: tabular-nums` em qualquer coluna numérica (R$ 299, 5 aulas, 60% margem)
- Anti-padrões a evitar (skill): gradientes roxo→rosa, três cards centralizados, rounded-everything + sombras "SaaS"

---

## Estrutura da página (one-pager)

A forma do [VDL Exame](https://lps.exame.com/vdl-pre-mba-financas) é referência — não dogma. A ordem abaixo segue a regra do `landing-page-design` (social proof logo após hero) combinada com PAS (problem → agitation → solution) a partir da posição 3, adaptada ao conteúdo imutável do PDF:

| # | Seção | Conteúdo (do PDF) | Função |
|---|---|---|---|
| 1 | **Hero** | Headline curta (≤12 palavras) + sub com promessa em 5 aulas + CTA primário + trust strip "CFO em atuação" | Hook + intent capture + sinal de autoridade above-the-fold |
| 2 | **Autoridade (Quebra de objeção)** | "Não é mais um curso. É o método de quem executa." Pilar 1 (CFO em atuação) | Social proof substituto + diferenciação |
| 3 | **Dor** | "Por que sua empresa pode ter lucro e ainda assim apertar no caixa" (Aula 1) ampliado em 3 dores espelhando os 3 públicos (PME/contador/analista) | Agitation + qualificação |
| 4 | **Método** | Leitura conectada DRE + Balanço + Fluxo de Caixa (Pilar 2) — diagrama visual dos 3 demonstrativos integrados | Mecanismo único |
| 5 | **O que você vai aprender** | Grade das 5 aulas (PDF 6.2) — cards expansíveis com bullets | Concretude |
| 6 | **Para quem é** | 3 públicos com headlines do PDF 7.1 ("Pare de decidir no achismo" / "Pense como CFO" / "Acelere para CFO") | Auto-seleção do lead |
| 7 | **Bônus** | Planilha de diagnóstico + comunidade + Q&A ao vivo + 12 meses de acesso (PDF 6.1) | Aumentar valor percebido |
| 8 | **Oferta** | R$ 299 à vista ou 12x · ancoragem visual do premium R$ 1.998 · garantia · escassez (turma fundadora) · CTA Eduzz | Pitch + close |
| 9 | **FAQ** | 6–8 perguntas que neutralizam objeções (preço, formato gravado, certificado, suporte, pode pagar com PJ, garantia, upgrade premium) | Última fricção |
| 10 | **CTA final** | Repetição da oferta + CTA Eduzz + assinatura "Leandro Ribeiro · COO · Climb4B" | Last call |
| 11 | **Footer** | CNPJ, política, contato, redes Climb4B | Compliance |

**Princípio:** o **conteúdo** é imutável (vem do PDF). A **forma** segue a skill de design — usar assimetria, sobreposição, números dominantes (`R$ 299` em display gigante), citações destacadas (Porter/Ansoff/Drucker do PDF como elementos editoriais).

**Fora do escopo desta página:** isca grátis (degrau 1) e pitch do premium (degrau 3). Esta LP é dedicada ao degrau 2.

---

## Integração com Eduzz — como funciona

Eduzz Checkout opera por **link único de produto**, no padrão `https://sun.eduzz.com/{ID_PRODUTO}` ou `https://chk.eduzz.com/...`. Não há SDK nem iframe — é redirect. O fluxo é:

```
[Lead clica CTA na LP] → [redirect Eduzz checkout] → [Eduzz processa pagamento]
                                                       ↓
                                            [Eduzz redireciona para
                                             página de obrigado configurada
                                             no painel Eduzz]
```

**Implementação:**

1. **Config central** em [src/config.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\config.js):
   ```js
   export const EDUZZ_CHECKOUT_URL = 'https://sun.eduzz.com/PLACEHOLDER';
   export const PRODUCT = { name: 'Curso de Entrada — Finanças Empresariais', price: 299, currency: 'BRL' };
   ```
2. **Todos os CTAs** apontam para `EDUZZ_CHECKOUT_URL` via `<a href>` (não `<button onClick>`) — preserva Cmd/Ctrl+click, middle-click, copiar link (regra da [web-design-guidelines](c:\Users\Gabriel\Desktop\Climb4b\prototype\.claude\skills\web-design-guidelines\SKILL.md)).
3. **Atributos:** `target="_blank"` + `rel="noopener noreferrer"`.
4. **UTMs preservadas:** ler `window.location.search` no carregamento e anexar à `EDUZZ_CHECKOUT_URL` antes do redirect — campanhas Meta Ads/orgânico precisam atribuir conversão.
5. **Página de obrigado** (`/obrigado.html`): página separada simples que **dispara o evento Purchase** (Pixel + GA4) e é configurada como `success_url` no painel Eduzz. Sem ela, não há tracking de conversão real.

**O que precisa ser feito FORA do código** (para o Leandro/equipe Eduzz, documentar no README da LP):
- Criar produto na Eduzz com preço R$ 299 e parcelamento 12x
- Configurar `success_url` apontando para o `/obrigado.html` desta LP hospedada
- (Opcional) configurar webhook de Eduzz para CRM/email marketing — fora desta tarefa

---

## Tracking — arquitetura

**Padrão único:** todos os pixels orquestrados por um container **GTM**. Código da LP só faz `dataLayer.push(...)` — Pixel/GA4/Clarity são tags configuradas no painel GTM, sem precisar mexer no código para adicionar/trocar pixel.

**IDs como placeholders em [src/config.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\config.js):**
```js
export const TRACKING = {
  GTM_ID: 'GTM-XXXXXXX',
  GA4_ID: 'G-XXXXXXXXXX',     // configurado dentro do GTM, mas fica registrado
  META_PIXEL_ID: '000000000000',
  CLARITY_ID: 'XXXXXXXXXX',
};
```

**Eventos a disparar** (em `src/tracking.js`):

| Evento | Quando | Payload |
|---|---|---|
| `page_view` | Carregamento (automático GA4) | path, referrer, utm_* |
| `scroll_depth` | 25/50/75/90% scroll | percent |
| `view_section` | IntersectionObserver em cada `<section>` | section_name |
| `cta_click` | Clique em qualquer CTA antes do redirect | section_name (qual CTA), cta_label |
| `begin_checkout` | Mesmo clique (eventos diferentes — `begin_checkout` é GA4 ecommerce) | value: 299, currency: BRL, items: [...] |
| `purchase` | Em `/obrigado.html` | transaction_id (de query string Eduzz), value, currency |

**Meta Pixel correspondente** (configurado no GTM como tags filhas dos eventos acima):
- `PageView` automático
- `InitiateCheckout` no `cta_click`
- `Purchase` no carregamento de `/obrigado.html`

---

## Etapas de implementação

Cada etapa entrega um artefato verificável. As skills de design são pré-requisito de cada etapa que toca UI.

### Etapa 1 — Setup do projeto Vite vanilla

**Entregas:**
- Pasta `c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\` criada
- `npm create vite@latest . -- --template vanilla` (vanilla, **não** vanilla-ts — JS puro)
- `package.json` com scripts `dev`, `build`, `preview`
- `.gitignore`, `README.md` com instruções de execução, deploy e o que precisa ser feito no painel Eduzz
- Cópia local das duas skills (`frontend-design`, `web-design-guidelines`) em `.claude/skills/` da nova pasta — para iterações futuras manterem o contrato vigente

**Verificação:** `npm install && npm run dev` abre página vazia em `localhost:5173` sem erros.

### Etapa 2 — Sistema de design e tokens

**Entregas:**
- [src/styles/tokens.css](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\styles\tokens.css): variáveis de cor, tipografia (escala xs/sm/base/md/lg/xl/2xl/display), espaçamento (escala 4/8/12/16/24/32/48/64/96/128), radius, sombras, breakpoints
- [src/styles/base.css](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\styles\base.css): reset, defaults tipográficos, link styles, focus-visible global
- [src/styles/typography.css](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\styles\typography.css): classes utilitárias (`.eyebrow`, `.display`, `.lead`, `.quote`)
- Fontes carregadas via `<link>` em `index.html` com `preconnect` + `font-display: swap`
- `color-scheme`, `prefers-reduced-motion` reset, `@media (prefers-reduced-motion: reduce)` global

**Verificação:** abrir página de teste com elementos H1/H2/H3/P/quote e ver hierarquia clara, sem font-size < 12px (regra do prototype CLAUDE.md).

### Etapa 3 — Estrutura HTML semântica

**Entregas:**
- [index.html](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\index.html) com `<header>`, 11 `<section>` (uma por bloco da estrutura), `<footer>`
- Skip-link `<a href="#main">` no topo
- Hierarquia de headings `<h1>` (hero) → `<h2>` (cada section) → `<h3>` (subitens)
- Conteúdo textual literal do PDF inserido em todas as seções (sem placeholder lorem)
- Meta tags: `<title>`, `<meta description>`, OG tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`), Twitter Card, `<link rel="canonical">`, `theme-color`
- `viewport` sem `user-scalable=no` (anti-pattern da skill)
- `lang="pt-BR"`

**Verificação:** validar via [validator.w3.org](https://validator.w3.org/), checar que content-outline (estrutura de headings) está coerente, todas as imagens têm `width`/`height`/`alt`.

### Etapa 4 — Implementação visual, seção por seção

**Para cada uma das 11 seções:**
1. Declarar direção estética em comentário no topo do bloco (ex.: `/* Hero — editorial executivo, número R$ 299 dominante, fundo navy com noise texture */`)
2. Implementar HTML + CSS aplicando: assimetria deliberada (não cards centralizados em fila), tipografia display para números-âncora (`R$ 299`, `5 aulas`, `R$ 1.998` como ancoragem visual), citações Porter/Ansoff/Drucker como elementos editoriais
3. CTAs (`<a class="btn-primary" href={EDUZZ_CHECKOUT_URL}>`) com hover/active/focus-visible distintos
4. Mobile-first; breakpoints em 720px e 1080px

**Verificação por seção:**
- Visual smoke test no `npm run dev` em três tamanhos: 375px, 768px, 1280px
- `prefers-reduced-motion: reduce` desliga animações
- Contraste WCAG AA em todos os textos (testar com [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))

### Etapa 5 — Animações e microinterações

**Entregas:**
- Reveal on scroll via `IntersectionObserver` (não scroll listener) — cada `<section>` ganha `.is-visible` quando intersecta, transições só em `transform` e `opacity`
- Hover states ricos em CTAs, cards de aula e cards de público
- Animações **interrompíveis** — usuário rola e a animação não trava
- Zero `transition: all`, zero `outline: none` sem substituto

**Verificação:** auditoria explícita contra a seção "Animation" da [web-design-guidelines](c:\Users\Gabriel\Desktop\Climb4b\prototype\.claude\skills\web-design-guidelines\SKILL.md).

### Etapa 6 — Integração Eduzz

**Entregas:**
- [src/config.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\config.js) com `EDUZZ_CHECKOUT_URL`, `PRODUCT`, `TRACKING`
- [src/checkout.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\checkout.js): função `buildCheckoutUrl()` que pega a URL base e anexa UTMs da `window.location.search`
- Todos os CTAs (`<a data-cta="...">`) recebem listener delegado em `main.js`: dispara tracking e atualiza `href` para a URL com UTMs antes do clique navegar
- [obrigado.html](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\obrigado.html): página simples de "Compra confirmada" + tracking de Purchase
- Documentar no README da LP: passos para criar produto na Eduzz, configurar `success_url` apontando para `/obrigado.html`, opcionais (webhook, integração CRM)

**Verificação:** clicar em qualquer CTA com a URL placeholder e confirmar redirect para `https://sun.eduzz.com/PLACEHOLDER?utm_source=...` com UTMs preservadas. Console mostra evento disparado antes do redirect.

### Etapa 7 — Tracking (GTM + dataLayer)

**Entregas:**
- Snippet GTM `<head>` e `<body>` em `index.html` e `obrigado.html` (com `TRACKING.GTM_ID` placeholder — substituir antes de produção)
- [src/tracking.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\tracking.js): helpers `track(event, payload)`, `trackScrollDepth()`, `trackSectionView(name)`, `trackCtaClick(section, label)`
- Inicialização em `main.js`: scroll depth observer, IntersectionObserver para `view_section`, listener delegado para `[data-cta]`
- README.md documenta IDs placeholder e onde substituir

**Verificação:** abrir DevTools → Console e rodar `dataLayer` — ver eventos `view_section` ao rolar, `cta_click` + `begin_checkout` ao clicar CTA. Testar GTM Preview Mode antes de publicar tags reais.

### Etapa 8 — SEO, performance e acessibilidade

**Entregas:**
- OG image 1200×630 em `public/og.jpg` (gerar mockup editorial — fundo navy + título + selo Climb4B)
- Favicon SVG + PNG fallback
- Imagens otimizadas (WebP/AVIF com `<picture>`), `loading="lazy"` em tudo abaixo do fold, `fetchpriority="high"` no hero
- `<link rel="preload" as="font">` nas duas fontes críticas
- JSON-LD `@type: Course` no `<head>` (melhora rich snippets do Google para cursos)

**Verificação:**
- Lighthouse no `npm run preview`: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO = 100
- Testar em throttle "Slow 4G" no DevTools — LCP < 2.5s
- `npx pa11y http://localhost:4173` ou audit manual com NVDA/VoiceOver

### Etapa 9 — Auditoria final com web-design-guidelines

**Entregas:**
- Rodar a checklist da [web-design-guidelines SKILL](c:\Users\Gabriel\Desktop\Climb4b\prototype\.claude\skills\web-design-guidelines\SKILL.md) contra todos os arquivos tocados
- Output em formato `file:line - finding`
- Corrigir cada `✗` antes de declarar conclusão

**Itens de risco específicos a checar:**
- `<button>` para ações vs `<a>` para CTAs Eduzz (são navegação — devem ser `<a>`)
- Todos os ícones `aria-hidden="true"`
- `…` em vez de `...`, aspas curvas, `&nbsp;` em "R$&nbsp;299"
- Inputs (se tiver newsletter no footer) com `autocomplete`, `name`, `type` correto
- `tabular-nums` em todos os números monetários

### Etapa 10 — Build e handoff

**Entregas:**
- `npm run build` produzindo `dist/` minificado
- README.md com:
  - Como rodar dev (`npm run dev`)
  - Como buildar (`npm run build`)
  - Lista de IDs/URLs a substituir antes do go-live (Eduzz URL, GTM ID, GA4 ID, Pixel ID, Clarity ID)
  - Passos no painel Eduzz (criar produto, configurar success_url)
  - Notas sobre tracking (eventos disparados, como debugar)
- Verificação final: `npm run preview` em modo produção e nova passada de Lighthouse

**Verificação:** `dist/` contém HTML minificado + assets com hash, abre standalone em qualquer servidor estático sem erros.

---

## Status de execução (encerrado em 2026-04-28)

Todas as 7 sprints concluídas. Página entregue em `dist/`, pronta para deploy estático após substituição dos placeholders documentados no [README.md → Checklist pré go-live](README.md#%EF%B8%8F-checklist-pr%C3%A9-go-live).

| Sprint | Status | Entrega |
|---|---|---|
| 1 — Fundação | ✅ | Vite + design tokens + base + tipografia |
| 2 — Esqueleto | ✅ | `index.html` semântico com conteúdo literal do PDF |
| 2.5 — Reescrita + reordenação | ✅ | Cortes agressivos de copy + reorder Autoridade→2 + trust strip |
| 3 — Visual (10 seções) | ✅ | Todas as seções com direção estética declarada, sticky CTA mobile, pricing card |
| 4 — Plumbing comercial | ✅ | Eduzz + GTM + tracking (cta_click, begin_checkout, view_section, scroll_depth, purchase) |
| 5 — Polimento | ✅ | favicon.svg, og.svg, font preloads, auditoria limpa, Quick Win do guarantee badge |
| 6 — Handoff | ✅ | README com smoke test + decisões documentadas, build final 26 módulos / 9.4KB gzip |

---

## Sprints de execução

As 10 etapas acima são uma decomposição **formal**. Para execução prática, agrupo em **6 sprints** porque o tamanho real das etapas é muito desigual — Etapa 4 (visual) sozinha vale ~60% do trabalho total e merece ser quebrada em 11 mini-sprints (um por seção da página).

| Sprint | Etapas do plano | Esforço | O que entrega |
|---|---|---|---|
| **1. Fundação** | 1 + 2 | Pequeno | Projeto Vite rodando + tokens/base CSS + fontes carregadas. Checkpoint visual: página de teste com hierarquia tipográfica. |
| **2. Esqueleto** | 3 | Médio | `index.html` + `obrigado.html` com toda a estrutura semântica e o conteúdo literal do PDF (sem CSS de seção ainda — só a base). Página feia mas com 100% do texto. |
| **2.5. Reescrita + reordenação** | 3.5 *(novo, pós-auditoria)* | Pequeno | Texto agressivamente cortado (H1 ≤12 palavras, leads ≤25), CTAs padronizados, seção Autoridade movida para posição 2 (logo após hero), trust strip adicionado no hero. Sem CSS — só texto e estrutura. **Aplica skills `copywriting` + `landing-page-design`.** Output: index.html pronto para review de conteúdo no Checkpoint #1. |
| **3. Visual (o grosso do trabalho)** | 4 + 5 | **Grande** — quebrar em 10 mini-sprints, um por seção: Hero → Autoridade → Dor → Método → Aulas → Públicos → Bônus → Oferta → FAQ → CTA final. Cada mini entrega uma seção visualmente fechada com animações. **Inclui:** placeholder SVG geométrico no hero, sticky CTA mobile, pricing card com R$ 299 em display dominante + R$ 1.998 ancorado, diagrama do método (3 demonstrativos conectados), color blocks navy/verde, badges, decisão sobre `<details>` no FAQ (manter nativo ou refatorar com JS). |
| **4. Plumbing comercial** | 6 + 7 | Médio | `config.js`, `checkout.js`, `tracking.js`, snippet GTM, todos os CTAs ligados ao Eduzz com UTM e `dataLayer` instrumentado. Checkpoint: clicar em qualquer CTA dispara eventos no console e redireciona. |
| **5. Polimento** | 8 + 9 | Médio | OG image, JSON-LD, lazy loading, preload de fonts + auditoria completa contra `web-design-guidelines` + **rodada final de `page-cro` aplicando Quick Wins identificadas**. Lighthouse na meta. |
| **6. Handoff** | 10 | Pequeno | `npm run build` + README com checklist de IDs/URLs a substituir + passos do painel Eduzz. **Inclui checklist pré-go-live:** trocar `<meta name="robots">` para staging vs prod, validar JSON-LD em [search.google.com/test/rich-results](https://search.google.com/test/rich-results), substituir trust strip "esta semana" se ficar desatualizado. |

### Onde está o risco de tempo

- **Sprint 3 é ~60% do trabalho total.** Cada uma das 10 seções tem direção estética declarada, layout custom, animação e responsivo — não é template-driven. É onde a skill `frontend-design` mais pesa (evitar AI slop) e onde a maioria dos ciclos de feedback acontece.
- Sprints 1, 2, 2.5 e 6 são rápidos (poucas horas cada).
- Sprints 4 e 5 são médios mas previsíveis.

### Por que existe um Sprint 2.5

Após o Sprint 2 entregar o esqueleto com o conteúdo literal do PDF, uma auditoria com as skills `landing-page-design`, `copywriting` e `page-cro` revelou que o conteúdo precisa de um passe focado de reescrita antes do trabalho visual começar:

- Headlines com 16–18 palavras (skill manda 6–12)
- Lead paragraphs com 30–50 palavras (skill manda ≤25)
- CTA copy inconsistente entre header, hero, oferta e cta-final
- Ordem das seções não respeita "social proof após hero" do `landing-page-design`

Misturar essa reescrita ao Sprint 3 (visual) significaria trocar de marcha entre disciplinas (texto ↔ layout) em cada seção. Sprint 2.5 separa: texto + estrutura primeiro, visual depois com terreno limpo.

### Checkpoints com o stakeholder

Para evitar esperar até o fim e descobrir desalinhamento, pausar para review **3 vezes**:

1. **Final do Sprint 2.5** *(reposicionado da auditoria)* — página inteira com texto **cortado** e seções **na ordem final**, sem estilo: valida se o conteúdo está realmente como esperado antes de investir em design.
2. **Após as 3 primeiras seções do Sprint 3** (Hero + Autoridade + Dor) — valida a direção visual antes de replicá-la nas outras 7 seções.
3. **Final do Sprint 4** — testar o fluxo clique → Eduzz com URL placeholder e ver os eventos no `dataLayer`.

---

## Arquivos críticos

| Caminho | Responsabilidade |
|---|---|
| [LandingPage_Climb4b/index.html](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\index.html) | Estrutura HTML completa da one-pager |
| [LandingPage_Climb4b/obrigado.html](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\obrigado.html) | Página de confirmação pós-Eduzz com tracking de Purchase |
| [LandingPage_Climb4b/src/main.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\main.js) | Entry — inicializa tracking, observers, CTA handlers |
| [LandingPage_Climb4b/src/config.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\config.js) | Único lugar de URLs/IDs — Eduzz, GTM, GA4, Pixel, Clarity |
| [LandingPage_Climb4b/src/checkout.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\checkout.js) | `buildCheckoutUrl()` com preservação de UTM |
| [LandingPage_Climb4b/src/tracking.js](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\tracking.js) | Helpers de `dataLayer.push` para todos os eventos |
| [LandingPage_Climb4b/src/styles/tokens.css](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\styles\tokens.css) | Design tokens — cor, tipografia, espaçamento |
| [LandingPage_Climb4b/src/styles/sections/*.css](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\src\styles\sections\) | Um arquivo CSS por seção, com direção estética declarada |
| [LandingPage_Climb4b/.claude/skills/](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\.claude\skills\) | Cópia local de frontend-design + web-design-guidelines (contrato vigente) |
| [LandingPage_Climb4b/README.md](c:\Users\Gabriel\Desktop\Climb4b\LandingPage_Climb4b\README.md) | Como rodar/buildar + checklist de IDs/URLs a trocar antes do go-live + passos no painel Eduzz |

---

## Verificação end-to-end

Antes de declarar a tarefa concluída:

1. **Funcional:** `npm run dev`, percorrer a página inteira nos breakpoints 375/768/1280, clicar todos os CTAs e ver redirect para a URL Eduzz com UTMs preservadas (com placeholder retornando 404 — esperado).
2. **Tracking:** abrir DevTools, rolar a página, clicar CTA — verificar que `window.dataLayer` contém eventos `view_section`, `scroll_depth`, `cta_click`, `begin_checkout` com payload correto.
3. **Acessibilidade:** navegar a página inteira só com Tab/Shift+Tab — focus-visible em tudo, skip-link funciona, ordem de tabulação faz sentido.
4. **Performance:** `npm run build && npm run preview`, Lighthouse mobile + desktop. Alvos: Performance ≥ 90, Accessibility 100, SEO 100, LCP < 2.5s, CLS < 0.1.
5. **Auditoria de skill:** passada explícita da [web-design-guidelines SKILL](c:\Users\Gabriel\Desktop\Climb4b\prototype\.claude\skills\web-design-guidelines\SKILL.md) com output `file:line - finding` e zero `✗` pendente.
6. **Build limpo:** `dist/` aberto em `npx serve dist` funciona standalone sem 404 de assets.

---

## Itens em aberto (a serem resolvidos durante a execução, não bloqueantes do plano)

- URL real do checkout Eduzz (substitui `EDUZZ_CHECKOUT_URL`)
- IDs reais de GTM, GA4, Meta Pixel, Microsoft Clarity (substitui em `TRACKING`)
- OG image final (mockup editorial — pode ser gerado durante a Etapa 8)
- Domínio/host (decidido pelo Leandro/equipe — não bloqueia o build)
- Texto exato dos depoimentos/social proof: o PDF não traz depoimentos. **Decisão de execução:** não incluir seção de depoimentos na primeira versão (não inventar) — substituir por bloco de "autoridade" reforçando a CFO em atuação. Quando houver depoimentos reais da turma fundadora, adicionar como Etapa 11 pós-lançamento.
