/**
 * ClaveAI — Vercel Serverless Function
 * Proxy hacia Google Gemini 2.5 Flash
 */

const https = require('https');

const CONFIG = {
  GOOGLE_API_KEY: (process.env.GOOGLE_API_KEY || '').trim(),
  MODEL:          process.env.MODEL || 'gemini-2.5-flash',
  MAX_TOKENS:     2048,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Método no permitido' }); return; }

  if (!CONFIG.GOOGLE_API_KEY) {
    res.status(500).json({ error: 'GOOGLE_API_KEY no configurada en Vercel' });
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
    model:            CONFIG.MODEL,
    max_tokens:       CONFIG.MAX_TOKENS,
    messages:         fullMessages,
    reasoning_effort: 'none',
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path:     '/v1beta/openai/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${CONFIG.GOOGLE_API_KEY}`,
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
          if (!text) console.warn('Gemini respuesta vacía. finish_reason:', finish, 'usage:', json.usage);
          res.status(200).json({ content: [{ type: 'text', text }] });
          resolve();
        } catch (e) {
          res.status(500).json({ error: 'Error parseando respuesta de Gemini' });
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
