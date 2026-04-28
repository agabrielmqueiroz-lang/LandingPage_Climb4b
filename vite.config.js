import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        obrigado: 'obrigado.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
