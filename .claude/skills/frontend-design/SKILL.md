---
name: frontend-design
description: Guide the creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Use when building or refactoring any UI in this prototype.
source: https://skills.sh/anthropics/skills/frontend-design
---

# frontend-design

**Purpose:** Build web components, pages, artifacts, and applications with exceptional visual quality and working functionality. Avoid generic AI-generated aesthetics.

## Design Thinking Framework

Before writing any code, establish context and commit to a bold aesthetic direction:

- **Purpose** — the problem solved and the target user.
- **Tone** — pick an extreme aesthetic (brutalist, maximalist, retro-futuristic, luxury, playful, editorial, etc.). Bold maximalism and refined minimalism both work — the key is **intentionality, not intensity**.
- **Constraints** — technical requirements (framework, perf budget, responsive targets).
- **Differentiation** — the one thing someone will remember.

## Implementation Requirements

Code must be:

- Production-grade and functional (not a mockup — it must run).
- Visually striking and memorable.
- Cohesive — every component reads as part of the same universe.
- Meticulously refined in every detail (spacing, typography, motion).

## Frontend Aesthetics

### Typography
- Avoid generic fonts (Arial, Inter). Opt for distinctive choices that elevate the aesthetic.
- Pair a **display font** and a **body font** intentionally.
- Use weight and size to establish a clear hierarchy. Minimum readable body size is 14–16px; headlines should feel dominant.
- Use `font-variant-numeric: tabular-nums` for numeric columns.
- Prefer `text-wrap: balance` on headings.

### Color & Theme
- Use CSS variables for every color token.
- Employ **dominant colors with sharp accents** instead of timid, washed-out palettes.
- Avoid the clichéd purple-pink-blue AI gradient.
- Ensure WCAG AA contrast on text against its background.

### Motion
- Prioritize CSS animations; use scroll-triggering and hover effects strategically.
- Animate only `transform` and `opacity`. Never `transition: all`.
- Honor `prefers-reduced-motion`.
- A single well-orchestrated page-load reveal beats many small twitches.

### Spatial Composition
- Embrace asymmetry, overlap, diagonal flow, and grid-breaking elements.
- Avoid the "three centered cards in a row" trap.

### Backgrounds & Details
- Create atmosphere through textures, gradients, patterns, noise, and contextual effects.
- Details earn the user's trust — hover states, micro-interactions, transitions between states.

## What to Avoid

- Generic fonts (Arial, Helvetica, default Inter-only).
- Clichéd color schemes (purple→pink gradients, teal+coral).
- Predictable layouts (three cards in a row, hero-left / image-right).
- Cookie-cutter component libraries with no aesthetic point of view.
- Rounded-everything + subtle-shadow "SaaS template" look.

## Application in this repo

Applies to every screen under `src/App.jsx`. When refactoring a view, state the aesthetic direction in a code comment at the top of the view's render function ("This screen is editorial / dense / executive-brief"), then commit to it.
