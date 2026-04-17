/**
 * mesaIA — Vercel Serverless Function
 * Proxy hacia Groq
 */

const https = require('https');

const CONFIG = {
  GROQ_API_KEY: (process.env.GROQ_API_KEY || '').trim(),
  MODEL: process.env.MODEL || 'llama-3.3-70b-versatile',
  MAX_TOKENS: 800,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  if (!CONFIG.GROQ_API_KEY) {
    res.status(500).json({ error: 'GROQ_API_KEY no configurada' });
    return;
  }

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages requerido' });
    return;
  }

  const fullMessages = [
    { role: 'system', content: system || 'Eres un asistente útil.' },
    ...messages,
  ];

  const payload = JSON.stringify({
    model: CONFIG.MODEL,
    max_tokens: CONFIG.MAX_TOKENS,
    messages: fullMessages,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
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
            res.status(400).json({ error: json.error.message });
            resolve();
            return;
          }
          const text = json.choices?.[0]?.message?.content || '';
          res.status(200).json({ content: [{ type: 'text', text }] });
          resolve();
        } catch (e) {
          res.status(500).json({ error: 'Error parseando respuesta de Groq' });
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
