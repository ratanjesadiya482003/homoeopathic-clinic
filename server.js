/**
 * Production & Preview Server for  Homoeopathy React Web App
 * Features real-time multi-user live sync API & Server-Sent Events (SSE)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Bind to all interfaces for clinic LAN/Wi-Fi access
const DIST_DIR = path.join(__dirname, 'dist');
const BASE_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Handle API & Real-time Live Sync endpoints
  if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
    handleApiRequest(req, res);
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(BASE_DIR, reqPath);

  // If path doesn't exist, fallback to index.html for SPA routing
  if (!fs.existsSync(filePath)) {
    filePath = path.join(BASE_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, HOST, () => {
  // Get LAN IPs
  const nets = os.networkInterfaces();
  const lanIps = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        lanIps.push(net.address);
      }
    }
  }

  console.log(`=======================================================`);
  console.log(`⚛️   Homoeopathy Multi-User Clinic Server Running!`);
  console.log(`🌐 Local Device URL : http://localhost:${PORT}`);
  lanIps.forEach(ip => {
    console.log(`📱 Other Clinic PCs/Mobiles : http://${ip}:${PORT}`);
  });
  console.log(`📡 Real-Time SSE Sync: Active (/api/events)`);
  console.log(`📁 Serving directory: ${BASE_DIR}`);
  console.log(`=======================================================`);
});
