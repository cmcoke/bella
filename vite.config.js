import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // 1. Path Aliasing
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@modules": resolve(__dirname, "./src/modules"),
      "@assets": resolve(__dirname, "./src/assets")
    }
  },

  // 2. Multi-Page Build Support
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // localhost:5173/
        about: resolve(__dirname, "portfolio.html") // localhost:5173/portfolio.html
      }
    }
  }
});
