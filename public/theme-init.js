(function () {
  try {
    var k = "agung-theme";
    var t = localStorage.getItem(k);
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#0c1020" : "#4361ab");
  } catch (_) {}
})();
