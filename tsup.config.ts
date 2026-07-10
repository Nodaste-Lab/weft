import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  // d.ts generation is deferred: the component sources carry latent type
  // errors from the pre-tsconfig era (mostly in tests). Enable `dts: true`
  // once the type cleanup lands (tracked for the standalone weft repo).
  dts: true,
  sourcemap: true,
  clean: true,
  external: [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//, /^@fontsource/, 'class-variance-authority', 'clsx', 'cmdk', 'date-fns', 'lucide-react', 'next-themes', 'react-day-picker', 'react-hook-form', 'react-markdown', 'react-resizable-panels', 'remark-gfm', 'tailwind-merge'],
});
