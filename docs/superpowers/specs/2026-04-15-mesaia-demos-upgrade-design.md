# mesaIA Demos — Upgrade de Diseño y Lógica de Negocio

**Fecha:** 2026-04-15  
**Estado:** Aprobado  
**Alcance:** 8 demos en `demos-ia/demos/` — rediseño visual completo + flujos de negocio reales  
**Stack:** HTML + CSS + JS vanilla, servidor Node.js existente en `server/server.js`

---

## Contexto

El proyecto `mesaIA` es una colección de 8 demos de agentes IA para distintas industrias. Cada demo tiene estructura de 3 columnas: sidebar (productos/servicios), chat principal (IA via OpenRouter), y dashboard de métricas.

**Estado actual:** Los chats funcionan pero son conversacionales simples — solo responden preguntas. No hay estado, no hay flujos de conversión, no hay acciones reales.

**Objetivo:** Convertir cada demo en un caso de uso creíble y completo que muestre el valor real de un agente IA en esa industria.

---

## Principios de diseño

- **Vanilla HTML/CSS/JS** — sin frameworks, el código debe ser autocontenido en cada `index.html`
- **Flujos guiados por el chat** — la IA lidera los flujos; la UI los complementa con componentes interactivos
- **Estado local en JS** — `let state = {}` por demo; no hay backend de datos (todo es simulado de forma realista)
- **Sistema de prompts enriquecidos** — cada system prompt recibe contexto del estado actual del usuario
- **Coherencia visual por industria** — cada demo mantiene y eleva su identidad existente (mismas fuentes, paleta, tono)

---

## Arquitectura por demo

Cada demo sigue este patrón expandido:

```
index.html
├── CSS (variables + componentes nuevos)
├── HTML estructura (sidebar enriquecida + chat + dashboard actualizado)
└── JS
    ├── state = {} — estado de sesión (carrito, perfil, cita, etc.)
    ├── SYSTEM prompt dinámico — se reconstruye con el estado actual
    ├── renderState() — actualiza UI según estado
    ├── sendMessage() / sendQuick() — existentes, se mantienen
    └── flujos específicos por demo (funciones nuevas)
```

---

## Demo 1: La Mesa Bonita (Restaurante)

**Archivo:** `demos/restaurante/index.html`

### Estado
```js
state = {
  cart: [],           // [{id, name, price, qty, notes}]
  orderType: null,    // 'mesa' | 'llevar' | 'domicilio'
  address: '',
  orderStatus: null,  // null | 'recibido' | 'preparando' | 'listo'
  orderTimer: null,
  tableNum: null,
  reservation: null
}
```

### Flujos nuevos
1. **Carrito funcional** — botón `+` en sidebar agrega al carrito; panel en dashboard muestra items, cantidades, subtotal y total
2. **Tipo de pedido** — quick replies o botones contextuales: Mesa / Para llevar / Domicilio (captura dirección si domicilio)
3. **Personalización** — al agregar item, modal ligero pregunta "¿alguna nota?" (sin cilantro, extra salsa, etc.)
4. **Confirmar pedido** — botón en dashboard; el bot confirma con número de pedido simulado
5. **Tracker de estatus** — barra de progreso animada: Recibido (0s) → Preparando (5s demo) → Listo (15s demo)
6. **Filtros dietéticos** — botones toggleables en sidebar: 🥦 Vegetariano / 🌾 Sin gluten / 🌶️ Picante
7. **Reservación** — flujo en chat: fecha → hora → personas → ocasión → confirmación con folio

### System prompt dinámico
```
El carrito actual tiene: {cart summary o "está vacío"}.
Tipo de pedido seleccionado: {orderType o "no seleccionado"}.
Estatus del pedido: {orderStatus o "sin pedido activo"}.
```

### Cambios de diseño
- Dashboard reemplaza "órdenes recientes estáticas" por carrito en tiempo real + tracker de pedido
- Sidebar agrega filtros dietéticos sobre el menú
- Nuevo modal de personalización de item (CSS overlay)
- Animación de progreso para el tracker de estatus

---

## Demo 2: Clínica Salud+

**Archivo:** `demos/clinica/index.html`

### Estado
```js
state = {
  patient: null,      // {name, age, isNew, insurance}
  specialty: null,    // especialidad seleccionada
  doctor: null,       // doctor seleccionado
  slot: null,         // {date, time}
  appointment: null,  // {folio, confirmed}
  labStatus: null     // simulación de resultados
}
```

### Flujos nuevos
1. **Triaje inteligente** — el bot hace 2-3 preguntas de síntomas y sugiere la especialidad correcta
2. **Perfil de paciente** — al inicio, flujo rápido: nombre + ¿primera vez? + seguro médico
3. **Slots de disponibilidad** — al seleccionar especialidad/doctor, sidebar muestra horarios reales (simulados pero consistentes)
4. **Confirmación con folio** — al agendar, genera folio tipo `CSP-2024-[4 dígitos]` y lo muestra en dashboard
5. **Historial de citas** — sección en sidebar con citas previas (simuladas) para paciente frecuente
6. **Resultados de lab** — sección en dashboard con estatus: "En proceso" / "Listo" con alerta visual

### System prompt dinámico
```
Paciente: {name o "no identificado"}. Primera vez: {sí/no}. Seguro: {seguro o "ninguno"}.
Especialidad de interés: {specialty o "no seleccionada"}.
Cita agendada: {folio o "ninguna"}.
```

### Cambios de diseño
- Sidebar añade sección de slots de disponibilidad con grid de horarios
- Dashboard añade tarjeta de "Tu próxima cita" con folio y detalles
- Panel de resultados de laboratorio con indicador de estatus visual

---

## Demo 3: PowerZone Gym

**Archivo:** `demos/gimnasio/index.html`

### Estado
```js
state = {
  goal: null,         // 'peso' | 'musculo' | 'resistencia' | 'salud'
  bmi: null,          // {weight, height, result, category}
  plan: null,         // membresía recomendada
  enrollment: null,   // {name, email, plan, confirmed}
  bookedClasses: [],  // clases reservadas
  streak: 0,          // días activos (simulado)
  points: 0           // puntos de lealtad
}
```

### Flujos nuevos
1. **Quiz de objetivos** — al iniciar, 3 quick replies de objetivo; el bot recomienda el plan ideal
2. **Calculadora IMC** — el bot solicita peso y estatura, calcula y muestra resultado en dashboard
3. **Inscripción paso a paso** — Plan → Nombre + Email → Método de pago (mock) → Confirmación con número de socio
4. **Reserva de clases** — botón "Reservar" en cada clase de la sidebar; contador de spots baja en tiempo real
5. **Tracker de racha** — dashboard muestra semanas activo, clases tomadas este mes, racha actual
6. **Plan semanal IA** — el bot genera rutina de 5 días personalizada al objetivo, mostrada en dashboard

### System prompt dinámico
```
Objetivo del usuario: {goal o "no definido"}. IMC: {result o "no calculado"}.
Plan seleccionado: {plan o "ninguno"}. Clases reservadas: {bookedClasses}.
Estado: {enrolled ? "socio activo" : "prospecto"}.
```

### Cambios de diseño
- Dashboard añade: stat de racha, stat de clases este mes, plan semanal generado
- Sidebar: botón "Reservar" en cada clase con contador de spots animado
- Quick replies iniciales cambian a quiz de 4 objetivos visuales

---

## Demo 4: Hotel Cielo Boutique

**Archivo:** `demos/hotel/index.html`

### Estado
```js
state = {
  dates: null,        // {checkin, checkout, nights}
  room: null,         // habitación seleccionada
  guests: 1,
  extras: [],         // ['desayuno', 'spa', 'traslado', 'decoracion']
  loyalty: {points: 1240, tier: 'Gold'},
  reservation: null,  // {folio, total, confirmed}
  conciergeRequests: []
}
```

### Flujos nuevos
1. **Selector de fechas** — al seleccionar habitación, mini-calendario en sidebar para check-in/check-out; calcula noches y precio total
2. **Extras & upgrades** — checkboxes en dashboard: Desayuno (+$380/noche), Spa (+$850), Traslado (+$650), Decoración romántica (+$1,200)
3. **Comparador de habitaciones** — botón en sidebar muestra tabla comparativa de 2 rooms lado a lado en el chat
4. **Reserva con folio** — confirma con folio `HCB-[5 dígitos]`, desglose de precio, instrucciones de check-in
5. **Panel de concierge** — solicitudes rápidas durante "estadía": Room service, Taxi, Tour, Lavandería
6. **Programa de lealtad** — sidebar muestra puntos acumulados, nivel (Bronze/Silver/Gold/Platinum), próximos beneficios

### System prompt dinámico
```
Fechas: {checkin} a {checkout} ({nights} noches). Habitación: {room o "no seleccionada"}.
Extras seleccionados: {extras}. Total estimado: ${total}.
Nivel de lealtad: {tier} con {points} puntos.
```

### Cambios de diseño
- Sidebar añade mini selector de fechas + sección de lealtad
- Dashboard reemplaza stats estáticas por: resumen de reserva en progreso + panel de concierge
- Tarjeta de precio dinámico que suma habitación + extras en tiempo real

---

## Demo 5: Apex Realty (Inmobiliaria)

**Archivo:** `demos/inmobiliaria/index.html`

### Estado
```js
state = {
  lead: null,         // {name, budget, timeline, purpose, zone}
  filters: {},        // {type, zone, minPrice, maxPrice, rooms}
  favorites: [],      // propiedades guardadas
  comparing: [],      // hasta 2 propiedades para comparar
  mortgage: null,     // {price, down, years, monthly}
  visit: null,        // {property, agent, date, confirmed}
  roi: null           // cálculo de inversión
}
```

### Flujos nuevos
1. **Calificación de lead** — bot hace 4 preguntas: nombre, presupuesto, zona preferida, ¿para vivir o invertir?
2. **Filtros dinámicos** — barra de filtros en sidebar: tipo (casa/depto), zona, rango de precio; filtra las propiedades mostradas
3. **Hipotecaria** — el bot o botón en sidebar: precio + enganche (%) + plazo → mensualidad estimada en dashboard
4. **Guardar propiedades** — ❤️ en cada tarjeta; sección "Favoritos" en dashboard
5. **Comparador** — selecciona 2 propiedades → vista comparativa con métricas clave en el chat
6. **Agendar visita** — bot recoge: propiedad → fecha → hora → nombre → confirmación con asesor asignado
7. **ROI estimado** — para inversores: plusvalía anual estimada, renta mensual potencial, años de recuperación

### System prompt dinámico
```
Lead: {name o "anónimo"}. Presupuesto: {budget}. Zona: {zone}. Propósito: {purpose}.
Propiedades en favoritos: {favorites count}. Visita agendada: {visit o "ninguna"}.
```

### Cambios de diseño
- Sidebar añade barra de filtros sobre las propiedades
- Dashboard reemplaza leads estáticos por: favoritos del usuario + calculadora hipotecaria + folio de visita
- Tag visual de "Guardado" en tarjetas de propiedades

---

## Demo 6: Studio Glam (Salón)

**Archivo:** `demos/salon/index.html`

### Estado
```js
state = {
  stylist: null,      // {name, specialty, rating}
  services: [],       // servicios seleccionados
  totalTime: 0,       // minutos
  totalPrice: 0,
  slot: null,         // {date, time}
  appointment: null,  // {folio, confirmed}
  loyalty: {visits: 7, points: 350, nextReward: 'Corte gratis a las 10 visitas'}
}
```

### Flujos nuevos
1. **Selección de estilista** — sidebar muestra 3 estilistas con foto (emoji), especialidad, rating; click selecciona
2. **Constructor de paquetes** — servicios con checkbox; running total de precio y tiempo en dashboard
3. **Calendario de citas** — al confirmar servicios, bot presenta slots disponibles del estilista seleccionado
4. **Consulta de color** — quick reply especial que activa flujo de consulta: tipo de cabello → tono actual → deseado → recomendación técnica del bot
5. **Tarjeta de lealtad** — sidebar muestra visitas, puntos, próxima recompensa con barra de progreso
6. **Paquete novia** — botón especial que inicia flujo: fecha de boda → servicios → prueba → cotización completa

### System prompt dinámico
```
Estilista seleccionada: {stylist o "no seleccionada"}. Servicios elegidos: {services}.
Tiempo total: {totalTime}min. Precio total: ${totalPrice}.
Programa de lealtad: {visits} visitas, {points} puntos.
```

### Cambios de diseño
- Sidebar divide en: Estilistas (top) + Servicios con checkbox (bottom)
- Dashboard: constructor de cita activo (estilista + servicios + total) + tarjeta de lealtad
- Botón especial "Paquete Novia" con estilo destacado

---

## Demo 7: AutoPro Taller Mecánico

**Archivo:** `demos/taller/index.html`

### Estado
```js
state = {
  vehicle: null,      // {brand, model, year, km, plates}
  symptoms: [],       // síntomas reportados
  services: [],       // servicios seleccionados
  quote: null,        // {items, total, time}
  appointment: null,  // {mechanic, date, time, folio}
  serviceStatus: null,// 'recibido'|'diagnostico'|'taller'|'listo'
  history: []         // servicios previos simulados
}
```

### Flujos nuevos
1. **Perfil de vehículo** — al inicio, el bot solicita: marca, modelo, año, km actuales; se guarda y aparece en sidebar
2. **Diagnóstico guiado** — cuestionario de síntomas (¿hace ruido? ¿dónde? ¿cuándo empezó?) → servicios recomendados
3. **Cotizador interactivo** — checkboxes de servicios con precio y tiempo; total acumulado visible en dashboard
4. **Agendado con mecánico** — disponibilidad por mecánico especialista; confirmación con folio `APT-[5 dígitos]`
5. **Historial del vehículo** — sidebar inferior muestra 3 servicios previos simulados con fecha y costo
6. **Tracker de servicio** — barra de progreso: Recibido → En diagnóstico → En taller → Listo (con animación)

### System prompt dinámico
```
Vehículo: {brand} {model} {year}, {km}km. Síntomas: {symptoms}.
Servicios cotizados: {services}. Total estimado: ${total}.
Cita: {folio o "sin cita"}.
```

### Cambios de diseño
- Sidebar superior: tarjeta del vehículo (se llena al registrar) + historial inferior
- Dashboard: cotizador interactivo + tracker de estatus del servicio
- Header del chat muestra datos del vehículo una vez registrado

---

## Demo 8: VentasIA Pro

**Archivo:** `demos/ventas/index.html`

### Estado
```js
state = {
  lead: null,         // {name, company, industry, size}
  needs: [],          // necesidades identificadas por el bot
  solution: null,     // solución configurada
  roiCalc: null,      // {employees, hoursSaved, monthlyCost, payback}
  proposal: null,     // {id, items, investment, timeline}
  demoScheduled: null // {date, time, contact, confirmed}
}
```

### Flujos nuevos
1. **Assessment por industria** — bot hace 5 preguntas de calificación: industria, tamaño, pain point principal, presupuesto, urgencia
2. **Calculadora de ROI** — inputs: empleados, horas en tareas manuales/semana, costo hora → ahorro mensual + payback
3. **Configurador de solución** — checkboxes de módulos (Chat IA, Agente de ventas, Automatización, Analítica) → precio estimado
4. **Casos de éxito** — sidebar muestra casos filtrados por industria detectada del lead
5. **Generador de propuesta** — botón "Generar propuesta" → resumen visual en chat con todos los detalles + botón de descarga (genera HTML imprimible)
6. **Agenda demo** — flujo: nombre + empresa + fecha + hora → confirmación con ID de reunión

### System prompt dinámico
```
Lead: {name} de {company} ({industry}, {size} empleados).
Needs identificadas: {needs}. Solución configurada: {solution}.
ROI calculado: ${monthlySaving}/mes. Estado: {stage}.
```

### Cambios de diseño
- Sidebar reemplaza "productos" por casos de éxito dinámicos por industria
- Dashboard: ROI calculator interactivo + pipeline del lead (etapas de venta)
- Nuevo componente de propuesta visual generada en el chat

---

## Mejoras de frontend (todas las demos)

Siguiendo los principios de la skill `frontend-design`:

1. **Animaciones de entrada** — staggered reveal de sidebar items al cargar
2. **Micro-interacciones** — hover states refinados, feedback visual inmediato en clicks
3. **Estados de carga** — skeleton loaders mientras el bot responde
4. **Empty states** — mensajes contextuales cuando el carrito/calendario/etc. están vacíos
5. **Confirmaciones visuales** — toasts/notificaciones para acciones completadas
6. **Responsive** — se mantiene, sidebar se oculta en mobile (ya existe)
7. **Coherencia tipográfica** — cada demo mantiene sus fuentes actuales, se añaden jerarquías faltantes

---

## Orden de implementación

Por impacto visual y lógica de negocio, implementar en este orden:

1. **Restaurante** — más tangible, el carrito es el flujo más entendible para demos
2. **Clínica** — triaje + citas = caso de uso muy claro y empático
3. **Gimnasio** — quiz + inscripción = flujo de conversión claro
4. **Hotel** — fechas + extras = complejidad media, alta impresión
5. **Inmobiliaria** — filtros + hipotecaria = demo de ventas B2C compleja
6. **Salón** — estilistas + calendario = UX detallado
7. **Taller** — perfil de vehículo + diagnóstico = caso técnico interesante
8. **Ventas** — propuesta + ROI = demo de cierre de negocio B2B

---

## No incluido en este alcance

- Backend real (base de datos, autenticación, pagos reales)
- Imágenes propias (se usan Unsplash URLs o emojis como placeholders)
- Multi-idioma
- PWA / service workers
- Analytics real
