/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        '**/*.js',
        '**/*.mjs',
        '**/*.d.ts',
        '**/main.tsx',
        'vite.config.ts',
      ],
    },
  },
});
