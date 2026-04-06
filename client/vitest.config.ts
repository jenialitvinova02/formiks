import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/AuthForm/AuthForm.tsx',
        'src/routes/ProtectedRoute.tsx',
        'src/services/setupAxiosInterceptors.ts',
        'src/pages/TemplatesPage/TemplatesPage.tsx',
      ],
      thresholds: {
        lines: 55,
        statements: 55,
        functions: 55,
        branches: 30,
      },
    },
  },
});
