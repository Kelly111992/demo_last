/* ClaveAI — feedback visual compartido (toast + resalte).
   Cuando la IA cambia algo en el panel desde el chat, el usuario debe ENTERARSE.
   - ClaveFX.toast(msg, amount)  → aviso flotante (visible también en móvil, sobre el chat).
   - ClaveFX.flash(elOrSelector) → anillo animado que resalta el elemento que cambió.
   Usa var(--accent) con fallback; funciona en cualquiera de los demos. */
window.ClaveFX = (function () {
  var injected = false;
  function ensureCSS() {
    if (injected) return; injected = true;
    var css =
      '@keyframes cfxFlash{0%{box-shadow:0 0 0 2px var(--accent,#2d8a98),0 0 16px -4px var(--accent,#2d8a98)}100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}}' +
      '.cfx-flash{animation:cfxFlash 1.5s ease-out;border-radius:6px}' +
      '.cfx-toast{position:fixed;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%) translateY(24px);' +
      'background:var(--accent,#1a5f6a);color:#fff;padding:13px 20px;border-radius:10px;font-size:13.5px;font-weight:600;font-family:inherit;' +
      'box-shadow:0 10px 34px rgba(0,0,0,0.32);z-index:3000;opacity:0;transition:opacity .28s ease,transform .28s ease;' +
      'pointer-events:none;display:flex;align-items:center;gap:9px;max-width:88vw;line-height:1.3}' +
      '.cfx-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}' +
      '.cfx-toast .cfx-amt{background:rgba(255,255,255,0.22);padding:2px 8px;border-radius:6px;font-weight:700;white-space:nowrap}' +
      '@media(max-width:768px){.cfx-toast{bottom:calc(58px + max(14px,env(safe-area-inset-bottom)))}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }
  var timer;
  function toast(msg, amount) {
    ensureCSS();
    var t = document.getElementById('cfxToast');
    if (!t) { t = document.createElement('div'); t.id = 'cfxToast'; t.className = 'cfx-toast'; document.body.appendChild(t); }
    t.innerHTML = String(msg) + (amount ? ' <span class="cfx-amt">' + amount + '</span>' : '');
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(timer);
    timer = setTimeout(function () { t.classList.remove('show'); }, 3400);
  }
  function flash(elOrSel) {
    ensureCSS();
    var el = typeof elOrSel === 'string' ? document.querySelector(elOrSel) : elOrSel;
    if (!el) return;
    el.classList.remove('cfx-flash');
    void el.offsetWidth;               // reinicia la animación
    el.classList.add('cfx-flash');
  }
  return { toast: toast, flash: flash };
})();
