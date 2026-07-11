# Lúmina Casa — sistema de imágenes premium

## Objetivo

Sustituir las fotografías genéricas de stock del ecommerce Lúmina Casa por una colección propia, coherente y orientada a conversión. Las imágenes deben presentar una marca mexicana de fragancias para el hogar con una estética de lujo silencioso, artesanal y contemporáneo.

## Dirección creativa

La colección utiliza una familia única de envases: vidrio grueso, proporciones sobrias, tapas y detalles discretos, y etiquetas editoriales con la marca `LÚMINA CASA`. Cada fragancia se distingue mediante color, ingredientes, superficie y atmósfera, sin perder la identidad común.

- Fotografía editorial de producto, fotorrealista y de nivel campaña.
- Luz natural lateral suave, sombras largas controladas y contraste moderado.
- Materiales: piedra caliza, lino lavado, madera oscura, papel texturizado y vidrio.
- Paleta: crema, hueso, borgoña, ámbar, verde salvia apagado y café profundo.
- Composición limpia, táctil y habitable; nunca clínica ni excesivamente decorada.
- Sin marcas ajenas, marcas de agua, manos deformes ni texto adicional.

## Sistema de activos

### 1. Portada

Escena horizontal aspiracional de una vela Lúmina encendida sobre una mesa de piedra y madera, con lino y luz de última hora entrando lateralmente. El producto ocupa el centro-derecha y conserva aire visual. Debe comunicar hogar, calma y artesanía mexicana sin recurrir a clichés.

### 2–7. Colección de productos

Seis imágenes verticales con cámara, escala, altura del horizonte y tratamiento lumínico consistentes. El envase y la etiqueta son siempre legibles como producto, pero el nombre específico no depende del texto generado en la imagen.

1. **Higo Nocturno** — vela en vidrio vino oscuro; higo cortado, cedro y hojas secas; luz de atardecer profunda.
2. **Lino Solar** — difusor en vidrio claro; lino marfil, neroli y reflejos de mañana; atmósfera aireada.
3. **Té Negro** — vela ámbar; hojas de té, cardamomo y una bandeja de madera oscura; sobremesa íntima.
4. **Jardín Después de Lluvia** — difusor verde humo; tallos húmedos, pétalos pálidos y piedra con gotas; frescura después de lluvia.
5. **Ámbar Quieto** — vela miel; resina, madera pulida y destellos cálidos; ambiente envolvente.
6. **Ritual de Casa** — caja de regalo abierta con vela, difusor y cerillos largos, acomodados sobre papel crema y cinta borgoña.

### 8. Sección Ritual

Escena horizontal más narrativa del set Ritual de Casa abierto sobre una mesa, con los tres componentes visibles y una vela encendida. Debe sentirse como un regalo listo para entregar y complementar, sin duplicar exactamente, la fotografía vertical del producto.

## Integración

- Guardar los activos finales dentro de `demos-ia/sitios/lumina/assets/`.
- Usar nombres estables y descriptivos en formato WebP o PNG.
- Reemplazar todas las URL externas de Unsplash por rutas locales.
- Mantener las proporciones actuales: horizontal para portada y ritual, vertical 4:5 para tarjetas.
- Actualizar las imágenes del carrito mediante el mismo catálogo JavaScript, sin duplicar datos.
- Conservar textos alternativos descriptivos en español.
- Mantener el diseño, filtros y comportamiento del carrito fuera del alcance de este cambio.

## Validación

- Las ocho imágenes cargan desde archivos locales sin solicitudes a Unsplash.
- La portada, el set y los seis productos mantienen una identidad visual reconocible.
- Cada producto se distingue claramente en la cuadrícula.
- No hay texto roto, marcas de terceros ni artefactos visibles.
- La página funciona en escritorio y móvil; las imágenes cubren sus contenedores sin deformación.
- El carrito muestra la misma imagen local que la tarjeta del producto.
- El navegador no presenta errores ni recursos de imagen fallidos.

