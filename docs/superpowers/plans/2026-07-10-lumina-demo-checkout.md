# Lúmina Demo Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el botón `Finalizar compra` en un checkout demostrativo accesible de dos pasos con preparación, entrega y confirmación, sin solicitar datos ni procesar cobros.

**Architecture:** El panel lateral existente seguirá siendo el único contenedor. Una variable `cartView` actuará como máquina de estados (`bag`, `checkout`, `success`) y `renderCart()` renderizará la vista correspondiente; el catálogo y el carrito persistente seguirán siendo la fuente de datos. Todas las interacciones serán locales y reutilizarán la delegación de eventos existente.

**Tech Stack:** HTML, CSS y JavaScript sin framework; localStorage; servidor Node.js local; navegador integrado para pruebas funcionales y responsive.

---

### Task 1: Construir las tres vistas del panel

**Files:**
- Modify: `demos-ia/sitios/lumina/index.html`

- [ ] **Step 1: Confirmar el comportamiento anterior**

Run:

```bash
rg -n "Esta es una demostración|id=\"checkout\"|function renderCart" demos-ia/sitios/lumina/index.html
```

Expected: el botón `checkout` solo cambia el texto oculto de estado.

- [ ] **Step 2: Añadir estructura estable para el contenido y pie del panel**

Replace the cart body with these stable containers:

```html
<p class="status" id="cart-status" aria-live="polite"></p>
<div class="cart-stage" id="cart-stage"></div>
<div class="cart-footer" id="cart-footer"></div>
```

Expected: `renderCart()` controls both stage and footer without replacing the panel header or close control.

- [ ] **Step 3: Añadir estilos de checkout y confirmación**

Add focused rules for `.checkout-head`, `.checkout-summary`, `.delivery-options`, `.delivery-option`, `.demo-note`, `.success`, `.success-mark`, `.secondary-action`, disabled `.checkout`, and scrollable `.cart-stage`. Reuse existing color variables and typography. Ensure `.cart-footer` remains at the bottom and mobile width stays `100%`.

- [ ] **Step 4: Definir estado local del flujo**

Add:

```js
let cartView='bag', deliveryMethod='standard', demoOrder=null;
```

Expected: closing the panel resets `cartView` to `bag` while cart contents remain intact unless success was completed.

- [ ] **Step 5: Implementar utilidades de pedido ficticio**

Add:

```js
function createDemoOrder(){
  const code=String(Math.floor(100000+Math.random()*900000));
  const eta=new Date();
  eta.setDate(eta.getDate()+4);
  return {number:`LUM-${code}`,eta:eta.toLocaleDateString('es-MX',{day:'numeric',month:'long'})};
}
function totals(){
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  return {subtotal,shipping:0,total:subtotal};
}
```

Expected: the order number contains no user data and the total matches the bag.

- [ ] **Step 6: Renderizar la bolsa**

Implement `renderBag()` so it preserves the current item markup, quantity controls and subtotal. Render the checkout button with `disabled` when `cart.length===0`.

- [ ] **Step 7: Renderizar preparación**

Implement `renderCheckout()` with compact item rows, subtotal, `Envío` as `Gratis`, total, a `fieldset` with radio controls for `standard` and `pickup`, the discreet demonstration note, `Confirmar pedido de demostración`, and `Volver a la bolsa`.

- [ ] **Step 8: Renderizar confirmación**

Implement `renderSuccess()` with the CSS success mark, `Tu ritual está listo`, `demoOrder.number`, `demoOrder.eta`, the no-charge/no-data message, `Seguir explorando`, and `Cerrar`.

- [ ] **Step 9: Convertir renderCart en despachador**

Use:

```js
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.quantity,0);
  $('#cart-count').textContent=count;
  if(cartView==='checkout') return renderCheckout();
  if(cartView==='success') return renderSuccess();
  renderBag();
}
```

Expected: each state has one render path and no hidden alert is used as visible UI.

### Task 2: Conectar interacciones, foco y cierre

**Files:**
- Modify: `demos-ia/sitios/lumina/index.html`

- [ ] **Step 1: Añadir acciones delegadas**

Extend the existing document click handler to support:

```js
const checkout=e.target.closest('[data-checkout]');
const back=e.target.closest('[data-back-to-bag]');
const confirm=e.target.closest('[data-confirm-demo]');
const finish=e.target.closest('[data-finish-demo]');
const dismiss=e.target.closest('[data-dismiss-demo]');
```

Expected actions:

- checkout with non-empty cart: set `cartView='checkout'` and render;
- back: set `cartView='bag'` and render;
- confirm: create `demoOrder`, set `cartView='success'`, render;
- finish: clear and save cart, close panel, scroll `#coleccion` into view;
- dismiss: clear and save cart, close panel.

- [ ] **Step 2: Conectar radios de entrega**

Add a `change` listener for `[name="delivery"]` that assigns `deliveryMethod=e.target.value` and announces the selected method through `#cart-status`.

- [ ] **Step 3: Gestionar el foco**

After rendering checkout or success, call a helper that focuses the element carrying `[data-stage-title]` with `tabindex="-1"`.

- [ ] **Step 4: Restablecer vista al cerrar**

Update `closeCart()` to set `cartView='bag'`, render, and then close the panel. Do not clear the bag unless the current state is success and a success action was selected.

- [ ] **Step 5: Eliminar el manejador anterior**

Remove:

```js
$('#checkout').onclick=()=>status.textContent='Esta es una demostración. No se realizará ningún cobro.';
```

Expected: no string matching `Esta es una demostración` remains in the source.

### Task 3: Verificar el flujo completo

**Files:**
- Verify: `demos-ia/sitios/lumina/index.html`

- [ ] **Step 1: Verificación estática**

Run:

```bash
if rg -n "Esta es una demostración|id=\"checkout\"" demos-ia/sitios/lumina/index.html; then exit 1; else echo "PASS: legacy checkout removed"; fi
git diff --check
```

Expected: `PASS: legacy checkout removed` and no whitespace errors.

- [ ] **Step 2: Probar bolsa vacía**

Reload the page with an empty cart and inspect the bag.

Expected: `Finalizar compra` is disabled and the empty message is visible.

- [ ] **Step 3: Probar preparación**

Add `Lino Solar` and `Ritual de Casa`, then activate `Finalizar compra`.

Expected: preparation view shows both items, subtotal `$3,040.00`, free shipping, total `$3,040.00`, and standard delivery selected.

- [ ] **Step 4: Probar navegación y entrega**

Select `Recoger en estudio`, go back to the bag, then return to checkout.

Expected: products and quantities remain unchanged and pickup remains selected.

- [ ] **Step 5: Probar confirmación**

Activate `Confirmar pedido de demostración`.

Expected: success view displays `LUM-` plus six digits, an estimated date, and the explicit no-charge/no-data message.

- [ ] **Step 6: Probar finalización**

Activate `Seguir explorando`.

Expected: panel closes, cart count becomes `0`, cart storage is saved empty and the collection is visible.

- [ ] **Step 7: Probar móvil**

Set viewport to 390×844, repeat the checkout-to-success flow, and inspect overflow plus console logs.

Expected: no horizontal overflow, panel width `390px`, all actions reachable, no console errors.

- [ ] **Step 8: Commit y push**

Run:

```bash
git add docs/superpowers/plans/2026-07-10-lumina-demo-checkout.md demos-ia/sitios/lumina/index.html
git commit -m "feat: add interactive demo checkout to Lumina"
git push origin main
```

Expected: `main` is synchronized with `origin/main` and Vercel receives the new commit.

