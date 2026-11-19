import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'clinic-api-sync-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
            handleApiRequest(req, res);
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0', // Allows all computers, tablets, and phones on the clinic network to connect
    port: 3000,
    open: false
  }
});
