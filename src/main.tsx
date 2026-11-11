import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-700.css";
import App from "./App.tsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  const enableReveal = () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("js-reveal");
    }
  };
  if (rootEl.hasChildNodes()) {
    // Paint SSR Hero & poster terlebih dahulu, hidrasi di frame berikutnya, lalu aktifkan js-reveal tanpa long task
    window.requestAnimationFrame(() => {
      hydrateRoot(rootEl, app);
      globalThis.setTimeout(enableReveal, 0);
    });
  } else {
    enableReveal();
    createRoot(rootEl).render(app);
  }
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
