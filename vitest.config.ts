import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Use threads pool — avoids "markAsUncloneable is not a function" crash that
    // the default forks pool triggers on certain Node 20 builds in CI.
    pool: 'threads',
    server: {
      deps: {
        inline: [/react/, /@testing-library/],
      },
    },
    // Exclude Playwright E2E specs — they use a different runner
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.next/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
