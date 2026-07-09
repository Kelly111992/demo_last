/**
 * ClaveAI — Vercel Serverless Function
 * Proxy a un LLM vía endpoint OpenAI-compatible.
 * Proveedor por prioridad: Groq (si GROQ_API_KEY) → Gemini (si GOOGLE_API_KEY).
 * Así el cambio a Groq es sin downtime: en cuanto exista GROQ_API_KEY, se usa.
 */

const https = require('https');

const GROQ_KEY   = (process.env.GROQ_API_KEY || '').trim();
const GOOGLE_KEY = (process.env.GOOGLE_API_KEY || '').trim();

// Selección de proveedor
const PROVIDER = GROQ_KEY
  ? {
      name:     'groq',
      key:      GROQ_KEY,
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      model:    process.env.MODEL || 'llama-3.3-70b-versatile',
      extra:    {},
    }
  : {
      name:     'gemini',
      key:      GOOGLE_KEY,
      hostname: 'generativelanguage.googleapis.com',
      path:     '/v1beta/openai/chat/completions',
      model:    process.env.MODEL || 'gemini-2.5-flash',
      extra:    { reasoning_effort: 'none' },
    };

const MAX_TOKENS = 2048;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Método no permitido' }); return; }

  if (!PROVIDER.key) {
    res.status(500).json({ error: 'Falta API key: configura GROQ_API_KEY (o GOOGLE_API_KEY) en Vercel' });
    return;
  }

  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages requerido' });
    return;
  }

  // OpenAI-compatible endpoint: usa system/user/assistant igual que OpenAI
  const fullMessages = [
    { role: 'system', content: system || 'Eres un asistente útil.' },
    ...messages,
  ];

  const payload = JSON.stringify({
    model:      PROVIDER.model,
    max_tokens: MAX_TOKENS,
    messages:   fullMessages,
    ...PROVIDER.extra,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: PROVIDER.hostname,
      path:     PROVIDER.path,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${PROVIDER.key}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            res.status(400).json({ error: json.error.message || JSON.stringify(json.error) });
            resolve(); return;
          }
          const text = json.choices?.[0]?.message?.content || '';
          const finish = json.choices?.[0]?.finish_reason;
          if (!text) console.warn(`[${PROVIDER.name}] respuesta vacía. finish_reason:`, finish, 'usage:', json.usage);
          res.status(200).json({ content: [{ type: 'text', text }] });
          resolve();
        } catch (e) {
          res.status(500).json({ error: `Error parseando respuesta de ${PROVIDER.name}` });
          resolve();
        }
      });
    });

    apiReq.on('error', (e) => {
      res.status(500).json({ error: 'Error de red: ' + e.message });
      resolve();
    });

    apiReq.write(payload);
    apiReq.end();
  });
};
