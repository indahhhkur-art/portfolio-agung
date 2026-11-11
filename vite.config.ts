import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root "/" agar client build dan SSR pre-render menghasilkan path aset identik 100%
export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: {
    target: "esnext",
    cssMinify: true,
    rolldownOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id) {
              if (id.includes("node_modules/react")) return "vendor";
            }
          }
        }
  }
}));
