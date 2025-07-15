import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import livePreview from 'vite-live-preview';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  plugins: [
    livePreview({
      reload: true,
      config: {
        build: {
          sourcemap: true,
        },
      },
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        plugin: 'src/plugin.ts',
        index: './index.html',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  preview: {
    port: 4400,
    cors: true,
  },
});
