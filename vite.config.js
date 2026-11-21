import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';

function clinicApiPlugin() {
  return {
    name: 'clinic-api-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
          handleApiRequest(req, res);
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
          handleApiRequest(req, res);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    clinicApiPlugin()
  ],
  server: {
    host: '0.0.0.0', // Allows all computers, tablets, and phones on the clinic network to connect
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/data/**', '**/clinic_db.json*']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
});
