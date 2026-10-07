import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  plugins: [tailwindcss(), react()],
  server: { host: '127.0.0.1', port: 5179, strictPort: true },
  build: {
    outDir: resolve(here, '..', 'dist-site'),
    emptyOutDir: true,
  },
  preview: { port: 4173, strictPort: true },
});
