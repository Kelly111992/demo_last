/* ClaveAI — navegación móvil compartida para demos de 3 paneles (.app > .sidebar/.chat-main/.dashboard)
   Añade una barra inferior con tabs para alternar Opciones / Chat / Panel en pantallas ≤768px.
   Se salta los demos que ya traen su propia navegación móvil (restaurante). */
(function () {
  function init() {
    var app = document.querySelector('.app');
    var sidebar = document.querySelector('.app > .sidebar');
    var chat = document.querySelector('.app > .chat-main');
    var dash = document.querySelector('.app > .dashboard');
    if (!app || !sidebar || !chat || !dash) return;      // no es layout de 3 paneles
    if (document.querySelector('.mobile-nav') || document.querySelector('.cnav')) return; // ya tiene nav

    var hdr = document.querySelector('.header');
    var hh = hdr ? hdr.offsetHeight : 60;
    document.documentElement.style.setProperty('--hdr-h', hh + 'px');

    var css =
      '@media(max-width:768px){' +
      '.app{grid-template-columns:1fr!important;height:calc(100dvh - var(--hdr-h,60px) - 58px)!important;position:relative!important;overflow:hidden!important}' +
      '.app>.sidebar,.app>.chat-main,.app>.dashboard{position:absolute!important;inset:0!important;width:auto!important;max-width:none!important;display:none!important;border:none!important}' +
      '.app>.sidebar.cm{display:flex!important;flex-direction:column;overflow-y:auto;padding-bottom:18px}' +
      '.app>.chat-main.cm{display:flex!important;flex-direction:column}' +
      '.app>.dashboard.cm{display:block!important;overflow-y:auto;padding-bottom:18px}' +
      '.cnav{display:flex!important;position:fixed;bottom:0;left:0;right:0;height:58px;z-index:900;' +
      'background:var(--bg,#0b0710);border-top:1px solid var(--border,rgba(255,255,255,.12));' +
      'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding-bottom:env(safe-area-inset-bottom)}' +
      '.cnav button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;' +
      'border:none;background:transparent;cursor:pointer;color:var(--muted,#8a8a9a);' +
      'font-family:inherit;font-size:10px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;' +
      'position:relative;-webkit-tap-highlight-color:transparent}' +
      '.cnav button.on{color:var(--accent,#4d9fff)}' +
      '.cnav button .ci{font-size:20px;line-height:1}' +
      '.cnav button.on::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:26px;height:2px;background:var(--accent,#4d9fff);border-radius:0 0 3px 3px}' +
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
    nav.setAttribute('aria-label', 'Navegación');
    nav.innerHTML =
      '<button data-k="s" aria-label="' + T[0].l + '"><span class="ci">' + T[0].i + '</span>' + T[0].l + '</button>' +
      '<button data-k="c" class="on" aria-label="' + T[1].l + '"><span class="ci">' + T[1].i + '</span>' + T[1].l + '</button>' +
      '<button data-k="d" aria-label="' + T[2].l + '"><span class="ci">' + T[2].i + '</span>' + T[2].l + '</button>';
    document.body.appendChild(nav);

    var map = { s: sidebar, c: chat, d: dash };
    function show(k) {
      Object.keys(map).forEach(function (x) { map[x].classList.remove('cm'); });
      map[k].classList.add('cm');
      nav.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); });
    }
    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.k); });
    });
    function sync() {
      if (window.innerWidth <= 768) {
        if (!sidebar.classList.contains('cm') && !chat.classList.contains('cm') && !dash.classList.contains('cm')) show('c');
      } else {
        sidebar.classList.remove('cm'); chat.classList.remove('cm'); dash.classList.remove('cm');
      }
    }
    window.addEventListener('resize', sync);
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
