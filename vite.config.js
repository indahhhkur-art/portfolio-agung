import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" agar hasil build bisa di-hosting di subfolder (GitHub Pages, dll.)
export default defineConfig({
  base: "./",
  plugins: [react()]
});
