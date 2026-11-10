import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" agar hasil build kompatibel untuk root maupun subfolder
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "esnext",
    cssMinify: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "vendor";
        }
      }
    }
  }
});
