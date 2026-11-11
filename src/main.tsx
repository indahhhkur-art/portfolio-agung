import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/archivo/latin-700.css";
import "@fontsource/archivo/latin-800.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import App from "./App.tsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  const startApp = () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("js-reveal");
    }
    if (rootEl.hasChildNodes()) {
      hydrateRoot(rootEl, app);
    } else {
      createRoot(rootEl).render(app);
    }
    (window as Window & { __appHydrated?: boolean }).__appHydrated = true;
  };
  // Tunggu frame paint awal agar FCP/LCP selesai terlebih dahulu sebelum hidrasi React
  window.requestAnimationFrame(() => startApp());
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  const scheduleSw = () => {
    globalThis.setTimeout(() => {
      const register = () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(register, { timeout: 1000 });
      } else {
        register();
      }
    }, 2400);
  };
  if (document.readyState === "complete") scheduleSw();
  else window.addEventListener("load", scheduleSw, { once: true });
}
