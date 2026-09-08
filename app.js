// Minimal Node.js web app using only the built-in http module (zero
// dependencies, so there is no third-party code in the image). Serves a small
// landing page, a JSON info endpoint, and a health check.
const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 3000;
const startedAt = new Date();

function page() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Node.js on Docker</title>
  <style>
    :root { color-scheme: light dark; }
    body { margin: 0; font: 16px/1.5 system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; background: #0f172a; color: #e2e8f0; }
    .card { background: #1e293b; padding: 2.5rem 3rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.4); text-align: center; max-width: 32rem; }
    h1 { margin: 0 0 .5rem; font-size: 1.8rem; }
    .badge { display: inline-block; background: #22c55e; color: #052e16; font-weight: 600; padding: .2rem .7rem; border-radius: 999px; font-size: .8rem; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: .35rem 1rem; text-align: left; margin: 1.5rem 0 0; font-size: .95rem; }
    dt { color: #94a3b8; } dd { margin: 0; font-family: ui-monospace, monospace; }
    a { color: #7dd3fc; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">running</span>
    <h1>Node.js app deployed with Docker</h1>
    <p>Built, pushed to Docker Hub, pulled, and run in a container.</p>
    <dl>
      <dt>Hostname</dt><dd>${os.hostname()}</dd>
      <dt>Node</dt><dd>${process.version}</dd>
      <dt>Port</dt><dd>${PORT}</dd>
      <dt>Started</dt><dd>${startedAt.toISOString()}</dd>
    </dl>
    <p><a href="/api/info">/api/info</a> &middot; <a href="/health">/health</a></p>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  }
  if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      app: 'nodejs-docker-app',
      node: process.version,
      hostname: os.hostname(),
      startedAt: startedAt.toISOString(),
    }));
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page());
});

server.listen(PORT, () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
