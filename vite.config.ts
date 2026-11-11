import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root "/" agar client build dan SSR pre-render menghasilkan path aset identik 100%
export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: {
    target: ["es2020", "edge88", "firefox88", "chrome87", "safari14.1"],
    cssTarget: ["chrome87", "edge88", "firefox88", "safari14.1"],
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
