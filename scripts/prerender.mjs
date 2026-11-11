import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ssrDir = path.resolve("dist-ssr");
const entryPath = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;
const { render } = await import(entryPath);

const distDir = path.resolve("dist");
const htmlPath = path.join(distDir, "index.html");
let finalHtml = fs.readFileSync(htmlPath, "utf8");
const rendered = render();

if (!finalHtml.includes('<div id="root"></div>')) {
  throw new Error("Root mount element not found in dist/index.html");
}

// Inline single bundled CSS (~7.5 kB gzipped) to eliminate render-blocking CSS round-trip on cold loads
finalHtml = finalHtml.replace(
  /<link\s+rel="stylesheet"[^>]*href="([^"]*\/assets\/[^"]+\.css)"[^>]*>/i,
  (_match, cssHref) => {
    const rel = cssHref.replace(/^\/+/, "");
    const cssFile = path.join(distDir, rel);
    if (!fs.existsSync(cssFile)) return _match;
    const cssText = fs.readFileSync(cssFile, "utf8");
    fs.rmSync(cssFile, { force: true });
    return `<style>${cssText}</style>`;
  }
);

finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
fs.writeFileSync(htmlPath, finalHtml, "utf8");
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`SSR + inline-CSS pre-rendered dist/index.html (${(finalHtml.length / 1024).toFixed(1)} kB)`);
