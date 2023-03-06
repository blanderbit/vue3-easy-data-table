/* eslint-disable */ 
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import visualizer from "rollup-plugin-visualizer";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vue3-easy-data-table',
      fileName: (format) => `vue3-easy-data-table.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      open: process.env.VITE_APP_RUN_BUNDLE_ANALYZER,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
