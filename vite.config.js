import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" agar hasil build bisa di-hosting di subfolder maupun root domain
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "es2020",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"]
        }
      }
    }
  }
});
