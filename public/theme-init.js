(function () {
  try {
    var root = document.documentElement;
    var k = "agung-theme";
    var t = localStorage.getItem(k);
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#0c1020" : "#4361ab");
    if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("js-reveal");
      setTimeout(function () {
        if (!window.__appHydrated) root.classList.remove("js-reveal");
      }, 6000);
    }
  } catch (_) {}
})();
