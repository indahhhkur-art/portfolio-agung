import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  if (rootEl.hasChildNodes()) {
    // Pastikan browser mem-paint SSR Hero & LCP terlebih dahulu sebelum hidrasi JS dimulai
    window.requestAnimationFrame(() => hydrateRoot(rootEl, app));
  } else {
    createRoot(rootEl).render(app);
  }
}
