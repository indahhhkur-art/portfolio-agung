import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ssrDir = path.resolve("dist-ssr");
const entryPath = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;
const { render } = await import(entryPath);

const distDir = path.resolve("dist");
const assetsDir = path.join(distDir, "assets");
const htmlPath = path.join(distDir, "index.html");
let finalHtml = fs.readFileSync(htmlPath, "utf8");
const rendered = render();

if (!finalHtml.includes('<div id="root"></div>')) {
  throw new Error("Root mount element not found in dist/index.html");
}

let inlinedStyleTag = "";
// Inline bundled CSS (including self-hosted @font-face) to eliminate render-blocking external CSS request
finalHtml = finalHtml.replace(
  /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]*\/assets\/[^"]+\.css)"[^>]*>/i,
  (_match, cssHref) => {
    const rel = cssHref.replace(/^\/+/, "");
    const cssFile = path.join(distDir, rel);
    if (!fs.existsSync(cssFile)) return _match;
    let cssText = fs.readFileSync(cssFile, "utf8");
    // Modern browsers all support woff2; drop legacy .woff fallbacks to trim inlined CSS
    cssText = cssText.replace(/,\s*url\([^)]+\.woff\)\s*format\(["']woff["']\)/g, "");
    fs.rmSync(cssFile, { force: true });
    inlinedStyleTag = `<style>${cssText}</style>`;
    return inlinedStyleTag;
  }
);

// Remove unused legacy .woff binaries and preload crisp woff2 hero fonts on same-origin HTTP/2
let precacheJs = [];
if (fs.existsSync(assetsDir)) {
  for (const f of fs.readdirSync(assetsDir)) {
    if (f.endsWith(".woff")) fs.rmSync(path.join(assetsDir, f), { force: true });
  }
  const assetFiles = fs.readdirSync(assetsDir);
  precacheJs = assetFiles
    .filter(f => (f.startsWith("index-") || f.startsWith("vendor-")) && f.endsWith(".js"))
    .map(f => `/assets/${f}`);
  const criticalFontPrefixes = ["poppins-latin-800-normal", "montserrat-latin-400-normal"];
  const preloads = criticalFontPrefixes
    .map(prefix => assetFiles.find(f => f.startsWith(prefix) && f.endsWith(".woff2")))
    .filter(Boolean)
    .map(f => `  <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`)
    .join("\n");
  if (preloads) {
    finalHtml = finalHtml.replace("</head>", `${preloads}\n</head>`);
  }
}

finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
fs.writeFileSync(htmlPath, finalHtml, "utf8");

// Suntikkan bundle JS inti ke PRECACHE_ASSETS SW agar offline first-visit tetap memuat aplikasi
const distSwPath = path.join(distDir, "sw.js");
if (fs.existsSync(distSwPath) && precacheJs.length) {
  const swText = fs.readFileSync(distSwPath, "utf8");
  const precacheList = JSON.stringify([
    "/",
    "/icon.svg",
    "/site.webmanifest",
    "/img/hero-intro-poster.webp",
    ...precacheJs
  ]);
  fs.writeFileSync(
    distSwPath,
    swText.replace(/const PRECACHE_ASSETS = \[[^\]]*\];/, `const PRECACHE_ASSETS = ${precacheList};`),
    "utf8"
  );
}

// Pastikan .well-known/security.txt tersalin ke dist jika build tidak menyertakan dotfolder
const secSrc = path.resolve("public/.well-known/security.txt");
const secDest = path.join(distDir, ".well-known/security.txt");
if (fs.existsSync(secSrc) && !fs.existsSync(secDest)) {
  fs.mkdirSync(path.dirname(secDest), { recursive: true });
  fs.copyFileSync(secSrc, secDest);
}

// Halaman 404 bermerek agar rute typo tidak memunculkan error teks polos bawaan platform
const notFoundHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>404 — Halaman Tidak Ditemukan | Agung Saeful</title>
  <link rel="icon" type="image/svg+xml" href="/icon.svg">
  ${inlinedStyleTag}
</head>
<body>
  <main class="not-found">
    <div class="not-found__card">
      <p class="eyebrow">Error 404</p>
      <h1 class="section-heading">Halaman <span class="text-grad">Tidak Ditemukan</span></h1>
      <p class="section-sub">Tautan yang Anda buka tidak tersedia atau telah dipindahkan.</p>
      <a href="/" class="btn btn--grad">← Kembali ke Beranda</a>
    </div>
  </main>
</body>
</html>`;
fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml, "utf8");

fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`SSR + inline-CSS + woff2-preload + SW-precache + 404 dist/index.html (${(finalHtml.length / 1024).toFixed(1)} kB)`);
