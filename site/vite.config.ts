import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  plugins: [tailwindcss(), react()],
  build: {
    outDir: resolve(here, '..', 'dist-site'),
    emptyOutDir: true,
  },
  preview: { port: 4173, strictPort: true },
});
