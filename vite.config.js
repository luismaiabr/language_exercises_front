import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let allowedOrigins = [
    'https://l.xseed.space',
    'https://l.xeed.space',
    'https://lcore.xseed.space',
    'https://lfront.xseed.space',
    'https://lschedule.xseed.space',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:8001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:8001',
  ];

  if (env.CORS_ORIGINS) {
    try {
      if (env.CORS_ORIGINS.startsWith('[') && env.CORS_ORIGINS.endsWith(']')) {
        allowedOrigins = JSON.parse(env.CORS_ORIGINS);
      } else {
        allowedOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
      }
    } catch (e) {
      console.warn('Could not parse CORS_ORIGINS from env, using defaults');
    }
  }

  const backendTarget = env.VITE_BACKEND_TARGET || env.VITE_API_URL || 'http://localhost:8000';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 5173,
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    },
  };
});
