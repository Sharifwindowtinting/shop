import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import leadHandler from './api/lead.js';

function localApiPlugin() {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/lead', async (request, response) => {
        response.status = (statusCode) => {
          response.statusCode = statusCode;
          return response;
        };

        response.json = (payload) => {
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(payload));
        };

        await leadHandler(request, response);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), localApiPlugin()],
  };
});
