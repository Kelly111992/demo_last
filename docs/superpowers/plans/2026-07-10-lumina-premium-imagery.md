# Lúmina Premium Imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar las ocho fotografías genéricas de Lúmina Casa por una colección editorial premium, local y coherente que funcione en portada, catálogo, sección de regalo y carrito.

**Architecture:** Los activos finales vivirán en una carpeta local dedicada y el HTML seguirá usando su catálogo JavaScript existente como fuente única para tarjetas y carrito. La generación se hará como una familia visual con un prompt maestro compartido y ocho variaciones de escena; después se validarán rutas, proporciones, carga y apariencia en el navegador.

**Tech Stack:** HTML, CSS y JavaScript sin framework; activos raster generados con la herramienta integrada de generación de imágenes; servidor Node.js local; navegador integrado para validación visual.

---

## File Map

- Create: `demos-ia/sitios/lumina/assets/lumina-hero.png` — portada horizontal aspiracional.
- Create: `demos-ia/sitios/lumina/assets/higo-nocturno.png` — producto vertical.
- Create: `demos-ia/sitios/lumina/assets/lino-solar.png` — producto vertical.
- Create: `demos-ia/sitios/lumina/assets/te-negro.png` — producto vertical.
- Create: `demos-ia/sitios/lumina/assets/jardin-lluvia.png` — producto vertical.
- Create: `demos-ia/sitios/lumina/assets/ambar-quieto.png` — producto vertical.
- Create: `demos-ia/sitios/lumina/assets/ritual-de-casa.png` — producto vertical del set.
- Create: `demos-ia/sitios/lumina/assets/ritual-banner.png` — escena horizontal del set.
- Modify: `demos-ia/sitios/lumina/index.html` — sustituir ocho URLs externas por rutas locales y conservar el catálogo como fuente única.

### Task 1: Preparar el contrato de activos

**Files:**
- Create: `demos-ia/sitios/lumina/assets/`
- Inspect: `demos-ia/sitios/lumina/index.html`

- [ ] **Step 1: Crear la carpeta de imágenes**

Run:

```bash
mkdir -p demos-ia/sitios/lumina/assets
```

Expected: la carpeta existe y está vacía antes de copiar los resultados finales.

- [ ] **Step 2: Confirmar las ocho referencias externas actuales**

Run:

```bash
rg -n "images\.unsplash\.com" demos-ia/sitios/lumina/index.html
```

Expected: aparecen dos referencias estáticas y seis referencias en el arreglo `products`.

- [ ] **Step 3: Confirmar que no se alterará el comportamiento de ecommerce**

Run:

```bash
rg -n "function renderProducts|function renderCart|function add\(" demos-ia/sitios/lumina/index.html
```

Expected: las tarjetas y el carrito consumen `p.image` o `i.image`, por lo que basta cambiar el catálogo.

### Task 2: Generar la colección editorial

**Files:**
- Create: `demos-ia/sitios/lumina/assets/lumina-hero.png`
- Create: `demos-ia/sitios/lumina/assets/higo-nocturno.png`
- Create: `demos-ia/sitios/lumina/assets/lino-solar.png`
- Create: `demos-ia/sitios/lumina/assets/te-negro.png`
- Create: `demos-ia/sitios/lumina/assets/jardin-lluvia.png`
- Create: `demos-ia/sitios/lumina/assets/ambar-quieto.png`
- Create: `demos-ia/sitios/lumina/assets/ritual-de-casa.png`
- Create: `demos-ia/sitios/lumina/assets/ritual-banner.png`

- [ ] **Step 1: Generar la portada horizontal**

Use the built-in image generation tool with this complete prompt:

```text
Use case: ads-marketing
Asset type: ecommerce homepage hero for a premium Mexican home-fragrance brand
Primary request: Create a photorealistic editorial campaign photograph for Lúmina Casa, a quiet-luxury candle and diffuser brand.
Scene/backdrop: a refined contemporary Mexican interior, limestone tabletop meeting dark walnut, washed ivory linen, subtle handcrafted details, no cultural clichés.
Subject: one thick-walled burgundy glass candle with a small restrained cream label reading only “LÚMINA CASA”, candle lit, pristine premium packaging.
Style/medium: high-end product photography, tactile, cinematic but believable, luxury fragrance campaign.
Composition/framing: horizontal 16:10 composition; product on the center-right; generous calm negative space on the left; tabletop fully grounded; no cropped vessel.
Lighting/mood: warm late-afternoon natural side light, soft controlled long shadows, calm intimate atmosphere.
Color palette: bone, cream, burgundy, amber, dark walnut, muted sage.
Materials/textures: limestone, washed linen, thick glass, fine uncoated paper, wood grain.
Text (verbatim): “LÚMINA CASA” only on the small product label.
Constraints: one coherent premium product; realistic flame and reflections; suitable for an ecommerce hero.
Avoid: extra text, misspelled text, logos other than LÚMINA CASA, watermark, generic stock-photo styling, hands, people, excessive props, floating objects, malformed glass.
```

Expected: one landscape image with the product clearly visible and usable left-side negative space.

- [ ] **Step 2: Generar Higo Nocturno**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium studio product photograph for Lúmina Casa, maintaining the exact shared visual family of the collection.
Scene/backdrop: burgundy candle on honed limestone with a small cut black fig, one cedar shaving and a few dry leaves used sparingly.
Subject: a thick-walled dark wine glass candle, unlit, pristine, small cream editorial label reading only “LÚMINA CASA”.
Style/medium: quiet-luxury fragrance campaign, tactile editorial product photography.
Composition/framing: vertical 4:5, eye-level three-quarter view, full vessel centered slightly low, consistent camera distance, generous breathing room.
Lighting/mood: deep late-afternoon side light, controlled soft shadow, nocturnal and warm.
Color palette: burgundy, fig purple, bone, cedar brown.
Constraints: product is the unmistakable focal point; realistic glass, wax and label; no clutter.
Avoid: extra text, watermark, people, hands, smoke, generic stock styling, distorted vessel, illegible decorative typography.
```

Expected: vertical product image distinguishable by dark burgundy glass and fig accents.

- [ ] **Step 3: Generar Lino Solar**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium studio product photograph for Lúmina Casa, maintaining the exact shared visual family of the collection.
Scene/backdrop: clear diffuser on pale limestone, washed ivory linen moving softly behind it, one restrained neroli blossom.
Subject: a thick clear-glass diffuser with pale golden fragrance oil and six natural reeds, small cream editorial label reading only “LÚMINA CASA”.
Style/medium: quiet-luxury fragrance campaign, tactile editorial product photography.
Composition/framing: vertical 4:5, eye-level three-quarter view, full vessel centered slightly low, consistent camera distance, generous breathing room.
Lighting/mood: airy morning side light, clean soft highlights, fresh and serene.
Color palette: ivory, clear glass, pale gold, soft green.
Constraints: realistic reeds, liquid, refraction and shadows; product is the focal point.
Avoid: extra text, watermark, people, hands, excessive flowers, generic spa styling, distorted reeds or vessel.
```

Expected: vertical diffuser image with a light, airy identity.

- [ ] **Step 4: Generar Té Negro**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium studio product photograph for Lúmina Casa, maintaining the exact shared visual family of the collection.
Scene/backdrop: amber candle on dark walnut and limestone, a few loose black-tea leaves, two cardamom pods and a restrained brass tray edge.
Subject: a thick-walled amber glass candle, unlit, pristine, small cream editorial label reading only “LÚMINA CASA”.
Style/medium: quiet-luxury fragrance campaign, tactile editorial product photography.
Composition/framing: vertical 4:5, eye-level three-quarter view, full vessel centered slightly low, consistent camera distance, generous breathing room.
Lighting/mood: intimate after-dinner side light with soft amber highlights and deep controlled shadow.
Color palette: amber, tea brown, bone, dark walnut, muted brass.
Constraints: product remains dominant; realistic glass and wax; ingredients are secondary.
Avoid: extra text, watermark, people, hands, teacups, steam, generic stock styling, clutter, distorted vessel.
```

Expected: vertical candle image with amber glass and subtle tea/cardamom cues.

- [ ] **Step 5: Generar Jardín Después de Lluvia**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium studio product photograph for Lúmina Casa, maintaining the exact shared visual family of the collection.
Scene/backdrop: smoke-green diffuser on cool limestone with tiny water droplets, two wet green stems and three pale petals placed naturally.
Subject: a thick smoke-green glass diffuser with clear fragrance oil and six natural reeds, small cream editorial label reading only “LÚMINA CASA”.
Style/medium: quiet-luxury fragrance campaign, tactile editorial product photography.
Composition/framing: vertical 4:5, eye-level three-quarter view, full vessel centered slightly low, consistent camera distance, generous breathing room.
Lighting/mood: soft overcast daylight after rain, fresh reflections, calm and botanical rather than floral-sweet.
Color palette: muted sage, wet stone grey, cream, pale blush.
Constraints: realistic water, glass, reeds and refraction; understated styling.
Avoid: extra text, watermark, people, hands, bouquets, fantasy fog, generic spa styling, distorted reeds or vessel.
```

Expected: vertical diffuser image identifiable by smoke-green glass and rain-wet botanicals.

- [ ] **Step 6: Generar Ámbar Quieto**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium studio product photograph for Lúmina Casa, maintaining the exact shared visual family of the collection.
Scene/backdrop: honey-colored candle on polished dark wood and limestone, one small piece of natural amber resin and a folded cream textile.
Subject: a thick-walled honey glass candle, unlit, pristine, small cream editorial label reading only “LÚMINA CASA”.
Style/medium: quiet-luxury fragrance campaign, tactile editorial product photography.
Composition/framing: vertical 4:5, eye-level three-quarter view, full vessel centered slightly low, consistent camera distance, generous breathing room.
Lighting/mood: enveloping golden side light with restrained highlights and soft controlled shadow.
Color palette: honey, amber, cream, dark brown.
Constraints: product remains dominant; realistic glass, wax and resin; minimal props.
Avoid: extra text, watermark, people, hands, flames, generic stock styling, excessive gold, distorted vessel.
```

Expected: vertical candle image with a luminous honey identity distinct from Té Negro.

- [ ] **Step 7: Generar el producto Ritual de Casa**

Use the built-in image generation tool with this complete prompt:

```text
Use case: product-mockup
Asset type: 4:5 ecommerce product card
Primary request: Photorealistic premium gift-set photograph for Lúmina Casa, consistent with the same quiet-luxury product family.
Scene/backdrop: rigid cream gift box open on limestone, lined with textured ivory paper and finished with a narrow burgundy ribbon.
Subject: one burgundy glass candle, one clear diffuser with natural reeds, and one elegant long-match box, precisely nested inside the box; each vessel has a small cream label reading only “LÚMINA CASA”.
Style/medium: high-end editorial ecommerce photography, tactile and giftable.
Composition/framing: vertical 4:5, elevated three-quarter view, complete box visible, balanced arrangement, generous margin.
Lighting/mood: soft natural side light, celebratory but restrained.
Color palette: cream, bone, burgundy, clear glass, dark walnut accent.
Constraints: exactly three gift components; realistic packaging; product-ready presentation.
Avoid: extra text, watermark, people, hands, bows, holiday clichés, clutter, duplicated objects, malformed packaging.
```

Expected: vertical image of the complete open gift box with exactly three components.

- [ ] **Step 8: Generar el banner Ritual de Casa**

Use the built-in image generation tool with this complete prompt:

```text
Use case: ads-marketing
Asset type: horizontal ecommerce feature banner
Primary request: Create a photorealistic narrative campaign scene for the Lúmina Casa Ritual de Casa gift set, consistent with the full collection.
Scene/backdrop: open cream gift box on a dark walnut dining table with limestone detail, ivory paper and narrow burgundy ribbon; quiet refined home interior beyond.
Subject: burgundy candle lit beside a clear diffuser and elegant long-match box, all three visible and arranged as a ready-to-give ritual; small restrained labels reading only “LÚMINA CASA”.
Style/medium: premium editorial fragrance photography, cinematic and tactile but believable.
Composition/framing: horizontal 3:2; complete set weighted to the left-center; enough surrounding context to feel narrative; no cropped components.
Lighting/mood: warm evening side light, realistic flame, intimate gifting atmosphere.
Color palette: cream, burgundy, amber, dark walnut, bone.
Constraints: exactly three gift components; coherent with the product-card image while using a distinct composition.
Avoid: extra text, watermark, people, hands, holiday clichés, excessive props, duplicated objects, malformed packaging.
```

Expected: horizontal set image suitable for the dark `ritual` section.

- [ ] **Step 9: Inspect every generated result and copy only accepted finals into the project**

For each generated result, verify subject, material realism, consistent visual family, correct component count, absence of malformed text, absence of watermarks and correct orientation. Copy the accepted files from the generation output location into the exact paths from the File Map.

Run:

```bash
file demos-ia/sitios/lumina/assets/*.png
```

Expected: exactly eight valid PNG image files.

- [ ] **Step 10: Commit the generated asset set**

Run:

```bash
git add demos-ia/sitios/lumina/assets
git commit -m "feat: add premium Lumina product imagery"
```

Expected: one commit containing exactly eight new image assets.

### Task 3: Integrar los activos en el ecommerce

**Files:**
- Modify: `demos-ia/sitios/lumina/index.html`

- [ ] **Step 1: Sustituir las dos imágenes de secciones**

Replace the hero image source with:

```html
<img src="assets/lumina-hero.png" width="1536" height="1024" alt="Vela Lúmina encendida en una mesa de piedra y madera con luz cálida">
```

Replace the Ritual section image source with:

```html
<img src="assets/ritual-banner.png" width="1536" height="1024" alt="Set Ritual de Casa con vela, difusor y cerillos presentado para regalo">
```

- [ ] **Step 2: Sustituir las seis imágenes del catálogo**

Set the `image` properties to these exact local paths:

```js
const products=[
  {id:'higo-nocturno',name:'Higo Nocturno',price:980,family:'amaderado',format:'Vela de autor',image:'assets/higo-nocturno.png'},
  {id:'lino-solar',name:'Lino Solar',price:1180,family:'fresco',format:'Difusor',image:'assets/lino-solar.png'},
  {id:'te-negro',name:'Té Negro',price:920,family:'especiado',format:'Vela de autor',image:'assets/te-negro.png'},
  {id:'jardin-despues-de-lluvia',name:'Jardín Después de Lluvia',price:1240,family:'floral',format:'Difusor',image:'assets/jardin-lluvia.png'},
  {id:'ambar-quieto',name:'Ámbar Quieto',price:1060,family:'calido',format:'Vela de autor',image:'assets/ambar-quieto.png'},
  {id:'ritual-de-casa',name:'Ritual de Casa',price:1860,family:'set',format:'Set de regalo',image:'assets/ritual-de-casa.png'}];
```

- [ ] **Step 3: Verificar que no quedan dependencias de Unsplash**

Run:

```bash
if rg -n "images\.unsplash\.com" demos-ia/sitios/lumina/index.html; then exit 1; else echo "PASS: no Unsplash references"; fi
```

Expected: `PASS: no Unsplash references`.

- [ ] **Step 4: Verificar que cada ruta declarada existe**

Run:

```bash
for image in lumina-hero higo-nocturno lino-solar te-negro jardin-lluvia ambar-quieto ritual-de-casa ritual-banner; do test -s "demos-ia/sitios/lumina/assets/$image.png" || exit 1; done; echo "PASS: 8 image assets exist"
```

Expected: `PASS: 8 image assets exist`.

- [ ] **Step 5: Commit de integración**

Run:

```bash
git add demos-ia/sitios/lumina/index.html
git commit -m "feat: connect premium imagery to Lumina shop"
```

Expected: un commit que modifica únicamente `index.html`.

### Task 4: Verificar la experiencia completa

**Files:**
- Verify: `demos-ia/sitios/lumina/index.html`
- Verify: `demos-ia/sitios/lumina/assets/*.png`

- [ ] **Step 1: Confirmar respuesta HTTP para la página y los ocho activos**

Run against the active local server:

```bash
for path in sitios/lumina/index.html sitios/lumina/assets/lumina-hero.png sitios/lumina/assets/higo-nocturno.png sitios/lumina/assets/lino-solar.png sitios/lumina/assets/te-negro.png sitios/lumina/assets/jardin-lluvia.png sitios/lumina/assets/ambar-quieto.png sitios/lumina/assets/ritual-de-casa.png sitios/lumina/assets/ritual-banner.png; do curl -fsS -o /dev/null "http://localhost:3001/$path" || exit 1; done; echo "PASS: page and 8 assets respond"
```

Expected: `PASS: page and 8 assets respond`.

- [ ] **Step 2: Verificar escritorio en el navegador integrado**

Open `http://localhost:3001/sitios/lumina/index.html`, reload after the file changes, and inspect a fresh DOM snapshot plus screenshot.

Expected:

- Title is `LÚMINA CASA · Fragancias para habitar`.
- Hero image is visible and not distorted.
- Six product cards render with distinct local images.
- Ritual banner is visible.
- No framework error overlay or console errors are present.

- [ ] **Step 3: Verificar carrito con la imagen local**

Using a unique locator from the fresh DOM snapshot, click `AGREGAR A LA BOLSA` for one product, open the cart if needed, and inspect the cart item image `src`.

Expected: the cart item uses the same `assets/<product>.png` path as its product card and the subtotal updates.

- [ ] **Step 4: Verificar móvil**

Set the integrated browser viewport to a representative mobile size such as 390×844, reload, and inspect the hero, product grid, ritual section and cart.

Expected: no horizontal overflow, no stretched images, single-column product cards at the smallest breakpoint and a usable full-width cart.

- [ ] **Step 5: Restaurar el viewport y revisar el estado de Git**

Reset the temporary viewport override, then run:

```bash
git status --short
```

Expected: no uncommitted changes from the imagery work; unrelated pre-existing changes remain untouched.

