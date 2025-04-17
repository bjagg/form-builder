import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: 'local',
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'FormBuilderElement',
      formats: ['umd', 'es'],
      fileName: (format) => `FormBuilderElement.${format}.js`
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  }
});
