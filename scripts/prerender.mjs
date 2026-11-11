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
    return `<style>${cssText}</style>`;
  }
);

// Remove unused legacy .woff binaries and preload crisp woff2 hero fonts on same-origin HTTP/2
if (fs.existsSync(assetsDir)) {
  for (const f of fs.readdirSync(assetsDir)) {
    if (f.endsWith(".woff")) fs.rmSync(path.join(assetsDir, f), { force: true });
  }
  const assetFiles = fs.readdirSync(assetsDir);
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
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`SSR + inline-CSS + woff2-preload dist/index.html (${(finalHtml.length / 1024).toFixed(1)} kB)`);
