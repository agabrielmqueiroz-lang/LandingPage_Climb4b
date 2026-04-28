---
name: web-design-guidelines
description: Audit and enforce Vercel's Web Interface Guidelines (accessibility, focus, forms, animation, typography, performance, i18n, hydration) on any file touched during a UI refactor. Run before marking any UI task complete.
source: https://skills.sh/vercel-labs/agent-skills/web-design-guidelines
upstream: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
---

# Web Interface Guidelines

Review any file touched during a UI change against these rules. Output findings in concise `file:line` format. Sacrifice grammar for brevity.

## Rules

### Accessibility
- Icon-only buttons need `aria-label`.
- Form controls need `<label>` or `aria-label`.
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`).
- `<button>` for actions, `<a>`/`<Link>` for navigation — never `<div onClick>`.
- Images need `alt` (or `alt=""` if decorative).
- Decorative icons need `aria-hidden="true"`.
- Async updates (toasts, validation) need `aria-live="polite"`.
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<table>`) before ARIA.
- Headings hierarchical `<h1>`–`<h6>`; include a skip-link for main content.
- `scroll-margin-top` on heading anchors.

### Focus States
- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent.
- Never `outline-none` / `outline: none` without a focus replacement.
- Prefer `:focus-visible` over `:focus` (avoid focus ring on click).
- Group focus with `:focus-within` for compound controls.

### Forms
- Inputs need `autocomplete` and a meaningful `name`.
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`.
- Never block paste.
- Labels clickable (`htmlFor` or wrapping control).
- Disable spellcheck on emails/codes/usernames (`spellCheck={false}`).
- Checkboxes/radios: label + control share a single hit target.
- Submit button stays enabled until request starts; spinner during request.
- Errors inline next to fields; focus the first error on submit.
- Placeholders end with `…` and show an example pattern.
- `autocomplete="off"` on non-auth fields to avoid password-manager triggers.
- Warn before navigation with unsaved changes.

### Animation
- Honor `prefers-reduced-motion` (provide reduced variant or disable).
- Animate `transform`/`opacity` only (compositor-friendly).
- Never `transition: all` — list properties explicitly.
- Set correct `transform-origin`.
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.
- Animations must be interruptible — respond to user input mid-animation.

### Typography
- `…` not `...`.
- Curly quotes `"` `"` not straight `"`.
- Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names.
- Loading states end with `…`: `Loading…`, `Saving…`.
- `font-variant-numeric: tabular-nums` for number columns/comparisons.
- Use `text-wrap: balance` or `text-pretty` on headings (prevents widows).

### Content Handling
- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`.
- Flex children need `min-w-0` to allow text truncation.
- Handle empty states — do not render broken UI for empty strings/arrays.
- User-generated content: anticipate short, average, and very long inputs.

### Images
- `<img>` needs explicit `width` and `height` (prevents CLS).
- Below-fold images: `loading="lazy"`.
- Above-fold critical images: `priority` or `fetchpriority="high"`.

### Performance
- Large lists (>50 items): virtualize.
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `scrollTop`).
- Batch DOM reads/writes; avoid interleaving.
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke.
- Preconnect CDNs; preload critical fonts with `font-display: swap`.

### Navigation & State
- URL reflects state — filters, tabs, pagination, expanded panels in query params.
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support).
- Deep-link all stateful UI.
- Destructive actions need confirmation modal or undo window — never immediate.

### Touch & Interaction
- `touch-action: manipulation` (prevents double-tap zoom delay).
- `-webkit-tap-highlight-color` set intentionally.
- `overscroll-behavior: contain` in modals/drawers/sheets.
- During drag: disable text selection, `inert` on dragged elements.
- `autoFocus` sparingly — desktop only, single primary input; avoid on mobile.

### Safe Areas & Layout
- Full-bleed layouts need `env(safe-area-inset-*)` for notches.
- Avoid unwanted scrollbars.
- Flex/grid over JS measurement for layout.

### Dark Mode & Theming
- `color-scheme: dark` on `<html>` for dark themes.
- `<meta name="theme-color">` matches page background.
- Native `<select>`: explicit `background-color` and `color`.

### Locale & i18n
- Dates/times: `Intl.DateTimeFormat`.
- Numbers/currency: `Intl.NumberFormat`.
- Detect language via `Accept-Language` / `navigator.languages`, not IP.
- Brand names, code tokens, identifiers: `translate="no"`.

### Hydration Safety
- Inputs with `value` need `onChange` (or use `defaultValue` for uncontrolled).
- Date/time rendering: guard against hydration mismatch.
- `suppressHydrationWarning` only where truly needed.

### Hover & Interactive States
- Buttons/links need a `hover:` state (visual feedback).
- Hover/active/focus more prominent than rest.

### Content & Copy
- Active voice.
- Title Case for headings/buttons.
- Numerals for counts: "8 deployments" not "eight".
- Specific button labels: "Save API Key" not "Continue".
- Error messages include a fix/next step.
- Second person; avoid first person.

### Anti-patterns (flag these)
- `user-scalable=no` / `maximum-scale=1`.
- `onPaste` with `preventDefault`.
- `transition: all`.
- `outline-none` without focus-visible replacement.
- `<div>`/`<span>` with click handlers (should be `<button>`).
- Images without dimensions.
- Large arrays `.map()` without virtualization.
- Form inputs without labels.
- Icon buttons without `aria-label`.
- Hardcoded date/number formats.
- `autoFocus` without clear justification.

## Output Format

Group by file. `file:line` (VS Code clickable). Terse findings. No preamble.

```text
## src/App.jsx

src/App.jsx:1420 - icon button missing aria-label
src/App.jsx:874  - font-size 11px below readable minimum
src/App.jsx:1050 - "..." → "…"

## src/index.css

✓ pass
```
