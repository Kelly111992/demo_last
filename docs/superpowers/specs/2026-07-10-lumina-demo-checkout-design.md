# Lúmina Casa — checkout demostrativo

## Objetivo

Reemplazar el mensaje oculto de “Esta es una demostración” por un checkout simulado, elegante y creíble que complete la experiencia del ecommerce sin solicitar datos personales ni procesar pagos.

## Alcance

El cambio vive dentro del panel lateral existente y conserva el catálogo, filtros, cantidades y almacenamiento local actuales. No se conectará una pasarela de pago, formulario, API ni servicio externo.

## Flujo

### Estado 1: bolsa

El panel mantiene el listado actual de productos, controles de cantidad, subtotal y botón `Finalizar compra`. Si la bolsa está vacía, el botón permanece deshabilitado.

### Estado 2: preparación

Al pulsar `Finalizar compra`, el contenido del panel cambia con una transición suave a `Preparar tu pedido` y muestra:

- resumen compacto de productos y cantidades;
- subtotal;
- envío gratuito;
- total;
- dos métodos seleccionables: `Entrega estándar · 2–4 días` y `Recoger en estudio`;
- nota discreta: `Experiencia demostrativa. No se solicitarán datos ni se realizará ningún cobro.`;
- acción principal `Confirmar pedido de demostración`;
- acción secundaria `Volver a la bolsa`.

La entrega estándar estará seleccionada inicialmente. La selección se implementará con controles de radio accesibles.

### Estado 3: confirmación

Al confirmar, el panel presenta una pantalla de éxito con:

- icono visual de confirmación creado con CSS;
- título `Tu ritual está listo`;
- número de pedido ficticio estable durante la sesión;
- fecha estimada calculada para cuatro días posteriores;
- mensaje explícito: `Demostración completada. No se procesó ningún cobro ni se recopilaron datos.`;
- botón principal `Seguir explorando`;
- botón secundario `Cerrar`.

El pedido ficticio tendrá el formato `LUM-XXXXXX`, construido localmente sin datos del usuario.

## Estado y comportamiento

- La variable `cartView` controla `bag`, `checkout` y `success`.
- La selección de entrega se conserva al volver desde checkout hacia la bolsa mientras el panel siga abierto.
- `Escape`, el fondo y el botón de cerrar cierran el panel desde cualquier estado y regresan a la vista de bolsa.
- `Seguir explorando` cierra el panel, vacía el carrito y desplaza la página hacia la colección.
- `Cerrar` cierra el panel y vacía el carrito sin desplazar la página.
- Los productos no se eliminan antes de llegar a la confirmación.
- El texto de estado para lectores de pantalla anuncia cada cambio de etapa.

## Diseño visual

La experiencia reutiliza la paleta, tipografía y panel existentes. Los pasos se diferencian mediante jerarquía editorial, divisores, tarjetas de entrega, resumen de totales y una marca de confirmación borgoña. No se añade un modal separado ni una alerta del navegador.

En móvil, el panel ocupa todo el ancho y el contenido puede desplazarse internamente sin ocultar las acciones principales.

## Accesibilidad

- Los métodos de entrega usan `fieldset`, `legend` e inputs de radio.
- Los botones conservan nombres claros y estados deshabilitados.
- El foco se mueve al título de cada etapa.
- La región `aria-live` anuncia la transición y la confirmación.
- La navegación por teclado y `Escape` funciona en las tres etapas.
- El contraste mantiene los colores existentes de la marca.

## Validación

- Una bolsa vacía no inicia el checkout.
- Una bolsa con productos avanza a preparación sin perder cantidades ni total.
- Cambiar el método de entrega actualiza su estado seleccionado.
- Volver a la bolsa preserva sus productos.
- Confirmar muestra un pedido ficticio y una fecha estimada.
- La confirmación explica claramente que no hubo cobro ni recopilación de datos.
- Cerrar o seguir explorando vacía la bolsa después de la confirmación.
- El flujo funciona en escritorio y a 390 × 844 sin desbordamiento horizontal.
- No aparecen errores en consola ni alertas detrás del panel.

