/**
 * mesaIA — SDK compartido para todos los demos
 * Maneja llamadas al backend, historial de conversación y UI del chat
 */

const MesaIA = (() => {

  // ── Configuración ────────────────────────────
  const API_URL = 'http://localhost:3000/api/chat';

  // ── Estado ───────────────────────────────────
  let history = [];
  let isLoading = false;
  let systemPrompt = '';
  let onReplyCallback = null;

  // ── Inicializar ──────────────────────────────
  function init({ system, onReply, welcomeMessage }) {
    systemPrompt = system;
    onReplyCallback = onReply;
    history = [];

    if (welcomeMessage) {
      addBubble(welcomeMessage, 'bot');
    }
  }

  // ── Enviar mensaje ───────────────────────────
  async function send(text) {
    if (!text.trim() || isLoading) return;
    isLoading = true;

    addBubble(text, 'user');
    hideQuickReplies();
    showTyping();

    history.push({ role: 'user', content: text });

    // Soporte para system prompt dinámico (función o string)
    const currentSystem = typeof systemPrompt === 'function' ? systemPrompt() : systemPrompt;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system: currentSystem }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const reply = data.content[0].text;
      history.push({ role: 'assistant', content: reply });

      removeTyping();
      addBubble(reply, 'bot');
      if (onReplyCallback) onReplyCallback(reply);

    } catch (err) {
      removeTyping();
      console.error('MesaIA error:', err);

      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        addBubble('⚠️ No puedo conectarme al servidor. Asegúrate de que <strong>server.js</strong> esté corriendo con <code>node server/server.js</code>', 'bot error');
      } else {
        addBubble('Ups, ocurrió un error. Intenta de nuevo 🙏', 'bot');
      }
    }

    isLoading = false;
  }

  // ── UI Helpers ───────────────────────────────
  function addBubble(text, role) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `msg ${role}`;

    const isUser = role === 'user';
    const avatarEl = document.getElementById('botAvatarEmoji');
    const botEmoji = avatarEl ? avatarEl.textContent : '🤖';
    const userEmoji = document.getElementById('userEmoji')?.textContent || '👤';

    const safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    div.innerHTML = `
      <div class="msg-avatar">${isUser ? userEmoji : botEmoji}</div>
      <div class="msg-content">
        <div class="msg-bubble">${safe}</div>
        <div class="msg-time">${time}</div>
      </div>`;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="msg-avatar" id="botAvatarTyping">${document.getElementById('botAvatarEmoji')?.textContent || '🤖'}</div>
      <div class="msg-content">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  function hideQuickReplies() {
    const qr = document.getElementById('quickReplies');
    if (qr) qr.style.display = 'none';
  }

  function resetHistory() {
    history = [];
  }

  // ── Exponer API pública ──────────────────────
  return { init, send, resetHistory, addBubble };

})();

// ── Helpers globales para los HTML ───────────────
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input?.value?.trim();
  if (text) {
    MesaIA.send(text);
    input.value = '';
    input.style.height = 'auto';
  }
}

function sendQuick(text) {
  MesaIA.send(text);
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
