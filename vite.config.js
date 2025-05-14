import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to 0.0.0.0 to expose the server
    port: process.env.PORT || 5173, // Use the PORT environment variable if available
    proxy: {
      "/api": "http://localhost:8001", // Proxy API requests to localhost:8001
    },
  },
  plugins: [react()],
  define: {
    'process.env': process.env, // Ensure environment variables are accessible
  },
});