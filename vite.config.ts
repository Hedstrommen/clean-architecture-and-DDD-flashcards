/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = '/clean-architecture-and-DDD-flashcards/';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? repoName : './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
