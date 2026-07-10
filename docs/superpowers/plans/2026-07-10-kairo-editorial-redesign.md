# Kairo Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Kairo's current generic SaaS presentation with a polished editorial-executive landing page designed for live demos and portfolio browsing.

**Architecture:** Preserve the existing static single-file implementation. Rebuild the semantic HTML and embedded CSS in `demos-ia/sitios/kairo/index.html`, then add small dependency-free JavaScript behaviors for navigation, reveals, counters, parallax, and carousel controls.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Google Fonts, remote Unsplash imagery, local Python static server.

---

### Task 1: Rebuild The Editorial Page Structure

**Files:**
- Modify: `demos-ia/sitios/kairo/index.html`

- [ ] **Step 1: Record the current page contract**

Run:

```bash
rg -n 'id="(producto|como|precios)"|data-count|data-car|<details|<nav|<footer' demos-ia/sitios/kairo/index.html
```

Expected: output identifies the current section anchors, counter hooks, carousel controls, FAQ details, navigation, and footer.

- [ ] **Step 2: Replace the document body with the approved narrative**

Use this semantic outline and preserve the named anchors:

```html
<nav id="nav" aria-label="Navegacion principal">...</nav>
<main>
  <header class="hero">...</header>
  <section class="proof" aria-label="Resultados de clientes">...</section>
  <section id="producto" class="product-story">...</section>
  <section id="como" class="process">...</section>
  <section class="results">...</section>
  <section class="stories">...</section>
  <section id="precios" class="pricing">...</section>
  <section class="closing">...</section>
</main>
<footer>...</footer>
```

The hero must include one `h1`, two calls to action, one dominant team photograph, one secondary detail photograph, and a compact metric panel. The product story must visibly map `Entrada -> Agente Kairo -> Accion`. Keep the existing Spanish pricing, testimonial, metric, and FAQ information only when it supports this narrative.

- [ ] **Step 3: Add accessible media and controls**

Every content image receives descriptive Spanish `alt` text. Decorative images use `alt=""`. The mobile navigation button uses:

```html
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Abrir menu">
  <span></span><span></span>
</button>
```

Carousel buttons retain unique Spanish labels and all CTAs use descriptive visible text.

- [ ] **Step 4: Inspect the structural diff**

Run:

```bash
git diff --check -- demos-ia/sitios/kairo/index.html
rg -n '<h1|id="producto"|id="como"|id="precios"|aria-expanded|aria-label' demos-ia/sitios/kairo/index.html
```

Expected: no whitespace errors; exactly one hero heading; all required anchors and accessibility attributes are present.

- [ ] **Step 5: Commit the structure**

```bash
git add demos-ia/sitios/kairo/index.html
git commit -m "feat(kairo): rebuild editorial landing structure"
```

### Task 2: Implement The Editorial Visual System

**Files:**
- Modify: `demos-ia/sitios/kairo/index.html`

- [ ] **Step 1: Define the approved design tokens**

Use these variables as the visual contract:

```css
:root {
  --paper: #f4f0e7;
  --paper-strong: #e9e1d2;
  --ink: #171915;
  --muted: #686b62;
  --forest: #173c35;
  --forest-light: #24584e;
  --coral: #dc5b3f;
  --line: rgba(23, 25, 21, 0.16);
  --white: #fffdf8;
  --display: "Manrope", sans-serif;
  --editorial: "DM Serif Display", serif;
  --body: "DM Sans", sans-serif;
}
```

Apply square or gently rounded surfaces with radii no larger than `8px` except circular avatars and controls. Keep page sections unframed and reserve bordered containers for individual plans, quotes, and the product workflow.

- [ ] **Step 2: Build stable desktop compositions**

Use an asymmetric two-column hero with a stable photo collage:

```css
.hero-grid { display:grid; grid-template-columns:minmax(0,.92fr) minmax(440px,1.08fr); gap:clamp(42px,7vw,110px); align-items:center; }
.hero-collage { position:relative; min-height:650px; }
.hero-photo-main { width:78%; height:590px; object-fit:cover; margin-left:auto; }
.hero-photo-detail { position:absolute; left:0; bottom:38px; width:44%; aspect-ratio:4/3; object-fit:cover; border:8px solid var(--paper); }
```

Implement editorial rhythm through generous full-width bands, alternating image/text alignments, a deep-green metric section, and restrained pricing columns. Do not use gradients or decorative blobs.

- [ ] **Step 3: Add responsive constraints**

At `960px`, reduce the hero collage height and navigation density. At `720px`, switch every two- or three-column region to one column, expose the menu toggle, constrain headings, and keep all fixed controls inside the viewport. Use explicit `aspect-ratio` rules for every photograph.

- [ ] **Step 4: Add reduced-motion styling**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto; }
  *, *::before, *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; }
  [data-reveal] { opacity:1!important; transform:none!important; }
}
```

- [ ] **Step 5: Verify CSS integrity and commit**

Run:

```bash
git diff --check -- demos-ia/sitios/kairo/index.html
rg -n -- '--paper|--forest|--coral|hero-grid|prefers-reduced-motion|max-width:720px' demos-ia/sitios/kairo/index.html
```

Expected: no whitespace errors and every required visual/responsive contract is present.

```bash
git add demos-ia/sitios/kairo/index.html
git commit -m "style(kairo): add editorial executive visual system"
```

### Task 3: Add Motion And Interaction

**Files:**
- Modify: `demos-ia/sitios/kairo/index.html`

- [ ] **Step 1: Add one shared motion preference**

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Every animation branch must check this value before applying scroll transforms or time-based count effects.

- [ ] **Step 2: Implement reveal and counter behavior**

Use one `IntersectionObserver` for `[data-reveal]` and `[data-count]`. Reveal each observed element once, unobserve it after activation, and immediately show final content when reduced motion is active. Counters must retain decimal precision from `data-dec` and suffixes from `data-suf`.

- [ ] **Step 3: Implement navigation and carousel controls**

The menu toggle must synchronize `aria-expanded`, its accessible label, and the open class on `#nav-links`. Close the menu after a navigation link is selected. Carousel buttons must scroll the stories container by one visible card and remain keyboard-operable native buttons.

- [ ] **Step 4: Implement restrained parallax**

Only when motion is allowed, use one passive scroll listener and one `requestAnimationFrame` gate to update `transform: translate3d(...)` on `[data-parallax]`. Clamp movement to a maximum of 22 pixels.

- [ ] **Step 5: Check runtime hooks and commit**

Run:

```bash
rg -n 'reduceMotion|IntersectionObserver|aria-expanded|requestAnimationFrame|data-parallax|data-count' demos-ia/sitios/kairo/index.html
git diff --check -- demos-ia/sitios/kairo/index.html
```

Expected: all interaction hooks exist and the diff has no whitespace errors.

```bash
git add demos-ia/sitios/kairo/index.html
git commit -m "feat(kairo): add accessible motion and interactions"
```

### Task 4: Validate The Finished Demo

**Files:**
- Verify: `demos-ia/sitios/kairo/index.html`

- [ ] **Step 1: Confirm the local route responds**

Run:

```bash
curl -I http://localhost:4173/sitios/kairo/index.html
```

Expected: `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

- [ ] **Step 2: Verify desktop rendering**

Open `http://localhost:4173/sitios/kairo/index.html` at a desktop viewport. Confirm the hero is nonblank, the collage is correctly framed, the next section is visible below the fold, images load, and no text or controls overlap.

- [ ] **Step 3: Verify mobile rendering**

Test at `390x844`. Confirm the menu opens and closes, CTA labels fit, pricing stacks, horizontal overflow is absent, and every image retains a stable crop.

- [ ] **Step 4: Verify behavior and errors**

Activate navigation, carousel controls, FAQ disclosures, and pricing CTAs with mouse and keyboard. Scroll through the page to confirm reveals, counters, and parallax work. Inspect console logs and require zero JavaScript errors from Kairo code.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`. Reload and confirm all content is visible immediately, smooth scrolling is disabled, and parallax and animated counters do not run.

- [ ] **Step 6: Review the final diff**

Run:

```bash
git status --short
git diff HEAD~3 --stat
git diff --check HEAD~3..HEAD
```

Expected: only the approved Kairo implementation and its planning documents are changed; all checks pass.

