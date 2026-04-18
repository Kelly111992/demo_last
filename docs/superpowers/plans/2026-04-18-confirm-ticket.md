# Ticket de Confirmación en Chat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un ticket visual de confirmación que aparece en el chat cuando el cliente quiere cerrar su pedido, reemplazando el botón de confirmar del sidebar.

**Architecture:** Un nuevo comando `[RESUMEN]` es interceptado por `parseAICommands()` y dispara `renderOrderTicket()`, que inyecta una burbuja-ticket HTML directamente en `#chatMessages`. Los botones del ticket llaman a `confirmOrder()` o descartan el ticket. Todo vive en un único archivo HTML.

**Tech Stack:** Vanilla JS, HTML/CSS inline. No framework, no build step. Archivo: `demos-ia/demos/restaurante/index.html`.

---

## Archivos

| Acción | Archivo |
|--------|---------|
| Modificar | `demos-ia/demos/restaurante/index.html` |

Secciones a tocar dentro del archivo:
- **CSS** (dentro de `<style>`): añadir estilos `.order-ticket`, `.ticket-*`
- **System prompt** (`getSystemPrompt()`): añadir regla `[RESUMEN]`
- **`parseAICommands()`**: detectar `[RESUMEN]`, llamar `renderOrderTicket()`
- **Nueva función `renderOrderTicket()`**: inyectar burbuja-ticket en chat
- **Nueva función `confirmFromTicket(ticketEl)`**: confirmar y transformar ticket en recibo

---

### Task 1: CSS del ticket fine dining

**Files:**
- Modify: `demos-ia/demos/restaurante/index.html` (sección `<style>`)

- [ ] **Paso 1: Localizar dónde insertar el CSS**

Buscar en el archivo la línea que contiene `/* Modal */` — insertar el nuevo bloque CSS justo antes.

```bash
grep -n "\/\* Modal \*\/" demos-ia/demos/restaurante/index.html
```

- [ ] **Paso 2: Añadir el CSS del ticket**

Insertar antes de `/* Modal */`:

```css
/* ══════════════════════════════════════════════
   ORDER TICKET — burbuja de confirmación en chat
══════════════════════════════════════════════ */
.order-ticket {
  background: rgba(201,169,110,0.07);
  border: 1px solid rgba(201,169,110,0.25);
  border-radius: 4px;
  padding: 18px 20px;
  min-width: 260px;
  max-width: 320px;
  font-family: var(--font-body);
}
.ticket-header {
  font-family: var(--font-display);
  font-size: 15px; font-weight: 600;
  color: var(--text); letter-spacing: .5px;
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.ticket-header span { color: var(--accent); font-size: 16px; }
.ticket-items { margin-bottom: 12px; }
.ticket-item {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: var(--font-mono);
  font-size: 11px; color: var(--text);
  margin-bottom: 6px; gap: 8px;
}
.ticket-item-name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}
.ticket-item-dots {
  flex: 1;
  border-bottom: 1px dotted rgba(201,169,110,0.25);
  margin: 0 4px 3px;
  min-width: 20px;
}
.ticket-item-price { color: var(--accent); white-space: nowrap; }
.ticket-divider {
  height: 1px; background: var(--border);
  margin: 10px 0;
}
.ticket-total {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 16px;
}
.ticket-total-label {
  font-family: var(--font-mono);
  font-size: 10px; color: var(--muted);
  letter-spacing: 2px; text-transform: uppercase;
}
.ticket-total-amount {
  font-family: var(--font-display);
  font-size: 22px; font-weight: 600;
  color: var(--accent);
}
.ticket-actions { display: flex; gap: 8px; }
.ticket-btn-confirm {
  flex: 1; padding: 9px 12px;
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 2px;
  font-family: var(--font-body);
  font-size: 12px; font-weight: 600;
  cursor: pointer; letter-spacing: .3px;
  transition: filter .15s;
}
.ticket-btn-confirm:hover { filter: brightness(1.1); }
.ticket-btn-edit {
  padding: 9px 14px;
  background: transparent;
  border: 1px solid var(--border-mid);
  color: var(--muted); border-radius: 2px;
  font-family: var(--font-body);
  font-size: 12px; cursor: pointer;
  transition: all .15s;
}
.ticket-btn-edit:hover { border-color: var(--accent); color: var(--accent); }

/* Recibo post-confirmación */
.order-receipt {
  background: rgba(201,169,110,0.05);
  border: 1px solid rgba(201,169,110,0.2);
  border-radius: 4px;
  padding: 16px 20px;
  max-width: 320px;
}
.receipt-folio {
  font-family: var(--font-mono);
  font-size: 10px; color: var(--accent);
  letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 8px;
}
.receipt-status {
  font-family: var(--font-display);
  font-size: 16px; font-weight: 600;
  color: var(--text); margin-bottom: 4px;
}
.receipt-detail {
  font-size: 11px; color: var(--muted);
  font-style: italic;
}
```

- [ ] **Paso 3: Verificar visualmente**

Abrir `demos-ia/demos/restaurante/index.html` en el navegador. No debe verse ningún cambio todavía (el CSS solo está declarado, no usado). Sin errores en consola.

- [ ] **Paso 4: Commit**

```bash
git add demos-ia/demos/restaurante/index.html
git commit -m "style: CSS ticket y recibo de confirmación en chat"
```

---

### Task 2: Función `renderOrderTicket()`

**Files:**
- Modify: `demos-ia/demos/restaurante/index.html` (sección `<script>`)

- [ ] **Paso 1: Localizar punto de inserción**

Buscar la función `parseAICommands` y agregar `renderOrderTicket` justo antes de ella:

```bash
grep -n "function parseAICommands" demos-ia/demos/restaurante/index.html
```

- [ ] **Paso 2: Insertar la función**

Agregar antes de `function parseAICommands(reply) {`:

```js
function renderOrderTicket() {
  if (state.cart.length === 0) return;

  // Eliminar ticket previo si existe
  document.querySelector('.order-ticket-wrap')?.remove();

  // Construir filas de items
  const itemRows = state.cart.map(item => {
    const subtotal = item.price * item.qty;
    return `
      <div class="ticket-item">
        <span class="ticket-item-name">${item.qty}× ${item.name}</span>
        <span class="ticket-item-dots"></span>
        <span class="ticket-item-price">$${subtotal}</span>
      </div>`;
  }).join('');

  const total = getCartTotal();

  const ticketHTML = `
    <div class="order-ticket-wrap">
      <div class="order-ticket">
        <div class="ticket-header">
          <span>🧾</span> Tu pedido
        </div>
        <div class="ticket-items">${itemRows}</div>
        <div class="ticket-divider"></div>
        <div class="ticket-total">
          <span class="ticket-total-label">Total</span>
          <span class="ticket-total-amount">$${total}</span>
        </div>
        <div class="ticket-actions">
          <button class="ticket-btn-confirm" onclick="confirmFromTicket(this.closest('.order-ticket-wrap'))">
            ✓ Confirmar pedido
          </button>
          <button class="ticket-btn-edit" onclick="dismissTicket(this.closest('.order-ticket-wrap'))">
            Editar
          </button>
        </div>
      </div>
    </div>`;

  // Inyectar como burbuja bot en el chat
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg bot order-ticket-wrap';
  msgDiv.innerHTML = `
    <div class="msg-avatar">${document.getElementById('botAvatarEmoji')?.textContent || '🤖'}</div>
    <div class="msg-content">
      <div class="order-ticket">
        <div class="ticket-header"><span>🧾</span> Tu pedido</div>
        <div class="ticket-items">${itemRows}</div>
        <div class="ticket-divider"></div>
        <div class="ticket-total">
          <span class="ticket-total-label">Total</span>
          <span class="ticket-total-amount">$${total}</span>
        </div>
        <div class="ticket-actions">
          <button class="ticket-btn-confirm" onclick="confirmFromTicket(this.closest('.order-ticket-wrap'))">✓ Confirmar pedido</button>
          <button class="ticket-btn-edit" onclick="dismissTicket(this.closest('.order-ticket-wrap'))">Editar</button>
        </div>
      </div>
      <div class="msg-time">${new Date().toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function confirmFromTicket(ticketWrap) {
  confirmOrder();

  // Reemplazar ticket por recibo de confirmación
  if (ticketWrap) {
    const receipt = document.createElement('div');
    receipt.className = 'msg bot';
    receipt.innerHTML = `
      <div class="msg-avatar">${document.getElementById('botAvatarEmoji')?.textContent || '🤖'}</div>
      <div class="msg-content">
        <div class="order-receipt">
          <div class="receipt-folio">Pedido #${state.orderNum}</div>
          <div class="receipt-status">Recibido — En preparación 👨‍🍳</div>
          <div class="receipt-detail">Tiempo estimado: 15–20 min</div>
        </div>
        <div class="msg-time">${new Date().toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit'})}</div>
      </div>`;
    ticketWrap.replaceWith(receipt);
    document.getElementById('chatMessages').scrollTop = 99999;
  }
}

function dismissTicket(ticketWrap) {
  if (ticketWrap) ticketWrap.remove();
  ClaveAI.addBubble('Sin problema, dime qué quieres cambiar.', 'bot');
}
```

- [ ] **Paso 3: Verificar la función existe**

```bash
grep -n "function renderOrderTicket" demos-ia/demos/restaurante/index.html
grep -n "function confirmFromTicket" demos-ia/demos/restaurante/index.html
grep -n "function dismissTicket" demos-ia/demos/restaurante/index.html
```

Cada una debe aparecer exactamente una vez.

- [ ] **Paso 4: Commit**

```bash
git add demos-ia/demos/restaurante/index.html
git commit -m "feat: renderOrderTicket, confirmFromTicket, dismissTicket"
```

---

### Task 3: Detectar `[RESUMEN]` en `parseAICommands`

**Files:**
- Modify: `demos-ia/demos/restaurante/index.html` — función `parseAICommands()`

- [ ] **Paso 1: Localizar `parseAICommands`**

```bash
grep -n "function parseAICommands" demos-ia/demos/restaurante/index.html
```

- [ ] **Paso 2: Agregar detección de `[RESUMEN]`**

Dentro de `parseAICommands`, antes de la línea `dbSaveMessage('assistant', clean);`, agregar:

```js
  // [RESUMEN] → mostrar ticket de confirmación en el chat
  if (/\[RESUMEN\]/i.test(clean)) {
    clean = clean.replace(/\[RESUMEN\]/gi, '');
    setTimeout(() => renderOrderTicket(), 50);
  }
```

El `setTimeout` de 50ms asegura que la burbuja de texto de la IA se renderice primero, y el ticket aparece justo después.

- [ ] **Paso 3: Verificar que el bloque limpia comandos residuales**

La línea existente al final de `parseAICommands`:
```js
clean = clean.replace(/\[(?:ADD|REMOVE|CONFIRM)[^\]]*\]/gi, '');
```

Actualizarla para incluir `RESUMEN`:
```js
clean = clean.replace(/\[(?:ADD|REMOVE|CONFIRM|RESUMEN)[^\]]*\]/gi, '');
```

- [ ] **Paso 4: Commit**

```bash
git add demos-ia/demos/restaurante/index.html
git commit -m "feat: parseAICommands detecta [RESUMEN] y dispara ticket"
```

---

### Task 4: Actualizar el system prompt con `[RESUMEN]`

**Files:**
- Modify: `demos-ia/demos/restaurante/index.html` — función `getSystemPrompt()`

- [ ] **Paso 1: Localizar la sección de comandos en el system prompt**

```bash
grep -n "RESUMEN\|COMANDOS\|CONFIRM" demos-ia/demos/restaurante/index.html | head -20
```

- [ ] **Paso 2: Reemplazar la sección de comandos**

Encontrar el bloque:
```
COMANDOS (invisibles para el cliente):
[ADD:4,4,8] = 2 tacos + michelada | [REMOVE:5] = quita tostadas | [CONFIRM] = cierra pedido
```

Reemplazarlo con:
```
COMANDOS (invisibles para el cliente, el sistema los ejecuta):
[ADD:4,4,8] = 2 tacos + michelada | [REMOVE:5] = quita tostadas
[RESUMEN] = muestra ticket de confirmación para que el cliente revise y confirme
[CONFIRM] = confirma el pedido directamente (solo si el cliente ya aceptó el ticket)

REGLA IMPORTANTE: Cuando el cliente quiera cerrar su pedido ("ya está", "mándalo",
"eso es todo", "confirmo", "listo"), responde con una frase corta y agrega [RESUMEN].
NO uses [CONFIRM] directamente — primero [RESUMEN] para que el cliente revise.
```

- [ ] **Paso 3: Verificar el system prompt**

Abrir la demo en el navegador, escribir en el chat "quiero 2 tacos" para agregar un item al carrito, luego escribir "ya está". La IA debe responder con una frase corta y el ticket debe aparecer en el chat.

- [ ] **Paso 4: Commit**

```bash
git add demos-ia/demos/restaurante/index.html
git commit -m "feat: system prompt incluye [RESUMEN] — flujo ticket completo"
```

---

### Task 5: Prueba del flujo completo y push final

- [ ] **Paso 1: Probar flujo de confirmación**

Con el servidor corriendo (`cd server && node server.js`), abrir `demos-ia/demos/restaurante/index.html`:

1. Escribir: *"Quiero 2 tacos y una michelada"* → items se agregan al carrito
2. Escribir: *"Ya está, mándalo"* → IA responde con frase corta + ticket aparece en chat
3. Ticket muestra: `2× Orden de tacos ... $190`, `1× Michelada ... $85`, Total `$275`
4. Clic en **✓ Confirmar pedido** → ticket se transforma en recibo con número y estado
5. Dashboard activa el tracker de estados

- [ ] **Paso 2: Probar flujo de edición**

1. Agregar items al carrito
2. Escribir: *"Listo"* → ticket aparece
3. Clic en **Editar** → ticket desaparece, IA dice *"Sin problema, dime qué quieres cambiar."*
4. Escribir: *"Quita los tacos"* → IA quita con `[REMOVE:4]`

- [ ] **Paso 3: Probar carrito vacío**

1. Con carrito vacío, escribir: *"Confirmo"*
2. La IA debe responder conversacionalmente (ej: "No tienes nada en el carrito aún")
3. NO debe aparecer ticket vacío

- [ ] **Paso 4: Probar en móvil (tab Menú → Chat → Carrito)**

1. Agregar items desde tab Menú
2. Ir a Chat, escribir *"ya está"*
3. Ticket aparece en chat ✓
4. Confirmar → recibo aparece ✓
5. Ir a tab Carrito → tracker activo ✓

- [ ] **Paso 5: Push final**

```bash
git push
```

---

## Self-Review

**Cobertura del spec:**
- ✅ Comando `[RESUMEN]` en system prompt (Task 4)
- ✅ `renderOrderTicket()` con items, total, botones (Task 2)
- ✅ `parseAICommands` detecta `[RESUMEN]` (Task 3)
- ✅ Botón Confirmar → `confirmFromTicket()` → recibo (Task 2)
- ✅ Botón Editar → `dismissTicket()` → mensaje (Task 2)
- ✅ CSS fine dining con tokens del tema (Task 1)
- ✅ Carrito vacío → no renderiza ticket (Task 2, guard `if (state.cart.length === 0) return`)
- ✅ Segundo `[RESUMEN]` elimina ticket anterior (`document.querySelector('.order-ticket-wrap')?.remove()`)
- ✅ `[CONFIRM]` directo sigue funcionando como ruta de escape

**Nombres consistentes:**
- `renderOrderTicket()` — Tasks 2, 3 ✓
- `confirmFromTicket(ticketWrap)` — Task 2 define, botón en HTML llama ✓
- `dismissTicket(ticketWrap)` — Task 2 define, botón en HTML llama ✓
- `.order-ticket-wrap` — clase en CSS Task 1 y JS Task 2 ✓
