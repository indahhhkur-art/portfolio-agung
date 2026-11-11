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

// Pertahankan stylesheet eksternal immutable (/assets/*.css) agar CSP style-src 'self' bebas 'unsafe-inline',
// buang fallback .woff lawas dari CSS yang dihasilkan, dan taruh font/style preloads di atas <link rel="stylesheet">.
let cssHrefMatched = "";
finalHtml = finalHtml.replace(
  /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]*\/assets\/[^"]+\.css)"[^>]*>/i,
  (match, cssHref) => {
    cssHrefMatched = cssHref;
    const rel = cssHref.replace(/^\/+/, "");
    const cssFile = path.join(distDir, rel);
    if (fs.existsSync(cssFile)) {
      let cssText = fs.readFileSync(cssFile, "utf8");
      cssText = cssText.replace(/,\s*url\([^)]+\.woff\)\s*format\(["']woff["']\)/g, "");
      fs.writeFileSync(cssFile, cssText, "utf8");
    }
    return match;
  }
);

let precacheCoreAssets = [];
if (fs.existsSync(assetsDir)) {
  for (const f of fs.readdirSync(assetsDir)) {
    if (f.endsWith(".woff")) fs.rmSync(path.join(assetsDir, f), { force: true });
  }
  const assetFiles = fs.readdirSync(assetsDir);
  precacheCoreAssets = assetFiles
    .filter(f => (f.startsWith("index-") || f.startsWith("vendor-")) && (f.endsWith(".js") || f.endsWith(".css")))
    .map(f => `/assets/${f}`);

  const criticalFontPrefixes = [
    "poppins-latin-600-normal",
    "poppins-latin-800-normal",
    "montserrat-latin-400-normal",
    "montserrat-latin-500-normal"
  ];
  const fontPreloads = criticalFontPrefixes
    .map(prefix => assetFiles.find(f => f.startsWith(prefix) && f.endsWith(".woff2")))
    .filter(Boolean)
    .map(f => `  <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`)
    .join("\n");

  const earlyHints = [
    cssHrefMatched ? `  <link rel="preload" as="style" href="${cssHrefMatched}" crossorigin>` : "",
    fontPreloads
  ]
    .filter(Boolean)
    .join("\n");

  if (earlyHints) {
    finalHtml = finalHtml.replace(/<link\s+[^>]*rel="stylesheet"[^>]*>/i, m => `${earlyHints}\n  ${m}`);
  }
}

finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
fs.writeFileSync(htmlPath, finalHtml, "utf8");

// Suntikkan stylesheet + bundle JS inti ke PRECACHE_ASSETS SW agar offline first-visit lengkap
const distSwPath = path.join(distDir, "sw.js");
if (fs.existsSync(distSwPath) && precacheCoreAssets.length) {
  const swText = fs.readFileSync(distSwPath, "utf8");
  const precacheList = JSON.stringify([
    "/",
    "/theme-init.js",
    "/icon.svg",
    "/icon-192.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
    "/img/hero-intro-poster.webp?v=2",
    ...precacheCoreAssets
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

// Halaman 404 bermerek memakai stylesheet eksternal immutable agar patuh CSP style-src 'self'
const cssLinkTag = cssHrefMatched ? `<link rel="stylesheet" crossorigin href="${cssHrefMatched}">` : "";
const notFoundHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#4361ab">
  <meta name="color-scheme" content="light dark">
  <script src="/theme-init.js"></script>
  <meta name="robots" content="noindex">
  <title>404 — Halaman Tidak Ditemukan | Agung Saeful</title>
  <link rel="icon" type="image/svg+xml" href="/icon.svg">
  ${cssLinkTag}
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

console.log(`SSR + external-immutable-CSS + early-preloads + SW-precache + 404 dist/index.html (${(finalHtml.length / 1024).toFixed(1)} kB)`);
