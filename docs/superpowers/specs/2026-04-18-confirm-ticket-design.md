# Diseño: Ticket de Confirmación en el Chat — Restaurante ClaveAI

**Fecha:** 2026-04-18
**Demo:** `demos-ia/demos/restaurante/index.html`
**Estado:** Aprobado por usuario

---

## Problema

El flujo de confirmación actual usa un botón "Confirmar pedido" en el sidebar (dashboard). Esto rompe la experiencia conversacional — el usuario sale del chat para interactuar con un elemento externo. Un mesero real no te pide que vayas a otra pantalla para confirmar.

## Solución

Un **ticket visual** que aparece directamente en el chat como una burbuja especial, disparado por el comando `[RESUMEN]` que la IA incluye cuando el cliente quiere cerrar su pedido.

---

## Flujo de Interacción

```
Cliente: "ya está" | "mándalo" | "eso es todo" | "confirmo"
  ↓
IA: "Perfecto, aquí tu pedido:" + [RESUMEN] al final
  ↓
parseAICommands detecta [RESUMEN]
  ↓
renderOrderTicket() inyecta burbuja-ticket en #chatMessages
  ↓
┌─────────────────────────────┐
│  Tu pedido                  │
│  ─────────────────────────  │
│  2× Orden de tacos......$190│
│  1× Michelada...........$85 │
│  ─────────────────────────  │
│  Total            $275      │
│  [✓ Confirmar] [✗ Modificar]│
└─────────────────────────────┘
  ↓ [Confirmar]              ↓ [Modificar]
confirmOrder()           ticket desaparece
ticket → recibo          usuario sigue en chat
con #pedido + estado
```

---

## Componentes a Implementar

### 1. Comando `[RESUMEN]` en el system prompt

Agregar al system prompt:
```
[RESUMEN] — cuando el cliente quiera cerrar su pedido, muestra el ticket de confirmación.
Úsalo cuando diga: "ya está", "mándalo", "eso es todo", "confirmo", "listo".
NO uses [CONFIRM] directamente — primero muestra [RESUMEN] para que el cliente revise.
```

### 2. `renderOrderTicket()` — función JS

- Se llama cuando `parseAICommands` detecta `[RESUMEN]`
- Si el carrito está vacío, no renderiza nada (la IA maneja el caso conversacionalmente)
- Inyecta un `div.msg.bot` con `div.order-ticket` dentro en `#chatMessages`
- Scroll automático al ticket
- Si ya existe un ticket previo (`.order-ticket`), lo elimina antes de crear uno nuevo

**Contenido del ticket:**
- Header: "Tu pedido" + ícono de recibo
- Lista de items: `qty× nombre .......... $subtotal` (puntos de relleno)
- Separador
- Total en display font grande
- Dos botones: "✓ Confirmar pedido" y "Editar"

### 3. Botones del ticket

**"✓ Confirmar pedido":**
```js
confirmOrder();
// Reemplaza el ticket por un recibo de confirmación:
// "Pedido #XXXX recibido 👨‍🍳 En preparación..."
```

**"Editar":**
```js
ticket.remove();
ClaveAI.addBubble('Sin problema, dime qué quieres cambiar.', 'bot');
```

### 4. Estado post-confirmación

Cuando el usuario confirma desde el ticket:
- El ticket se reemplaza por una burbuja de recibo: número de pedido, estado "Recibido", hint de tiempo estimado
- El tracker del dashboard se activa normalmente
- El botón "Confirmar pedido" del sidebar queda deshabilitado (ya confirmado)

---

## Estética del Ticket (fine dining)

```css
.order-ticket {
  background: rgba(201,169,110,0.07);
  border: 1px solid rgba(201,169,110,0.25);
  border-radius: 4px;
  padding: 18px 20px;
  min-width: 260px;
  max-width: 320px;
}
/* Header */
.ticket-header: font-display, 15px, color accent
/* Items: font-mono, puntos de relleno CSS */
/* Total: font-display, 22px, color accent */
/* Botón confirmar: background accent, color bg, font-weight 600 */
/* Botón editar: transparent, border accent sutil */
```

---

## Casos Edge

| Caso | Comportamiento |
|------|---------------|
| Carrito vacío al decir "confirmo" | IA responde conversacionalmente sin mostrar ticket |
| Usuario confirma dos veces | Segundo `[RESUMEN]` reemplaza ticket anterior |
| Usuario ya confirmó y quiere otro pedido | Mesero explica que hay un pedido activo |
| `[CONFIRM]` directo de la IA | Funciona como antes (ruta de escape) |

---

## Archivos a Modificar

- `demos-ia/demos/restaurante/index.html` — único archivo:
  - System prompt: añadir regla `[RESUMEN]`
  - `parseAICommands()`: detectar `[RESUMEN]` y llamar `renderOrderTicket()`
  - Nueva función `renderOrderTicket()`
  - Nuevo CSS `.order-ticket` y elementos hijos
  - Botón "Confirmar pedido" del sidebar: ocultar en móvil (ya tenemos tabs), mantener en desktop como alternativa
