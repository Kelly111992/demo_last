/* ClaveAI — navegación móvil unificada para demos de 3 paneles (.app > .sidebar/.chat-main/.dashboard)
   Barra inferior con tabs (Opciones / Chat / Panel) que muestra un panel a la vez en ≤768px.
   Método robusto: paneles en flujo normal con height + !important (sin position:absolute),
   que funciona de forma confiable en navegadores móviles (incl. WhatsApp/iOS).
   Neutraliza cualquier nav móvil previa del demo (restaurante) para tener una sola implementación. */
(function () {
  function init() {
    var app = document.querySelector('.app');
    var sidebar = document.querySelector('.app > .sidebar');
    var chat = document.querySelector('.app > .chat-main');
    var dash = document.querySelector('.app > .dashboard');
    if (!app || !sidebar || !chat || !dash) return;   // no es layout de 3 paneles
    if (document.querySelector('.cnav')) return;       // ya inicializado

    var hdr = document.querySelector('.header');
    var setHdr = function () {
      var h = hdr ? hdr.offsetHeight : 60;
      document.documentElement.style.setProperty('--hdr-h', h + 'px');
    };
    setHdr();

    var css =
      '@media(max-width:768px){' +
      '.mobile-nav{display:none!important}' +                       /* oculta navs viejas del demo */
      '.app{display:block!important;grid-template-columns:1fr!important;height:auto!important;min-height:0!important;overflow:visible!important}' +
      '.app>.sidebar,.app>.chat-main,.app>.dashboard{position:static!important;display:none!important;width:100%!important;max-width:none!important;border:none!important;' +
      'height:calc(100vh - var(--hdr-h,60px) - 58px)!important;height:calc(100dvh - var(--hdr-h,60px) - 58px)!important}' +
      '.app>.sidebar.cm{display:flex!important;flex-direction:column;overflow-y:auto}' +
      '.app>.chat-main.cm{display:flex!important;flex-direction:column;overflow:hidden}' +
      '.app>.dashboard.cm{display:block!important;overflow-y:auto;padding-bottom:20px}' +
      '.cnav{display:flex!important;position:fixed;bottom:0;left:0;right:0;height:58px;z-index:2000;' +
      'background:var(--bg,#0b0710);border-top:1px solid var(--border,rgba(255,255,255,.14));' +
      'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}' +
      '.cnav button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;' +
      'border:none;background:transparent;cursor:pointer;color:var(--muted,#8a8a9a);' +
      'font-family:inherit;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;' +
      'position:relative;-webkit-tap-highlight-color:transparent;padding:0;height:100%}' +
      '.cnav button.on{color:var(--accent,#4d9fff)}' +
      '.cnav button .ci{font-size:21px;line-height:1}' +
      '.cnav button.on::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:30px;height:2px;background:var(--accent,#4d9fff);border-radius:0 0 3px 3px}' +
      '.cnav .cbadge{position:absolute;top:6px;left:calc(50% + 6px);min-width:16px;height:16px;padding:0 4px;border-radius:9px;' +
      'background:var(--accent,#4d9fff);color:#04120e;font-size:9px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:1}' +
      '.cnav .cbadge.on{display:flex}' +
      '}' +
      '.cnav{display:none}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var T = window.MOBILE_TABS || [
      { i: '☰', l: 'Opciones' },
      { i: '💬', l: 'Chat' },
      { i: '📊', l: 'Panel' }
    ];
    var nav = document.createElement('nav');
    nav.className = 'cnav';
    nav.setAttribute('aria-label', 'Navegación de la app');
    nav.innerHTML =
      '<button data-k="s"><span class="ci">' + T[0].i + '</span>' + T[0].l + '</button>' +
      '<button data-k="c" class="on"><span class="ci">' + T[1].i + '</span>' + T[1].l + '</button>' +
      '<button data-k="d"><span class="ci">' + T[2].i + '</span>' + T[2].l + '<span class="cbadge" id="cnavBadge"></span></button>';
    document.body.appendChild(nav);

    var map = { s: sidebar, c: chat, d: dash };
    function show(k) {
      ['s', 'c', 'd'].forEach(function (x) {
        map[x].classList.remove('cm');
        map[x].classList.remove('mobile-active');  // neutraliza nav previa (restaurante)
      });
      map[k].classList.add('cm');
      nav.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); });
      try { window.scrollTo(0, 0); } catch (e) {}
    }
    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.k); });
    });

    // Badge del carrito/panel: refleja el badge existente del demo (restaurante) si lo hay
    var srcBadge = document.getElementById('cartBadge');
    var dstBadge = document.getElementById('cnavBadge');
    function syncBadge() {
      if (!srcBadge || !dstBadge) return;
      var txt = (srcBadge.textContent || '').trim();
      if (txt && txt !== '0') { dstBadge.textContent = txt; dstBadge.classList.add('on'); }
      else { dstBadge.classList.remove('on'); }
    }
    if (srcBadge) { new MutationObserver(syncBadge).observe(srcBadge, { childList: true, characterData: true, subtree: true }); syncBadge(); }

    var current = 'c';
    function sync() {
      setHdr();
      if (window.innerWidth <= 768) {
        show(current);
      } else {
        ['s', 'c', 'd'].forEach(function (x) { map[x].classList.remove('cm'); });
      }
    }
    // recuerda el tab elegido
    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { current = b.dataset.k; });
    });
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', function () { setTimeout(sync, 250); });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  // segunda pasada por si el demo modifica el layout tras cargar
  window.addEventListener('load', function () { setTimeout(function () {
    if (!document.querySelector('.cnav')) init();
  }, 300); });
})();
