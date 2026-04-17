# 🤖 mesaIA — Demos de Inteligencia Artificial

Demos funcionales con IA real (Claude) para mostrar a clientes.

## 📁 Estructura del proyecto

```
demos-ia/
├── index.html                  ← Página principal con los 3 demos
├── server/
│   └── server.js               ← Backend Node.js (proxy a Claude API)
├── assets/
│   ├── base.css                ← Estilos compartidos
│   └── mesaia.js               ← SDK de chat compartido
└── demos/
    ├── restaurante/index.html  ← Demo restaurante (tema oscuro cálido)
    ├── clinica/index.html      ← Demo clínica (tema claro profesional)
    └── ventas/index.html       ← Demo agente comercial (tema oscuro verde)
```

## 🚀 Cómo correrlo

### 1. Configura tu API key

Abre `server/server.js` y en la línea 17 reemplaza:
```js
ANTHROPIC_API_KEY: 'sk-ant-XXXXXXXXXXXXXXXX',
```
Con tu API key real de https://console.anthropic.com

### 2. Inicia el servidor

```bash
cd server
node server.js
```

Verás:
```
╔══════════════════════════════════════╗
║       mesaIA Backend — Corriendo     ║
╠══════════════════════════════════════╣
║  URL:    http://localhost:3000        ║
╚══════════════════════════════════════╝
```

### 3. Abre los demos

Tienes dos opciones:

**Opción A — Desde el servidor (recomendado):**
Abre http://localhost:3000 en tu navegador

**Opción B — Archivo directo:**
Abre `index.html` directamente en tu navegador
(el servidor DEBE estar corriendo para que el chat funcione)

## 🎨 Los 3 demos

| Demo | Giro | Diseño | Funciones IA |
|------|------|--------|--------------|
| Restaurante | Comida y bebidas | Oscuro cálido (naranja) | Pedidos, reservas, menú |
| Clínica | Salud | Claro profesional (azul) | Citas, servicios, precios |
| Ventas | B2B / Tecnología | Oscuro moderno (verde) | Leads, cotizaciones, demos |

## ✏️ Personalizar para un cliente

Para adaptar un demo a un cliente específico, solo edita el `system:` en el `<script>` al final de cada HTML:

```js
MesaIA.init({
  system: `Eres el asistente de [NOMBRE DEL NEGOCIO]...
  MENÚ/SERVICIOS: [pega el menú o lista de servicios]
  HORARIOS: [horarios reales]
  DIRECCIÓN: [dirección real]`,
  welcomeMessage: `¡Bienvenido a [NOMBRE]!...`
});
```

## ➕ Agregar un nuevo demo

1. Copia la carpeta `demos/restaurante/` con otro nombre
2. Modifica el HTML con el nuevo tema visual y contenido
3. Cambia el `system:` del agente
4. Agrega la tarjeta en `index.html`

## 📦 Requisitos

- Node.js (cualquier versión >= 14)
- API key de Anthropic (https://console.anthropic.com)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 💡 Tips para demos con clientes

1. **Personaliza antes de la reunión** — Cambia el nombre del restaurante/clínica al del cliente
2. **Muestra en pantalla grande** — El diseño desktop es el más impresionante
3. **Deja que ellos escriban** — Es más impactante cuando ellos interactúan
4. **Habla del ROI** — "Este agente atiende a las 2am cuando tú estás dormido"
