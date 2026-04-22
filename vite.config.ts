import { getNodeModule } from 'material-hu/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const spaFallback = {
  name: 'spa-fallback',
  configureServer(server: import('vite').ViteDevServer) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url ?? '/';
      const isAsset =
        url.startsWith('/@') ||
        url.startsWith('/api/') ||
        url.startsWith('/node_modules/') ||
        url.includes('.');
      if (!isAsset) req.url = '/index.html';
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), spaFallback],
  server: {
    proxy: {
      '/api/postgrest': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@material-hu/mui/lab': getNodeModule('@mui/lab'),
      '@material-hu/mui/x-date-pickers': getNodeModule('@mui/x-date-pickers'),
      '@material-hu/mui': getNodeModule('@mui/material'),
      '@material-hu/icons/material': getNodeModule('@mui/icons-material'),
      '@material-hu/icons/tabler': getNodeModule('@tabler/icons-react'),
      '@material-hu/hooks': getNodeModule('material-hu/lib/hooks'),
      '@material-hu/utils': getNodeModule('material-hu/lib/utils'),
      '@material-hu/types': getNodeModule('material-hu/lib/types'),
      '@material-hu/styles': getNodeModule('material-hu/lib/styles'),
      '@material-hu/theme': getNodeModule('material-hu/lib/theme'),
      '@material-hu/components': getNodeModule('material-hu/lib/components'),
    },
  },
});
