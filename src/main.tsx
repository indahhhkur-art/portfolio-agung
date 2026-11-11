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

if (
  typeof document !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.documentElement.classList.add("js-reveal");
}

const rootEl = document.getElementById("root");
if (rootEl) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  if (rootEl.hasChildNodes()) {
    // Pastikan browser mem-paint SSR Hero & poster terlebih dahulu sebelum hidrasi JS dimulai
    window.requestAnimationFrame(() => hydrateRoot(rootEl, app));
  } else {
    createRoot(rootEl).render(app);
  }
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
    },
    { once: true }
  );
}
