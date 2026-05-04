import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["distendedly-nonenlightened-shantay.ngrok-free.dev"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-clerk': ['@clerk/react'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-gsap': ['gsap'],
        },
      },
    },
  },
})