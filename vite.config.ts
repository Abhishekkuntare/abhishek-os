import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,

    /*
    |--------------------------------------------------------------------------
    | API Proxy
    |--------------------------------------------------------------------------
    |
    | Browser:
    | http://localhost:3000/api/execute
    |
    | gets forwarded to:
    | http://localhost:8787/api/execute
    |
    | Same proxy also handles:
    | /api/youtube/*
    | /api/ai
    | /api/health
    | etc.
    |
    |--------------------------------------------------------------------------
    */

    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
    },

    hmr:
      process.env.DISABLE_HMR !== "true",

    watch:
      process.env.DISABLE_HMR === "true"
        ? null
        : {},
  },

  /*
  |--------------------------------------------------------------------------
  | Preview
  |--------------------------------------------------------------------------
  |
  | Keeps /api working when using:
  | npm run preview
  |
  |--------------------------------------------------------------------------
  */

  preview: {
    host: "0.0.0.0",
    port: 3000,

    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: "es2020",
  },
});