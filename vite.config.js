import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        refunds: resolve(__dirname, 'refunds.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
