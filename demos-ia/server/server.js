/**
 * mesaIA Backend — OpenRouter Free
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  OPENROUTER_API_KEY: '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',
  PORT: 3000,
  MODEL: 'openrouter/auto',
  MAX_TOKENS: 800,
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { messages, system } = JSON.parse(body);
        console.log('\n📩 Mensaje:', messages[messages.length-1]?.content?.slice(0, 60));
        callOpenRouter(messages, system, res);
      } catch (e) {
        console.error('❌ Error:', e.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON inválido' }));
      }
    });
    return;
  }

  let filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(__dirname, '..', filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('No encontrado: ' + filePath);
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

function callOpenRouter(messages, system, res) {
  const fullMessages = [
    { role: 'system', content: system || 'Eres un asistente útil.' },
    ...messages,
  ];

  const payload = JSON.stringify({
    model: CONFIG.MODEL,
    max_tokens: CONFIG.MAX_TOKENS,
    messages: fullMessages,
  });

  const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'mesaIA Demos',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  console.log('🚀 Enviando a OpenRouter, modelo:', CONFIG.MODEL);

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      console.log('📥 Status:', apiRes.statusCode);
      console.log('📄 Raw:', data.slice(0, 200));
      try {
        const json = JSON.parse(data);
        if (json.error) {
          console.error('❌ Error:', json.error.message);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: json.error.message }));
          return;
        }
        const text = json.choices?.[0]?.message?.content || '';
        console.log('✅ Respuesta:', text.slice(0, 80));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
      } catch (e) {
        console.error('❌ Error parseando:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error parseando respuesta' }));
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error('❌ Error de red:', e.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error de red: ' + e.message }));
  });

  apiReq.write(payload);
  apiReq.end();
}

server.listen(CONFIG.PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   mesaIA Backend — OpenRouter Auto   ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  URL:    http://localhost:${CONFIG.PORT}        ║`);
  console.log(`║  Modelo: ${CONFIG.MODEL.padEnd(28)}║`);
  console.log('╚══════════════════════════════════════╝\n');
});
