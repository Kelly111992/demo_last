/**
 * ClaveAI Backend — Google Gemini 2.5 Flash
 */

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Cargar .env si existe
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const [k, v] = line.split('=');
      if (k && v) process.env[k.trim()] = v.trim();
    });
}

const CONFIG = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  PORT:       3000,
  MODEL:      'gemini-2.5-flash-preview-04-17',
  MAX_TOKENS: 800,
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
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
        console.log('\nMensaje:', messages[messages.length-1]?.content?.slice(0, 60));
        callGemini(messages, system, res);
      } catch (e) {
        console.error('Error:', e.message);
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

function callGemini(messages, system, res) {
  // Gemini OpenAI-compatible endpoint
  const fullMessages = [
    { role: 'user', content: system || 'Eres un asistente útil.' },
    { role: 'model', content: 'Entendido.' },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      content: m.content,
    })),
  ];

  const payload = JSON.stringify({
    model:      CONFIG.MODEL,
    max_tokens: CONFIG.MAX_TOKENS,
    messages:   fullMessages,
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path:     `/v1beta/openai/chat/completions`,
    method:   'POST',
    headers: {
      'Content-Type':   'application/json',
      'Authorization':  `Bearer ${CONFIG.GOOGLE_API_KEY}`,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  console.log('Enviando a Gemini, modelo:', CONFIG.MODEL);

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      console.log('Status:', apiRes.statusCode);
      try {
        const json = JSON.parse(data);
        if (json.error) {
          console.error('Error Gemini:', json.error.message || JSON.stringify(json.error));
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: json.error.message || 'Error de Gemini' }));
          return;
        }
        const text = json.choices?.[0]?.message?.content || '';
        console.log('Respuesta:', text.slice(0, 80));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
      } catch (e) {
        console.error('Error parseando:', e.message, '\nRaw:', data.slice(0, 200));
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error parseando respuesta' }));
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error('Error de red:', e.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error de red: ' + e.message }));
  });

  apiReq.write(payload);
  apiReq.end();
}

server.listen(CONFIG.PORT, () => {
  console.log('\nClaveAI Backend — Google Gemini 2.5 Flash');
  console.log('URL:    http://localhost:' + CONFIG.PORT);
  console.log('Modelo: ' + CONFIG.MODEL);
  console.log('Key:    ' + (CONFIG.GOOGLE_API_KEY ? '✓ configurada' : '✗ FALTA GOOGLE_API_KEY') + '\n');
});
