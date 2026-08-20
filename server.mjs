import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

const PORT = 8080;
const ROOT = process.cwd();

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = ROOT + urlPath.replace(/\//g, '\\');

  if (!existsSync(filePath)) {
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
