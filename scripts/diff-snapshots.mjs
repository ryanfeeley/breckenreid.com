#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const MANIFEST_PATH = path.resolve('qa-routes.manifest.json');
const SNAPSHOT_ROOT = path.resolve('qa-snapshots');

function routeToFilename(route) {
  if (route === '/') return 'index.html';
  return `${route.replace(/^\//, '').replaceAll('/', '__')}.html`;
}

function patternToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*');
  return new RegExp(`^${escaped}$`);
}

function isIgnored(route, ignorePatterns) {
  return ignorePatterns.some((pattern) => patternToRegExp(pattern).test(route));
}

async function readSnapshotOrNull(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function main() {
  const baselineSet = process.argv[2] || process.env.BASELINE_SET || 'baseline';
  const currentSet = process.argv[3] || process.env.CURRENT_SET || 'current';

  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  const ignorePatterns = [
    ...(manifest.allowedMissingPatterns || []),
    ...(process.env.SNAPSHOT_DIFF_IGNORE
      ? process.env.SNAPSHOT_DIFF_IGNORE.split(',').map((route) => route.trim()).filter(Boolean)
      : [])
  ];

  const failures = [];

  for (const route of manifest.routes) {
    const fileName = routeToFilename(route);
    const baselinePath = path.join(SNAPSHOT_ROOT, baselineSet, fileName);
    const currentPath = path.join(SNAPSHOT_ROOT, currentSet, fileName);

    const baseline = await readSnapshotOrNull(baselinePath);
    const current = await readSnapshotOrNull(currentPath);

    if (baseline === null) {
      failures.push(`missing baseline snapshot for ${route} (${path.relative(process.cwd(), baselinePath)})`);
      continue;
    }

    if (current === null) {
      if (isIgnored(route, ignorePatterns)) {
        console.log(`ignored missing route ${route}`);
        continue;
      }
      failures.push(`missing current snapshot for ${route} (${path.relative(process.cwd(), currentPath)})`);
      continue;
    }

    if (baseline !== current) {
      failures.push(`changed route ${route}`);
      continue;
    }

    console.log(`ok ${route}`);
  }

  if (failures.length > 0) {
    console.error('\nSnapshot diff failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\nSnapshot diff passed: all retained routes are unchanged.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
