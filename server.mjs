import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, normalize, dirname, sep } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// Resolve the project root relative to this script so the server works from any cwd.
const ROOT = dirname(fileURLToPath(import.meta.url));

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

const server = createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Decode percent-encoding and resolve the path safely under ROOT.
  // normalize() collapses '..' segments; we then verify the result is still
  // inside ROOT to prevent directory traversal.
  const decoded = decodeURIComponent(urlPath);
  const filePath = normalize(join(ROOT, decoded));
  // Ensure the resolved path is still inside ROOT (prevents directory traversal).
  // The trailing-separator check avoids false positives like C:\project vs C:\project-other.
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found: ' + urlPath);
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const mime = mimeTypes[ext] || 'application/octet-stream';

  try {
    const data = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime + '; charset=utf-8' });
    res.end(data);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error reading file: ' + e.message);
  }
});

server.listen(PORT, () => {
  console.log(`ECS HSE Test app running at http://localhost:${PORT}`);
});
