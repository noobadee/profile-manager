import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
      routeFileIgnorePrefix: "-",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "./src/app"),
    },
  },
})
