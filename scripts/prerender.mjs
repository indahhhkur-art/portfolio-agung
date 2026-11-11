import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ssrDir = path.resolve("dist-ssr");
const entryPath = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;
const { render } = await import(entryPath);

const htmlPath = path.resolve("dist/index.html");
const template = fs.readFileSync(htmlPath, "utf8");
const rendered = render();

if (!template.includes('<div id="root"></div>')) {
  throw new Error("Root mount element not found in dist/index.html");
}

const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
fs.writeFileSync(htmlPath, finalHtml, "utf8");
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`SSR pre-rendered dist/index.html (${(finalHtml.length / 1024).toFixed(1)} kB)`);
