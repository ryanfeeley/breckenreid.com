#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MANIFEST_PATH = path.resolve('qa-routes.manifest.json');
const SNAPSHOT_ROOT = path.resolve('qa-snapshots');

function routeToFilename(route) {
  if (route === '/') return 'index.html';
  return `${route.replace(/^\//, '').replaceAll('/', '__')}.html`;
}

function normalizeHtml(html) {
  return html
    .replace(/\bdata-astro-cid="[^"]*"/g, 'data-astro-cid="__ASTRO_CID__"')
    .replace(/\buid="[^"]*"/g, 'uid="__ASTRO_UID__"')
    .replace(/\bdata-astro-source-file="[^"]*"/g, 'data-astro-source-file="__ASTRO_SOURCE__"')
    .replace(/(_astro\/[\w-]+)\.[a-f0-9]{6,}(\.(?:js|mjs|css|json|svg|png|jpe?g|webp|avif))/gi, '$1.__HASH__$2')
    .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\b/g, '__ISO_TIMESTAMP__')
    .replace(/\b(?:generated|build(?:ing)?\s+at)\s*[:=]\s*[^<\n]+/gi, 'generated: __TIMESTAMP__')
    .replace(/\b(?:17|18|19|20)\d{8,11}\b/g, '__EPOCH_TS__')
    .trim();
}

function routeToUrl(baseUrl, route) {
  const trimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmed}${route}`;
}

async function main() {
  const setName = process.argv[2] || process.env.SNAPSHOT_SET || 'current';
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error('Missing BASE_URL. Example: BASE_URL=http://127.0.0.1:4321 npm run qa:snapshot');
  }

  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) {
    throw new Error('qa-routes.manifest.json must contain a non-empty "routes" array.');
  }

  const outputDir = path.join(SNAPSHOT_ROOT, setName);
  await mkdir(outputDir, { recursive: true });

  let failures = 0;
  for (const route of manifest.routes) {
    const url = routeToUrl(baseUrl, route);

    try {
      const candidateUrls = [url];
      if (!route.endsWith('/') && !route.includes('.')) {
        candidateUrls.push(`${url}/`);
      }

      let response;
      for (const candidate of candidateUrls) {
        response = await fetch(candidate);
        if (response.ok) break;
      }

      if (!response?.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const normalized = normalizeHtml(await response.text());
      const outputPath = path.join(outputDir, routeToFilename(route));
      await writeFile(outputPath, `${normalized}\n`, 'utf8');
      console.log(`snapshotted ${route} -> ${path.relative(process.cwd(), outputPath)}`);
    } catch (error) {
      failures += 1;
      console.error(`failed ${route} (${url}): ${error.message}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
