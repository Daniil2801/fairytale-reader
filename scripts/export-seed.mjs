/**
 * Copies mobile seed stories into server/data/seed-stories.json
 * Run from project root: node scripts/export-seed.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'server', 'data', 'catalog.json');

// Static snapshot — run `npx tsx` variant later if you prefer live sync from TS
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const seedPath = path.join(root, 'server', 'data', 'seed-stories.json');

// Import via dynamic read of built stories from a JSON we generate inline
const storiesModule = await import('../data/seedStories.ts').catch(() => null);

if (storiesModule?.SEED_STORIES) {
  const payload = {
    updatedAt: new Date().toISOString(),
    stories: storiesModule.SEED_STORIES,
  };
  fs.writeFileSync(seedPath, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${payload.stories.length} stories to ${seedPath}`);
} else {
  console.log('TS import unavailable; copy seed manually or use tsx.');
}
