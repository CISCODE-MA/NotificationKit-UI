import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testDir: 'src/__tests__',
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.ts'],
    exclude: ['node_modules/**', 'tests/e2e/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: 'coverage',
      exclude: ['src/components/Dashboard/**', 'src/layout/**', 'src/main/**'],
      thresholds: {
        lines: 75,
        statements: 75,
        branches: 60,
        functions: 75,
      },
    },
  },
});
