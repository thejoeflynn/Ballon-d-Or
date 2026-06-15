import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React SPA dev server on :5173, calling the Spring Boot API on :8080 (CORS-enabled).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
