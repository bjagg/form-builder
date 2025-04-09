import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic'
  })],
  css: {
    modules: {
      scopeBehaviour: 'local',
    }
  },
  build: {
    minify: 'esbuild',
    sourcemap: true,
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  }
});
